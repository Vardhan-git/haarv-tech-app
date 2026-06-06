from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from google import genai
import os

load_dotenv()

app = Flask(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

SYSTEM_PROMPT = """You are Haarv Tech AI — a friendly, expert coding tutor
for college students learning Python, SQL, React JS, Power BI and Tableau
in Vancouver, Canada.

Your style:
- Clear and direct — no fluff
- Use simple language students actually understand
- Give real examples when explaining concepts
- If someone shares broken code, find the bug and explain the fix
- Keep answers focused and well structured
- Never be condescending — every question is valid"""

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    data     = request.get_json()
    question = data.get("question", "").strip()

    if not question:
        return jsonify({"error": "No question provided"}), 400

    try:
        response = client.models.generate_content(
            model="models/gemini-2.0-flash-lite",
            contents=SYSTEM_PROMPT + "\n\nStudent question: " + question
        )
        answer = response.text
        return jsonify({"answer": answer})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)