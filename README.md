# Mantra — AI-Enhanced News Platform

Welcome to the root of the **Mantra** project. Mantra is a full-stack news aggregation platform that uses AI to personalize your reading experience and help you understand global events through a context-aware assistant.

## 📚 Project Documentation

To make navigating this project easier, we have organized the documentation into specialized files:

- **[OVERVIEW.md](./OVERVIEW.md)**: High-level vision, architecture breakdown, and the overall tech stack.
- **[FEATURES.md](./FEATURES.md)**: A detailed catalog of every feature from AI Chat to User Personalization.
- **[RISKS.md](./RISKS.md)**: A technical and security assessment highlighting potential pitfalls and mitigation strategies.
- **[SETUP.md](./SETUP.md)**: Instructions on how to get the project running locally (Frontend + Backend).

---

## 📂 Repository Structure

The project is organized as a monorepo consisting of:

- **`mantra-frontend/`**: The React/Vite web application.
- **`mantra-backend/`**: The Node.js/Express API handling data, auth, and AI.

---

## ⚡ Quick Start (TL;DR)

1.  **Clone the project.**
2.  **Backend Setup**:
    ```bash
    cd mantra-backend
    npm install
    cp .env.example .env # Configure Supabase, Gemini, and GNews keys
    npx prisma db push
    npm run dev
    ```
3.  **Frontend Setup**:
    ```bash
    cd ../mantra-frontend
    npm install
    cp .env.example .env # Configure Supabase URL/Key
    npm run dev
    ```

---

## 🤝 Contributing
If you're looking to contribute, please review the **[RISKS.md](./RISKS.md)** first to understand our security constraints and the current state of our infrastructure.

---
*Mantra — Bridging information and insight.*
