import subprocess
import os
import sys  # Import sys to access sys.executable

# Path to the channels directory
CHANNELS_DIR = 'channels'  # Adjust the path if necessary

# Construct the path to youtubescraping.py
youtubescraping_path = os.path.join('..', 'Back', 'youtubescraping.py')

# Use sys.executable to ensure the correct Python interpreter is used
python_executable = sys.executable

# List to keep track of subprocesses
processes = []

# Iterate over each .json file in the channels directory
for filename in os.listdir(CHANNELS_DIR):
    if filename.endswith('.json'):
        # Get the full path to the channels file
        channels_file = os.path.join(CHANNELS_DIR, filename)

        # Extract the category name from the filename (e.g., 'Ai.json' -> 'Ai')
        category_name = os.path.splitext(filename)[0]

        print(f"Processing category: {category_name}")

        # Start the subprocess without waiting for it to finish
        process = subprocess.Popen([
            python_executable,  # Use the current Python interpreter
            youtubescraping_path,
            "--channels_file", channels_file,
            "--slack_channel", category_name
        ])

        # Add the process to the list
        processes.append(process)

print(f"Using Python interpreter: {sys.executable}")

# Optionally, wait for all subprocesses to finish
for process in processes:
    process.wait()