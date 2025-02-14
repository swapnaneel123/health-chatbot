from flask import Flask, send_from_directory

app = Flask(__name__, static_folder="static")

# Serve index.html
@app.route("/")
def index():
    return send_from_directory("static", "index.html")

# Serve dashboard.html via the /dashboard route
@app.route("/dashboard")
def dashboard():
    return send_from_directory("static", "dashboard.html")

# Serve static files (CSS, JS, images)
@app.route("/static/<path:filename>")
def static_files(filename):
    return send_from_directory("static", filename)

if __name__ == "_main_":
    app.run(debug=True)