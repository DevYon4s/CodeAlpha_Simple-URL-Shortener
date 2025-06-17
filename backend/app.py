import os
import psycopg2
from flask import Flask, jsonify, request, redirect
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL")
conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()

# Create table if not exists
cursor.execute("""
CREATE TABLE IF NOT EXISTS url_mapping (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(10) UNIQUE NOT NULL,
    original_url TEXT NOT NULL
);
""")
conn.commit()


@app.route('/shorten', methods=['POST'])
def shorten_url():
    data = request.json
    original_url = data.get('url')
    if not original_url:
        return jsonify(error="URL is required"), 400

    # Generate a short code
    short_code = os.urandom(5).hex()

    # Database connection
    DATABASE_URL = os.getenv("DATABASE_URL")
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    # Store in the database
    try:
        cursor.execute("INSERT INTO url_mapping (short_code, original_url) VALUES (%s, %s) RETURNING short_code", (short_code, original_url))
        conn.commit()
        return jsonify(short_code=short_code)
    finally:
        cursor.close()
        conn.close()

@app.route('/<short_code>', methods=['GET'])
def redirect_url(short_code):
    # Database connection
    DATABASE_URL = os.getenv("DATABASE_URL")
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT original_url FROM url_mapping WHERE short_code = %s", (short_code,))
        result = cursor.fetchone()
        if result:
            return redirect(result[0])
        return jsonify(error="URL not found"), 404
    finally:
        cursor.close()
        conn.close()

# Close connection on shutdown

if __name__ == '__main__':
    app.run(debug=True)
