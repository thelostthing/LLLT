import logging
import os
import sys
import subprocess

# Set up logging
if getattr(sys, 'frozen', False):
    log_file = os.path.join(os.path.dirname(sys.executable), 'logfile.log')
else:
    log_file = os.path.join(os.path.dirname(__file__), 'logfile.log')

logging.basicConfig(filename=log_file, level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s')

# Log the script name and input parameters
logging.info("Script name: %s", sys.argv[0])
logging.info("Input parameters: %s", sys.argv[1:])

# Function to read idPath.txt and return a dictionary of id to exe path
def load_id_paths():
    # Determine the path to idPath.txt
    if getattr(sys, 'frozen', False):
        # If the application is frozen (running as an executable)
        file_path = os.path.join(os.path.dirname(sys.executable), 'idPath.txt')
    else:
        # If the application is running as a script
        file_path = os.path.join(os.path.dirname(__file__), 'idPath.txt')

    id_paths = {}
    try:
        with open(file_path, 'r') as f:
            for line in f:
                if '=' in line:
                    id_value, exe_path = line.strip().split('=', 1)
                    id_paths[id_value] = exe_path.strip()
    except Exception as e:
        logging.error("Error reading idPath.txt: %s", e)
    return id_paths

# Main logic
if __name__ == "__main__":
    id_paths = load_id_paths()

    if len(sys.argv) > 1:
        for i in range(len(sys.argv)):
            if sys.argv[i] == "-applaunch":
                try:
                    # Extract the ID
                    id_value = sys.argv[i + 1]  # Get the next argument after -applaunch
                    exe_path = id_paths.get(id_value)

                    if exe_path:
                        # Prepare the remaining parameters
                        remaining_params = sys.argv[1:i] + sys.argv[i + 2:]  # Exclude -applaunch and the ID
                        logging.info("Launching executable: %s with params: %s", exe_path, remaining_params)

                        # Run the executable with the remaining parameters
                        subprocess.run([exe_path] + remaining_params)
                        
                        # Exit with code 0 after launching the executable
                        sys.exit(0)
                    else:
                        logging.warning("No executable path found for ID: %s", id_value)
                except IndexError:
                    logging.error("No ID provided after -applaunch")
                break
    else:
        logging.info("No input parameters provided.")
