📚 CodeMaker – Learn Coding the Fun Way 🚀

CodeMaker is an interactive coding learning platform built with Django (backend) and React (frontend).
It provides courses, lessons, quizzes, progress tracking, and gamification to make learning to code fun and engaging. Inspired by platforms like SoloLearn, but with more flexibility and modern features.



https://github.com/Aqibkhan037/CodeMaker/blob/main/Playground_Page.jpg



✨ Features

👤 User Authentication – Signup, login, and profile management

📘 Courses & Lessons – Structured coding lessons for different topics

📝 Quizzes & Exercises – Interactive MCQs and coding challenges

🎯 Progress Tracking – Track completed lessons and quizzes

🏆 Gamification – Earn points, badges, and rank on leaderboards

💬 Community – (Future) Discussion forums & peer learning

💻 In-Browser Code Editor – Run code directly inside the app (future upgrade with Monaco Editor)

🤖 AI Coding Assistant – (Planned) Get hints & explanations from AI while learning

🛠️ Tech Stack

Frontend: React, Axios, TailwindCSS
Backend: Django, Django REST Framework
Database: SQLite (dev) / PostgreSQL (production)
Auth: JWT-based authentication
Others: Docker (optional), GitHub Actions (for CI/CD)


🚀 Getting Started
🔹 Backend (Django)
# clone repo
git clone https://github.com/yourusername/codeMaker.git
cd codeMaker/backend

# create virtual env & activate
python -m venv venv
source venv/bin/activate  # (Windows: venv\Scripts\activate)

# install dependencies
pip install -r requirements.txt

# run migrations
python manage.py migrate

# start server
python manage.py runserver

🔹 Frontend (React)
cd ../frontend

# install dependencies
npm install

# start dev server
npm start

🛡️ Future Roadmap

Add code execution inside the app

AI coding assistant for hints

Community forum for learners

Mobile app version (React Native)

🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss major changes.

📜 License

MIT License – free to use and modify.
