var expect = require('expect.js');
var jshare = require('../jshare.js');

describe('jshare',function(){
	it('should populate response object with jshare', function(){
		runJShareTest('jshare',{value : 100}, function(req,res,result){
			expect(res.jshare).not.to.be(undefined);
		})
	})
	
	it('should output correct javascript script tag',function(){
		runJShareTest('jshare',{value : 100}, function(req,res,result){
			expect(result).to.eql('<script type="text/javascript">window.jshare={"value":100}</script>');
		})
	})
	
	it('should use custom namespace in client javascript',function(){
		runJShareTest('customNamespace',{value:100},function(req,res,result){
			expect(result).to.eql('<script type="text/javascript">window.customNamespace={"value":100}</script>');
		})
	})
	
	it('should return an empty string if no data was set on server',function(){
		runJShareTest('jshare',null,function(req,res,result){
			expect(result).to.be.eql('');
		})
	})
});

function runJShareTest(namespace, data,callback){
	var app = {};
	var req = {app : app};
	var res = {locals : {}};
	var next = function(){};
	res.locals = function(helpers){
		for(var prop in data){
			res.jshare[prop] = data[prop];
		}
		var result = helpers.includeJShare(req,res)();
		callback(req,res,result);
	}
	jshare(namespace)(req,res,next);
}