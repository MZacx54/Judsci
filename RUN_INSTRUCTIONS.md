# How to Run the App (Manual & Automatic)

## Method 1: The Easy Way (One-Click)
I have created a script called `startup.bat` on your Desktop folder `judsci`.
1.  Open the folder `judsci`.
2.  Double-click **`startup.bat`**.
3.  Two black windows will open (one for Django, one for React).
4.  The site will open in your browser (or check the link shown in the React window).

## Method 2: Manual (Command Line)
If you prefer running it manually or the script doesn't work:

### 1. Start the Backend
Open a terminal (Command Prompt or PowerShell) in the `judsci` folder:
```powershell
cd backend
.\venv\Scripts\activate
python manage.py runserver
```

### 2. Start the Frontend
Open a **new** terminal window in the `judsci` folder:
```powershell
cd frontend
npm run dev
```

## Troubleshooting
- **Port Busy?**: If it says "Port 3000 is in use", Vite will automatically pick the next one (3001, 3002, etc.). Look at the terminal output to see the correct URL.
- **Backend Error?**: Make sure you activated the virtual environment (`venv`) before running python.
