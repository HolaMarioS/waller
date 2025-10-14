from flask import Flask, render_template, request
import main  # tu lógica ya existente

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("panel.html")

if __name__ == "__main__":
    app.run(debug=True)
