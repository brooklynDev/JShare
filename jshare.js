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
				app.get("/jshare.js", function(request, response) {
					response.send(getOutputJS(false, namespace, res[namespace]));
				});
				return "<script type='text/javascript' src='/jshare.js'></script>";
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

function getOutputJS(outputScriptTag, namespace, obj) {
	var output = "";
	if(outputScriptTag === true) {
		output = '<script type="text/javascript">';
	}

	output += 'window.' + namespace + '=' + JSON.stringify(obj);

	if(outputScriptTag === true) {
		output += '</script>';
	}

	return output;
}