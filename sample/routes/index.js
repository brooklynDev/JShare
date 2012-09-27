
/*
 * GET home page.
 */

exports.index = function(req, res){
  var person = {firstName: "Alex", lastName: "Friedman", age: 30};
  res.jshare.person = person;
  res.render('index', { title: 'Express' });
};