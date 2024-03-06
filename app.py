from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    return render_template('main.html')

@app.route('/section1', methods=['GET'])
def section1():
    return render_template('categories.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9999)