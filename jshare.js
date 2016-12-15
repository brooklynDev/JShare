var _ = require("underscore");
var serialize = require("serialize-javascript");

module.exports = function(namespace) {
	return function(req, res, next) {

		if(typeof(namespace) == 'undefined' || namespace === '') {
			namespace = "jshare";
		}

		var app = req.app;
		if(typeof(app) == 'undefined') {
			var err = new Error("The JShare module requires express");
			next(err);
			return;
		}

		res[namespace] = {};
		res.locals.includeJShare = res.locals.JShare = function(options) {
			if(typeof(res[namespace]) === 'undefined' || isEmpty(res[namespace])) {
				return "";
			}

			options = options ? options : getDefaultOptions();
			if(options.useExternalJSFile === true) {
				var jshareScriptFunction = function(request, response) {
					response.send(getOutputJS(false, namespace, res[namespace]));
				};
				var jshareGetRequest = _.chain(app.routes.get)
                   						.where({path: '/jshare.js'})
                   						.first().value();
				if(jshareGetRequest == undefined){
					app.get("/jshare.js", jshareScriptFunction);	
				}
				else{
					jshareGetRequest.callbacks = [jshareScriptFunction];
				}
				
				var cacheBusterRandomNumber = Math.floor((Math.random()*10000000) + 1);
				return "<script type='text/javascript' src='/jshare.js?r=" + cacheBusterRandomNumber + "'></script>";
			}

			return getOutputJS(options.outputScriptTag, namespace, res[namespace]);
		}
		next();
	};
}

function isEmpty(obj) {
	for(var prop in obj) {
		if(obj.hasOwnProperty(prop)) return false;
	}
	return true;
}

function getDefaultOptions() {
	return {
		outputScriptTag: true,
		useExternalJSFile: false
	};
}

function jshareMergeObject(oldJshare, newJshare){
	var result = {};
	for(var prop in oldJshare){
		result[prop] = oldJshare[prop];
	}
	for(var prop in newJshare){
		result[prop] = newJshare[prop];
	}
	return result;
}

function getOutputJS(outputScriptTag, namespace, obj) {
	var output = "";
	if(outputScriptTag === true) {
		output = '<script type="text/javascript">';
	}

	output += jshareMergeObject.toString();
	output += 'window.' + namespace + '=' + 'jshareMergeObject(window.' + namespace + ', ' + serialize(obj, {isJSON: true}) + ');';
	
	if(outputScriptTag === true) {
		output += '</script>';
	}

	return output;
}
