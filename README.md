# WanderSync: An AI-Powered Collaborative Travel Planner

![WanderSync App Screenshot](https://iili.io/KuDTK2s.md.png)

This repository contains the source code for **WanderSync**, my submission for the TECHWIZ 6 Global AI-Based Tech Competition. The project is a full-stack web application that uses Generative AI to create a smart, conversational, and collaborative travel planning experience.

The core idea was to move beyond static travel templates and build a tool that feels like a personal travel assistant. It understands natural language, learns from the user's past trips, allows real-time planning with friends, and provides useful, data-rich itineraries that can be exported for real-world use.

---

### Core Features

I successfully implemented all the key requirements for the project. The platform is fully functional and includes:

*   **Conversational AI:** The planning process starts with a natural chat. The AI is designed to analyze the user's initial prompt and ask intelligent, clarifying questions if details are missing.
*   **RAG-Powered Personalization:** The system has a memory. It analyzes a user's saved itineraries to create a "traveler profile." This profile is then used to personalize the AI's suggestions for new trips.
*   **Real-Time Collaboration:** Multiple users can join a trip-planning session. Using WebSockets (Flask-SocketIO), any changes made to the itinerary or messages sent in the chat are reflected on everyone's screen instantly.
*   **Dynamic Itinerary Generation:** Itineraries are generated as structured JSON, not just plain text. This allows for a dynamic, card-based UI.
*   **Data Enrichment:** Each activity in the itinerary is enriched with live data from the Google Places API (for photos, ratings, addresses) and the OpenWeatherMap API.
*   **User Accounts:** The application has a full authentication system (Register/Login) using JWT for secure session management. All trips are saved to a user's personal account in MongoDB.
*   **Export Options:** A finished itinerary can be exported as a clean, multi-page PDF or sent directly to an email address via SMTP.
*   **Voice Input:** For accessibility and ease of use, I added voice input to the chat using the browser's native Web Speech API.

---

### Tech Stack & Architecture

I chose a modern, scalable tech stack for this project. The backend and frontend are fully decoupled.

*   **Backend:**
    *   **Framework:** Flask
    *   **Architecture:** I structured the backend using a modular pattern (Blueprints, Application Factory) to keep the code clean and maintainable, avoiding a single massive `app.py` file.
    *   **Real-Time:** Flask-SocketIO with an Eventlet server for robust WebSocket performance.
    *   **Database:** MongoDB Atlas
    *   **Authentication:** Flask-JWT-Extended & Bcrypt
    *   **Key Libraries:** OpenAI, Google Maps Platform, PyOWM, SendGrid/SMTP

*   **Frontend:**
    *   **Framework:** React (bootstrapped with Vite for a faster development experience)
    *   **Styling:** Tailwind CSS for a modern, utility-first design.
    *   **Routing:** React Router
    *   **State Management:** React Hooks (useState, useEffect, useCallback) and the Context API for global state like authentication.
    *   **Real-Time:** Socket.IO Client

---

### Local Setup and Installation

To run the project on your local machine, you'll need to set up the backend and frontend separately.

**1. Backend Setup**

*   **Navigate to the `/backend` directory:**
    ```sh
    cd backend
    ```
*   **Create and activate a virtual environment:**
    ```sh
    python -m venv venv
    # On Windows: venv\Scripts\activate
    # On macOS/Linux: source venv/bin/activate
    ```
*   **Install the dependencies:**
    ```sh
    pip install -r requirements.txt
    ```
*   **Configure your environment variables:**
    *   Create a new file named `.env` in the `/backend` directory.
    *   Add your secret keys and credentials. You will need to get these from their respective platforms (OpenAI, Google Cloud, MongoDB Atlas, etc.).
      ```env
      MONGO_URI=your_mongodb_atlas_connection_string
      JWT_SECRET_KEY=generate_a_long_random_string

      OPENAI_API_KEY=your_openai_api_key
      GOOGLE_PLACES_API_KEY=your_google_places_api_key
      OPENWEATHER_API_KEY=your_openweathermap_api_key

      SMTP_SERVER=smtp.gmail.com
      SMTP_PORT=465
      SENDER_EMAIL=your_gmail_address
      SENDER_PASSWORD=your_16_character_gmail_app_password
      ```
*   **Run the server:**
    ```sh
    python app.py
    ```
    The backend API will be running at `http://127.0.0.1:5000`.

**2. Frontend Setup**

*   **Open a new terminal** and navigate to the `/frontend` directory:
    ```sh
    cd frontend
    ```
*   **Install the dependencies:**
    ```sh
    npm install
    ```
*   **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will open in your browser at `http://localhost:5173`.
