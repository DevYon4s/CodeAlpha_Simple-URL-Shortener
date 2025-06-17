# Simple URL Shortener

This project implements a simple URL shortener with a Flask backend and a React frontend.

## Prerequisites

- Python 3.6+
- Node.js 12+
- pip
- npm

## Clone the Repository

1. Clone the project repository:
   ```bash
   git clone https://github.com/DevYon4s/CodeAlpha_Simple-URL-Shortener.git
   ```
2. Navigate to the project directory:
   ```bash
   cd CodeAlpha_Simple-URL-Shortener
   ```

## Backend Setup

1.  Navigate to the backend directory: `cd backend`
2.  Create a virtual environment: `python -m venv venv`
3.  Activate the virtual environment:
    - On Windows: `venv\Scripts\activate`
    - On macOS and Linux: `source venv/bin/activate`
4.  Install the dependencies: `pip install -r requirements.txt`
5.  Create a `.env` file in the backend directory and add the following line, replacing the connection string with your actual database URL:

    ```
    DATABASE_URL="your_database_connection_string"
    ```

6.  Run the backend server: `python app.py`

## Frontend Setup

1.  Navigate to the frontend directory: `cd frontend`
2.  Install the dependencies: `npm install`
3.  Run the frontend development server: `npm run dev`

## Running the Project

1.  Start the backend server in one terminal: `python backend/app.py`
2.  Start the frontend development server in another terminal: `npm run dev`
3.  Open your browser and navigate to `http://localhost:5173` to use the URL shortener.

## Notes

The backend runs on port 5000 and the frontend runs on port 5173.
