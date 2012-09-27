module.exports = function(){
	return function(req,res,next){
		var app = req.app;
		if(typeof(app) == 'undefined'){
			var err = new Error("The JShare module requires express");
			next(err);
			return;
		}
		res.jshare = {};
		res.locals.includeJShare = function(req,res){
				return function(namespace){
					if(typeof(namespace) == 'undefined' || namespace === ''){
						namespace = "jshare";
					}
					if(typeof(res.jshare) === 'undefined' || isEmpty(res.jshare)){
						return "";
					}
					return '<script type="text/javascript">window.' + namespace +'=' + JSON.stringify(res.jshare) + '</script>';
				}
			}
		next();
	};
}

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}


