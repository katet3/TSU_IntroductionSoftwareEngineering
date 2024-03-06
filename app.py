from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    template_path = 'main.html'
    return render_template(template_path)

@app.route('/section1')
def section1():
    return render_template('categories.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9999)