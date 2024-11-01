import scrapetube
import yt_dlp
import datetime
import os
import json
from slack_sdk import WebClient
import google.generativeai as genai
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
from dotenv import load_dotenv
import time
import ollama
from together import Together
import subprocess

# Load environment variables from the .env file
load_dotenv()

# Label configuration
label = "not_quality_first"

# Slack configuration
SLACK_TOKEN_BOT = os.environ.get("SLACK_TOKEN_BOT")
# Vérifiez que le token est chargé correctement
if SLACK_TOKEN_BOT is None:
    print("Erreur : SLACK_TOKEN_BOT n'est pas défini.")
else:
    print("SLACK_TOKEN_BOT chargé avec succès.")
    print("SLACK_TOKEN_BOT= ", SLACK_TOKEN_BOT)
SLACK_CHANNEL = "#crypto"

# Google Generative AI configuration
genai.configure(api_key=os.environ.get("GENAI_API_KEY"))

# Initialize Slack client
slack_client = WebClient(token=SLACK_TOKEN_BOT)
print("Slack client initialized.")

# File paths
CHANNELS_DIR = "./youtube/subscriptions"
CHANNELS_FILE = os.path.join(CHANNELS_DIR, "channels.json")
LOGS_DIR = "./youtube/logs"
VIDEO_IDS_LOG = os.path.join(LOGS_DIR, "videosIds.txt")  # Updated file name
RESUMES_LOG = os.path.join(LOGS_DIR, "resumes.txt")
LAST_CHANNEL_INDEX_FILE = os.path.join(LOGS_DIR, "last_channel_index.txt")

# Ensure logs directory exists
os.makedirs(LOGS_DIR, exist_ok=True)

def load_channels():
    """Load YouTube channel IDs from the JSON file."""
    
    # Check if the file exists
    if not os.path.exists(CHANNELS_FILE):
        print(f"Error: The file {CHANNELS_FILE} does not exist.")
        return []

    with open(CHANNELS_FILE, 'r') as file:
        data = json.load(file)
    channels = data.get("crypto", [])
    channel_ids = [url.split('/')[-1] for url in channels]
    print(f"Loaded {len(channel_ids)} channel IDs.")
    return channel_ids

def load_processed_ids():
    """Load already processed video IDs to avoid duplication."""
    if not os.path.exists(VIDEO_IDS_LOG):
        return set()
    with open(VIDEO_IDS_LOG, 'r') as file:
        processed = set(line.strip() for line in file)
    print(f"Loaded {len(processed)} processed video IDs.")
    return processed

def save_processed_id(video_id):
    """Save a processed video ID to the log."""
    with open(VIDEO_IDS_LOG, 'a') as file:
        file.write(f"{video_id}\n")

def save_resume(summary):
    """Save a generated summary to the log."""
    with open(RESUMES_LOG, 'a', encoding='utf-8') as file:
        file.write(f"{summary}\n\n---\n\n")

def get_video_ids(channel_id, processed_ids):
    """Retrieve video IDs from a specific channel, excluding already processed ones."""
    print(f"Fetching video IDs for channel: {channel_id}")
    videos = scrapetube.get_channel(
        channel_id,
        sort_by="newest",
        content_type="videos",
        limit=10
    )
    video_ids = [video['videoId'] for video in videos if video['videoId'] not in processed_ids]
    print(f"Found {len(video_ids)} new videos in channel {channel_id}.")
    return video_ids

def get_video_info(video_ids):
    """Extract information for each video ID."""
    print("Extracting video information...")
    ydl_opts = {
        'skip_download': True,
        'quiet': True,
        'no_warnings': True,
    }
    video_info = []
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        for video_id in video_ids:
            print(f"Processing video ID: {video_id}")
            try:
                info = ydl.extract_info(f"https://www.youtube.com/watch?v={video_id}", download=False)
                has_transcript = False
                try:
                    YouTubeTranscriptApi.list_transcripts(video_id)
                    has_transcript = True
                    print(f"Transcript available for video {video_id}.")
                except (TranscriptsDisabled, NoTranscriptFound):
                    print(f"No transcript available for video {video_id}.")
                video_details = {
                    'video_id': video_id,
                    'title': info.get('title'),
                    'channel_name': info.get('uploader'),
                    'video_link': info.get('webpage_url'),
                    'duration': info.get('duration'),
                    'publish_date': info.get('upload_date'),
                    'has_subtitles': has_transcript
                }
                print(f"Extracted info: {video_details}")
                video_info.append(video_details)
            except Exception as e:
                print(f"Error extracting info for video {video_id}: {e}")
    return video_info

def get_filtered_video_info(video_info):
    """Filter videos to include only those published within the last 7 days."""
    print("Filtering videos based on publication date (within the last 7 days)...")
    filtered = []
    today = datetime.date.today()
    for video in video_info:
        print(f"Evaluating video: {video['video_id']}")
        publish_date_str = video['publish_date']
        publish_date = datetime.datetime.strptime(publish_date_str, '%Y%m%d').date()
        days_old = (today - publish_date).days
        print(f"Video published {days_old} days ago.")
        if days_old <= 7:
            print(f"Adding video {video['video_id']} to filtered list.")
            filtered.append(video)
        else:
            print(f"Skipping video {video['video_id']} (published more than 1 days ago).")
    print(f"{len(filtered)} videos after filtering.")
    return filtered

def extract_transcript(video_id):
    """Extract transcript for a given video ID."""
    print(f"Extracting transcript for video ID: {video_id}")
    transcript = ""
    retries = 3  # Number of retries

    for attempt in range(retries):
        try:
            transcripts = YouTubeTranscriptApi.list_transcripts(video_id)
            transcript_obj = transcripts.find_transcript(['en', 'fr', 'es', 'de', 'it'])
            fetched_transcript = transcript_obj.fetch()
            transcript = " ".join([entry['text'] for entry in fetched_transcript])
            print(f"Transcript extracted for video {video_id}.")
            return transcript.strip()
        except (TranscriptsDisabled, NoTranscriptFound) as e:
            print(f"Attempt {attempt + 1}: No transcript available for video {video_id}.")
            if attempt < retries - 1:
                print("Retrying...")
                time.sleep(2)  # Optional: wait a bit before retrying
            else:
                print("Max retries reached. Moving to the next video.")
        except Exception as e:
            print(f"Error extracting transcript for video {video_id}: {e}")
            break

    return transcript.strip()

def generate_summary(transcript):
    """Summarize the given transcript using Google Generative AI, fallback to Together, then Ollama if needed."""
    if not transcript:
        return "No transcript provided."

    prompt = (
        f"Here is the transcription:\n"
        f"{transcript}\n\n"
        f"Fait son résumé général et concis pour un profane. Donne les conclusions à retenir et des exemples concrets. Efforce-toi d'être le plus détaillé possible pour les contenus courts "
        f"The summary should be comprehensive yet concise and reflect the content of the transcript.\n\n"
        f"End of message."
    )

    together_prompt = [
        {
            "role": "system",
            "content": "Vous êtes un assistant utile qui crée des résumés concis de contenu Web.",
        },
        {
            "role": "user",
            "content": f"Voici le transcript: {transcript}. Fait son résumé général et concis pour un profane en français. Donne les conclusions à retenir et des exemples concrets. Efforce-toi d'être le plus détaillé possible pour les contenus courts."
        },
    ]

    # Try using Google Generative AI first
    try:
        model = genai.GenerativeModel("gemini-1.5-pro-002")
        response = model.generate_content(prompt)
        if hasattr(response, 'candidates') and len(response.candidates) > 0:
            first_candidate = response.candidates[0]
            if hasattr(first_candidate, 'content') and hasattr(first_candidate.content, 'parts') and len(first_candidate.content.parts) > 0:
                summary = first_candidate.content.parts[0].text
                print("Summary generated successfully using gemini-1.5-pro-002.")
                return summary
        print("Unexpected response structure from Generative AI.")
        return "The API response structure was unexpected."
    except Exception as e:
        print(f"Error generating summary with gemini-1.5-pro-002: {e}")
        print("Falling back to Together API...")
        time.sleep(4)

    # Fallback to Together API if Google Generative AI fails
    try:
        together = Together(api_key=os.environ.get("TOGETHER_API_KEY"))
        response = together.chat.completions.create(
            model="meta-llama/Llama-3.2-3B-Instruct-Turbo",
            messages=together_prompt,
            max_tokens=1000,
            temperature=0.7,
        )
        summary = response.choices[0].message.content
        print("Summary generated successfully using Together API.")
        return summary
    except Exception as e:
        print(f"Error generating summary with Together API: {e}")
        print("Falling back to Ollama model...")

    # Fallback to Ollama if both Google Generative AI and Together API fail
    try:
        response = ollama.chat(
            model='llama3.2:1b',
            messages=[{'role': 'user', 'content': prompt}]
        )
        summary = response['message']['content']
        print("Summary generated successfully using llama3.2:1b.")
        return summary
    except Exception as e:
        return f"An error occurred while generating the summary with Ollama: {e}"

def post_to_slack(video, summary):
    """Post the video summary to Slack."""
    print(f"Posting summary to Slack for video {video['video_id']}...")
    try:
        publish_date_obj = datetime.datetime.strptime(video['publish_date'], '%Y%m%d')
        publish_date_formatted = publish_date_obj.strftime('%d %B %Y')
    except ValueError:
        publish_date_formatted = video['publish_date']

    message = (
        f"------------------------------------------------\n"
        f"*{video['title']}*\n"
        f"Date de publication : {publish_date_formatted}\n"
        f"<{video['video_link']}|Regarder la vidéo>\n"
        f"{summary}\n"
        f"Auteur : {video['channel_name']}"
    )
    try:
        slack_client.chat_postMessage(channel=SLACK_CHANNEL, text=message)
        print(f"Summary posted to Slack for video {video['video_id']}.")
    except Exception as e:
        print(f"Error posting to Slack for video {video['video_id']}: {e}")

def process_and_post_videos(videos):
    """Process each video and post summaries to Slack."""
    print("Processing and posting videos...")
    for video in videos:
        print(f"---\nProcessing video: {video['video_id']}")
        transcript = extract_transcript(video['video_id'])
        if transcript:
            print(f"Transcript (first 100 chars): {transcript[:100]}...")
        summary = generate_summary(transcript)
        print(f"Summary: {summary}")
        post_to_slack(video, summary)
        save_processed_id(video['video_id'])
        save_resume(summary)
        
        # Introduce a delay after processing each video
        print("Waiting for 10 seconds before processing the next video...")
        time.sleep(10)

    print("All videos processed and posted.")

def save_last_channel_index(index):
    """Save the last processed channel index to a file."""
    with open(LAST_CHANNEL_INDEX_FILE, 'w') as file:
        file.write(str(index))

def load_last_channel_index():
    """Load the last processed channel index from a file."""
    if os.path.exists(LAST_CHANNEL_INDEX_FILE):
        with open(LAST_CHANNEL_INDEX_FILE, 'r') as file:
            return int(file.read().strip())
    return 0

def main():
    """Fonction principale pour orchestrer le flux de travail en continu."""
    while True:
        print("Démarrage d'un nouveau cycle de traitement...")
        channel_ids = load_channels()
        processed_ids = load_processed_ids()
        last_channel_index = load_last_channel_index()

        for i in range(last_channel_index, len(channel_ids)):
            channel_id = channel_ids[i]
            video_ids = get_video_ids(channel_id, processed_ids)
            if not video_ids:
                print(f"Pas de nouvelles vidéos à traiter pour la chaîne {channel_id}.")
                continue
            video_info = get_video_info(video_ids)
            filtered_videos = get_filtered_video_info(video_info)
            if filtered_videos:
                process_and_post_videos(filtered_videos)
            else:
                print(f"Aucune vidéo ne répond aux critères pour la chaîne {channel_id}.")
            
            # Save the current channel index
            save_last_channel_index(i + 1)

        # Reset the channel index for the next cycle
        save_last_channel_index(0)
        
        # Appeler le script remove_posts.py à la fin du cycle
        print("Suppression des fichiers Slack plus anciens que 8 jours...")
        subprocess.run(["python", "./slack/remove_posts.py", SLACK_CHANNEL])

        print("Cycle de traitement terminé. Attente avant le prochain cycle...")
        time.sleep(3600)

if __name__ == "__main__":
    main()

