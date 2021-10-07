
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){
  var email = req.body.email;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var reqBody = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };
  var jsonReqBody = JSON.stringify(reqBody);
  var endpoint = 'https://us5.api.mailchimp.com/3.0/lists/2b67624d07';
  var options = {
    method: 'POST',
    auth: "apiKey:4f270c0130c03e896d003e396619d232-us5"
  }

  var httpPostRequest = https.request(endpoint,options,function(apiResponse){
    if(apiResponse.statusCode==200){
      res.sendFile(__dirname + "/success.html");
    } else{
      res.sendFile(__dirname + "/failure.html")
    }
  });
  httpPostRequest.write(jsonReqBody);
  httpPostRequest.end();
});

app.post("/failure",function(req,res){
  //will redirect the post request as if it's a get request to "/"
  res.redirect("/");
});

//make the server listen on either the port assigned to it from heroku or on port 3000
app.listen(process.env.PORT || 3000, function(){
  console.log("Express Server has started listening on port 3000");
});
