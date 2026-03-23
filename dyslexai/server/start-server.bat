@echo off
cd /d "f:\Final-yr prj\Winsurf Project\dyslexai\server"
echo Starting server...
set PORT=5000
set MONGODB_URI=mongodb://127.0.0.1:27017/dyslexai
set JWT_SECRET=your_super_secret_jwt_key_change_in_production
set JWT_EXPIRES_IN=7d
set NODE_ENV=development
echo Environment variables set
node server.js
pause
