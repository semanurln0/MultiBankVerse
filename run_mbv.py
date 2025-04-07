import subprocess
import time
import webbrowser
import os

def run_servers():
    project_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(project_dir)

    subprocess.Popen(["uvicorn", "main:app", "--reload"], creationflags=subprocess.CREATE_NEW_CONSOLE)
    subprocess.Popen(["python", "-m", "http.server", "5500"], creationflags=subprocess.CREATE_NEW_CONSOLE)

    webbrowser.open("http://localhost:5500/MBV.html")
    print("✅ Backend and frontend started successfully!")

if __name__ == "__main__":
    run_servers()
