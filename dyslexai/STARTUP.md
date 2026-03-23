# 🚀 DyslexAI Application Startup Guide

## Quick Start Options

### Option 1: Double-Click (Easiest)
1. **Double-click** `start.bat` (for Command Prompt)
2. **Double-click** `start.ps1` (for PowerShell)
3. **Both servers start automatically**

### Option 2: Command Line
```bash
# From project root
npm start

# Or PowerShell
npm run start-powershell
```

### Option 3: Manual Start
```bash
# Terminal 1: Server
cd server && npm start

# Terminal 2: Client  
cd client && npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Login**: demo@dyslexai.com / demo123

## 🛑 Stop Servers

- **Press any key** in startup window
- **Run**: `npm run stop`
- **Or**: Close terminal windows

## 📁 Project Structure

```
dyslexai/
├── start.bat          # Windows batch startup
├── start.ps1          # PowerShell startup  
├── package.json        # Root package scripts
├── server/            # Node.js backend
│   └── npm start      # Starts on port 5000
└── client/            # React frontend
    └── npm run dev    # Starts on port 5173
```

## 🔧 Troubleshooting

**If ports are occupied:**
```bash
# Kill existing processes
npm run stop
# Then restart
npm start
```

**If client doesn't load:**
- Check if server is running on port 5000
- Verify MongoDB connection in server logs
- Clear browser cache

**If server fails:**
- Check MongoDB connection
- Verify .env file exists
- Check Node.js version

## 🎯 First Time Setup

1. Install dependencies: `npm run install-all`
2. Start application: `npm start`
3. Open browser: http://localhost:5173
4. Login with demo credentials
5. Test all features

Enjoy your DyslexAI application! 🎉
