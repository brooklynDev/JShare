module.exports = function(namespace) {
	return function(req, res, next) {
		if (typeof(namespace) == 'undefined' || namespace === '') {
			namespace = "jshare";
		}
		var app = req.app;
		if (typeof(app) == 'undefined') {
			var err = new Error("The JShare module requires express");
			next(err);
			return;
		}
		res[namespace] = {};
		res.locals.includeJShare = res.locals.JShare = function() {
			if (typeof(res[namespace]) === 'undefined' || isEmpty(res[namespace])) {
				return "";
			}
			return '<script type="text/javascript">window.' + namespace + '=' + JSON.stringify(res[namespace]) + '</script>';
		}
		next();
	};
}


function isEmpty(obj) {
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) return false;
	}
	return true;
}