Abrovia

Your Overseas Education Navigator

Abrovia is an AI-powered overseas university guidance platform designed to help students make structured, data-informed decisions about studying abroad. The system integrates intelligent university recommendations, financial feasibility analysis, ROI insights, campus ecosystem evaluation, and transparent source-backed outputs into one unified decision-support platform.

Abrovia moves beyond simple ranking tools by combining academic compatibility, cost considerations, projected career outcomes, and campus life intelligence into a structured analytical framework.

Overview

Engineering students planning to study abroad often face fragmented information, unclear eligibility pathways, financial uncertainty, and limited insight into campus environments. Existing tools typically focus only on rankings or static filters. Abrovia centralizes these variables into a coherent system that reduces ambiguity and improves decision clarity.

The platform leverages structured AI responses while maintaining transparency and interpretability.

Core Features
University Recommendations

Profile-based filtering using academic metrics, preferences, and financial considerations.
Dynamic institution comparison to support structured selection decisions.

ROI Analysis

Tuition evaluation combined with projected salary insights.
Cost of living assessment integrated into financial feasibility analysis.
Structured return on investment breakdown for long-term planning.
Source-referenced statistical outputs where applicable.

Campus Life Insights

Housing and dorm references.
Safety indicators and contextual summaries.
Cost of living information.
Ranking summaries.
AI-generated campus ecosystem insights presented in structured format.

Transparency

Clear distinction between AI-generated summaries and referenced statistical data.
Structured JSON-based outputs to ensure consistency.
Source-aware design to maintain credibility and interpretability.

AI Integration

Abrovia integrates Google Gemini to generate structured academic and campus insights. The system enforces strict output formatting to ensure reliable JSON-based responses rather than conversational text.

The AI layer is used for:

Campus life synthesis

Contextual university evaluation

Structured ranking summaries

Insight generation beyond predefined datasets

Architecture:

Frontend built using React and Vite
Backend built using Node and Express
Google Gemini API for AI-driven structured outputs

The backend layer ensures secure API handling, consistent response parsing, and protection of sensitive credentials.

Technology Stack

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

Project Structure

abrovia/
│
├── frontend/
│ ├── src/
│ ├── components/
│ ├── pages/
│ └── configuration files
│
├── backend/
│ ├── server.cjs
│ └── environment configuration
│
└── README.md

Key Features and Design Rationale

Abrovia was designed to address gaps in conventional university selection platforms.

Intelligent Decision Structuring

Most tools rely purely on ranking-based filters. Abrovia integrates academic fit, financial feasibility, and contextual environment factors to produce structured outcomes rather than isolated metrics.

Financial Feasibility Focus

Students frequently underestimate long-term financial impact. The platform integrates tuition, living cost indicators, and projected salary insights to provide a clearer return-on-investment perspective.

Structured AI Output

Instead of conversational AI responses, Abrovia enforces structured output formatting. This improves reliability, readability, and integration with the interface.

Source Awareness

Where statistical values are referenced, transparency is emphasized. The platform differentiates between generated narrative insights and referenced statistical indicators.

Challenges Faced and Solutions Implemented
AI Response Formatting

AI models often return free-text responses or include markdown formatting. This created parsing inconsistencies. The issue was resolved by enforcing strict prompt constraints and implementing response cleaning before JSON parsing.

API Security and CORS

Direct frontend integration with external AI services resulted in security and cross-origin restrictions. Introducing a backend layer resolved credential exposure risks and ensured stable API communication.

Environment Configuration Conflicts

Managing environment variables across frontend and backend introduced configuration inconsistencies. This was addressed by clearly separating environment scopes and backend-specific credentials.

Response Reliability

AI outputs may occasionally produce malformed JSON. Defensive parsing and structured error handling were implemented to prevent application crashes and ensure graceful fallback behavior.

Architectural Separation

Maintaining clean separation between UI logic and AI processing required restructuring the application architecture. The final design separates frontend presentation, backend AI handling, and structured data flow for scalability and maintainability.

What Makes Abrovia Distinct

Integration of academic compatibility, financial feasibility, and campus ecosystem analysis within a single framework.

Structured AI outputs instead of conversational summaries.

Transparency-focused design emphasizing interpretability.

Backend-secured AI integration for reliability.

Modular architecture suitable for scaling and future enhancement.

Abrovia is positioned as a structured academic decision-support system rather than a simple university listing tool.

Developed by Team Semicolonists