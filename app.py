from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import anthropic
import os

load_dotenv()

app = Flask(__name__)

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    data     = request.get_json()
    question = data.get("question", "").strip()

    if not question:
        return jsonify({"error": "No question provided"}), 400

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system="""You are Haarv Tech AI — a friendly, expert coding tutor 
for college students learning Python, SQL, React JS, Power BI and Tableau 
in Vancouver, Canada. 

Your style:
- Clear and direct — no fluff
- Use simple language students actually understand
- Give real examples when explaining concepts
- If someone shares broken code, find the bug and explain the fix
- Keep answers focused and well structured
- Never be condescending — every question is valid""",
        messages=[
            {"role": "user", "content": question}
        ]
    )

    answer = message.content[0].text
    return jsonify({"answer": answer})

if __name__ == "__main__":
    app.run(debug=True)