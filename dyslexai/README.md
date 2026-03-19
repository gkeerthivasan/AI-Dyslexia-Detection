# DyslexAI - AI-Powered Dyslexia Assistant

An intelligent web application designed to help users with dyslexia and reading difficulties improve their reading skills through AI-powered analysis, personalized exercises, and comprehensive progress tracking.

## 🚀 Features

- **Smart Reading Analysis**: Real-time speech-to-text analysis with error detection
- **Personalized Exercises**: Adaptive exercises tailored to individual needs
- **Progress Tracking**: Detailed reports and insights into reading improvement
- **Dyslexia-Friendly Interface**: Customizable accessibility settings including OpenDyslexic font
- **PDF Support**: Upload and analyze PDF documents
- **Session Management**: Save and resume reading sessions
- **Comprehensive Reporting**: ML-driven analysis with personalized recommendations

## 🛠 Tech Stack

### Frontend
- **React.js** (Vite) - Modern React framework
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization
- **React Hot Toast** - Notification system

### Backend
- **Node.js + Express.js** - REST API server
- **MongoDB + Mongoose** - Database and ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer + pdf-parse** - File handling and PDF parsing
- **Web Speech API** - Browser-based speech recognition

## 📁 Project Structure

```
dyslexai/
├── client/                    # React frontend
│   ├── public/
│   │   └── fonts/             # OpenDyslexic font files
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── context/          # React contexts
│   │   ├── pages/            # Page components
│   │   ├── utils/            # Utility functions
│   │   └── App.jsx           # Main app component
│   └── package.json
├── server/                    # Express backend
│   ├── config/               # Database configuration
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Custom middleware
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── utils/                # Server utilities
│   └── server.js             # Main server file
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dyslexai
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/dyslexai
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```

5. **Download OpenDyslexic font**
   
   Download the OpenDyslexic font files from [opendyslexic.org](https://opendyslexic.org) and place them in `client/public/fonts/`:
   - `OpenDyslexic-Regular.ttf`
   - `OpenDyslexic-Italic.ttf`
   - `OpenDyslexic-Bold.ttf`
   - `OpenDyslexic-BoldItalic.ttf`

### Running the Application

1. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   The server will start on `http://localhost:5000`

3. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

### Seed Exercises (Optional)

The application includes a seed script to populate the database with sample exercises:

```bash
cd server
npm run seed
```

## 📱 Usage

### Creating an Account

1. Visit `http://localhost:5173`
2. Click on the "Register" tab
3. Fill in your details (name, email, password)
4. Optionally provide age and dyslexia self-assessment
5. Click "Create Account"

### Demo Account

For testing purposes, you can use:
- **Email**: demo@dyslexai.com
- **Password**: demo123

### Main Features

1. **Read Content** (`/read`)
   - Upload PDF files or paste text
   - Read aloud using speech recognition
   - Get real-time error analysis
   - Track WPM and accuracy

2. **Resume Sessions** (`/resume`)
   - Continue from previous reading sessions
   - Auto-save progress every 30 seconds

3. **Practice Exercises** (`/exercises`)
   - Word recognition drills
   - Phonics exercises
   - Comprehension quizzes
   - Speed reading challenges

4. **View Reports** (`/report`)
   - Comprehensive performance analysis
   - Error pattern recognition
   - Personalized recommendations
   - Progress trends

### Accessibility Features

The application includes extensive accessibility features:

- **Font Selection**: Normal, OpenDyslexic, Arial
- **Text Sizing**: Adjustable from 16px to 32px
- **Spacing Controls**: Line height, letter spacing, word spacing
- **Color Themes**: Multiple background colors including dark mode
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: ARIA labels and semantic HTML

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Sessions
- `GET /api/sessions` - Get user sessions
- `POST /api/sessions` - Create new session
- `GET /api/sessions/:id` - Get specific session
- `PUT /api/sessions/:id` - Update session
- `PATCH /api/sessions/:id/position` - Update reading position

### Upload
- `POST /api/upload/pdf` - Upload and parse PDF
- `POST /api/upload/text` - Parse plain text

### Exercises
- `GET /api/exercises` - Get available exercises
- `POST /api/exercises/result` - Save exercise result
- `GET /api/exercises/results` - Get user results
- `GET /api/exercises/stats` - Get exercise statistics

### Reports
- `GET /api/reports/summary` - Get summary statistics
- `GET /api/reports/full` - Get full report
- `POST /api/reports/generate` - Generate new report

## 🧪 Testing

### Frontend Testing
```bash
cd client
npm test
```

### Backend Testing
```bash
cd server
npm test
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `dist` folder to your preferred hosting platform

### Backend (Heroku/Railway)
1. Set environment variables in your hosting platform
2. Deploy the server directory
3. Ensure MongoDB is accessible (use MongoDB Atlas for cloud hosting)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenDyslexic](https://opendyslexic.org/) for the dyslexia-friendly font
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for speech recognition
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the beautiful icon set

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**DyslexAI** - Making reading accessible for everyone 📚✨
