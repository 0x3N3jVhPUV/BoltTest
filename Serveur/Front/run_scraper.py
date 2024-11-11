import subprocess
import json
import os
import sys  # Import sys to access sys.executable

# Path to the channels.json file
CHANNELS_FILE = 'channels.json'  # Adjust the path if necessary

# Read the channels.json file to get the SLACK_CHANNEL name
with open(CHANNELS_FILE, 'r') as f:
    data = json.load(f)

# Get the first key in the JSON data to use as SLACK_CHANNEL
if len(data.keys()) == 1:
    SLACK_CHANNEL = list(data.keys())[0]
else:
    # Handle the case where there are multiple keys
    print("Multiple categories found in channels.json:", list(data.keys()))
    SLACK_CHANNEL = input("Please enter the category to use as SLACK_CHANNEL: ")

print(f"Using SLACK_CHANNEL: {SLACK_CHANNEL}")

# Construct the path to youtubescraping.py
youtubescraping_path = os.path.join('..', 'Back', 'youtubescraping.py')

# Use sys.executable to ensure the correct Python interpreter is used
subprocess.run([
    sys.executable,  # This ensures the virtual environment's Python is used
    youtubescraping_path,
    "--channels_file", CHANNELS_FILE,
    "--slack_channel", SLACK_CHANNEL
])

print(f"Using Python interpreter: {sys.executable}")