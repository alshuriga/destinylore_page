import flask

from flask import request, jsonify, render_template, redirect


import json


#tag 
app = flask.Flask(__name__)
app.config["DEBUG"] = True
app.config['JSON_AS_ASCII'] = False


@app.route('/ru')
@app.route('/en')
@app.route('/pl')
def index():
    return render_template('index.html')

@app.route('/') 
def home():
	supported_languages = ["en", "ru", "pl", "de", "it", "pt", "es", "fr"]
	lang = request.accept_languages.best_match(supported_languages)
	return redirect('/'+lang)


@app.route('/req', methods=['GET'])
def req():

    if 'id' in request.args:
        id = request.args['id']
    else:
        return "Error: No id field provided. Please specify an id."

    with open('/home/alshuriga/mysite/static/books/_json/'+str(id)+'.json', encoding='utf-8') as json_file:
        data = json.load(json_file)
        response = jsonify(data)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response


@app.errorhandler(404)
def page_not_found(e):
    # your processing here
    return redirect('/en')
