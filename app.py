from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    return render_template('main.html')

@app.route('/business', methods=['GET'])
def business():
    return render_template('categories.html')

@app.route('/more', methods=['GET'])
def more():
    return render_template('categoriesSport.html')

@app.route('/science', methods=['GET'])
def science():
    return render_template('categoriesScience.html')

@app.route('/technology', methods=['GET'])
def technology():
    return render_template('categoriesTechnology.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9999)