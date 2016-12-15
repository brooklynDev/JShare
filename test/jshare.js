var expect = require('expect.js');
var jshare = require('../jshare.js');

describe('jshare', function() {
	it('should populate response object with jshare', function() {
		runJShareTest('jshare', {
			value: 100
		}, null, function(req, res, result) {
			expect(res.jshare).not.to.be(undefined);
		})
	})

	it('should output correct javascript script tag', function() {
		runJShareTest('jshare', {
			value: 100
		}, null, function(req, res, result) {
			expect(result).to.eql('<script type="text/javascript">function jshareMergeObject(oldJshare, newJshare){\n\tvar result = {};\n\tfor(var prop in oldJshare){\n\t\tresult[prop] = oldJshare[prop];\n\t}\n\tfor(var prop in newJshare){\n\t\tresult[prop] = newJshare[prop];\n\t}\n\treturn result;\n}window.jshare=jshareMergeObject(window.jshare, {"value":100});</script>');
		})
	})

	it('should use custom namespace in client javascript', function() {
		runJShareTest('customNamespace', {
			value: 100
		}, null, function(req, res, result) {
			expect(result).to.eql('<script type="text/javascript">function jshareMergeObject(oldJshare, newJshare){\n\tvar result = {};\n\tfor(var prop in oldJshare){\n\t\tresult[prop] = oldJshare[prop];\n\t}\n\tfor(var prop in newJshare){\n\t\tresult[prop] = newJshare[prop];\n\t}\n\treturn result;\n}window.customNamespace=jshareMergeObject(window.customNamespace, {"value":100});</script>');
		})
	})

	it('should return an empty string if no data was set on server', function() {
		runJShareTest('jshare', null, null, function(req, res, result) {
			expect(result).to.be.eql('');
		})
	})

	it('should not contain script tag', function() {
		runJShareTest('jshare', { value: 100 }, { outputScriptTag: false }, function(req, res, result) {
			expect(result.indexOf('<script>')).to.eql(-1);
		})
	})

	it('should not contain script tag in the resulting payload', function() {
		runJShareTest('jshare', { value: "</script><script>alert('xss')</script>" }, { outputScriptTag: false }, function(req, res, result) {
			expect(result.indexOf('</script><script>')).to.eql(-1);
		})
	})

	it('should contain a reference to external script', function() {
		runJShareTest('jshare', { value: 100 }, { useExternalJSFile:true }, function(req, res, result) {
			expect(result).to.be.contain("<script type='text/javascript' src='/jshare.js");
		})
	})
});

function runJShareTest(namespace, data, options, callback) {
	var app = { get: function(){}, routes:{get:{}} };
	var req = {
		app: app
	};
	var res = {
		locals: {}
	};
	var next = function() {};
	res.locals = function(helpers) {
		for(var prop in data) {
			res.jshare[prop] = data[prop];
		}
	}

	jshare(namespace)(req, res, function() {
		for(var prop in data) {
			res[namespace][prop] = data[prop];
		}

		var result = res.locals.JShare(options);
		callback(req, res, result);
	});
}