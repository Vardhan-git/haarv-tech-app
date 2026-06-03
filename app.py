from flask import Flask
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Create the Flask app
app = Flask(__name__)

# Load the API key
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

# Test route - just to confirm the app is running
@app.route("/")
def home():
    return "Haarv Tech is live!"

# Run the app
if __name__ == "__main__":
    app.run(debug=True)