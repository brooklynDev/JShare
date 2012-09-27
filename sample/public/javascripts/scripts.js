$(function () {
       $("#showPerson").click(function () {
           var person = jshare.person;
           var div = $("#output");
           div.html('');
           div.append("FirstName: " + person.firstName);
           div.append(", LastName: " + person.lastName);
           div.append(", Age: " + person.age);
       });
   });