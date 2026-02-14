Abrovia – Overseas Education Decision Platform

Abrovia is an AI-powered overseas university decision-support platform designed to help engineering students make structured, data-informed decisions about studying abroad.

Unlike traditional ranking-based tools, Abrovia integrates academic compatibility, financial feasibility, ROI insights, and campus ecosystem intelligence into a unified analytical system.

🌟 Features
🎓 Intelligent University Recommendations

Profile-based filtering using academic metrics and preferences

Dynamic institution comparison

Structured selection outcomes instead of simple rankings

💰 ROI & Financial Feasibility Analysis

Tuition cost evaluation

Cost of living assessment

Projected salary insights

Structured return-on-investment breakdown

Source-referenced statistical indicators

🏫 Campus Life Intelligence

Housing and dorm insights

Safety indicators

Cost of living summaries

Ranking context

AI-generated ecosystem analysis

🤖 Structured AI Output

JSON-enforced structured responses

No conversational free-text outputs

Clean response parsing for frontend integration

🔐 Backend-Secured AI Integration

Secure API key handling

Controlled AI response processing

Protection against credential exposure

🚀 Quick Start
Clone the Repository
git clone https://github.com/saniyagoutam/The-Semicolonists-Tasneem-Sadikot.git
cd The-Semicolonists-Tasneem-Sadikot

Install Dependencies
Frontend
cd frontend
npm install
npm run dev

Backend
cd backend
npm install
node server.cjs

🔧 Environment Configuration

Create a .env file inside the backend directory:

GEMINI_API_KEY=your_api_key_here
PORT=5000


Do NOT expose API keys in frontend files.

🛠️ Tech Stack
Frontend

React

TypeScript

Vite

Tailwind CSS

shadcn UI

Backend

Node.js

Express

CORS

Dotenv

Google Generative AI SDK

AI Model

Gemini 1.5 Flash

🏗️ Project Structure
abrovia/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── configuration files
│
├── backend/
│   ├── server.cjs
│   └── environment configuration
│
└── README.md

🧠 Design Philosophy
Intelligent Decision Structuring

Most platforms rely on ranking filters. Abrovia integrates:

Academic compatibility

Financial feasibility

Campus environment intelligence

This creates structured outcomes instead of isolated metrics.

Financial Clarity

Students often underestimate long-term costs.
Abrovia integrates tuition, living expenses, and salary projections to provide realistic ROI insights.

Structured AI Architecture

AI responses are enforced in strict JSON format to:

Improve reliability

Enable consistent parsing

Prevent malformed output

Maintain frontend stability

⚙️ Challenges & Solutions
AI Response Formatting

Problem: Free-text and markdown responses from AI
Solution: Strict prompt constraints + response cleaning before JSON parsing

API Security & CORS

Problem: Direct frontend AI integration caused exposure risks
Solution: Introduced backend API layer for secure handling

Environment Conflicts

Problem: Variable scope mismatches between frontend and backend
Solution: Clear separation of environment configuration

JSON Reliability

Problem: Occasional malformed AI responses
Solution: Defensive parsing and structured error handling

🌍 What Makes Abrovia Distinct

Integration of academic fit + financial feasibility + campus analysis

Structured AI output instead of conversational summaries

Transparency-focused design

Backend-secured AI architecture

Modular and scalable structure

Abrovia is positioned as a structured academic decision-support system rather than a basic university listing platform.

🤝 Contributing

Fork the repository

Create your feature branch

git checkout -b feature/YourFeature


Commit your changes

git commit -m "Add your feature"


Push to the branch

git push origin feature/YourFeature


Open a Pull Request

👥 Developed By

Team Semicolonists
