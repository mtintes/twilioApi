var config = require('./config');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var twilioClient = require('./twilioClient');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
 
var rp = require('request-promise-native');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function parseMessage(request){
  console.log(request);
}


app.post('/api/twilio/incoming', function (req, res) {
  console.log(req.body.Body);
  console.log(req.body.From);
try{

  validateAccess(req);

}
catch(ex){
  res.send();
  throw("Exception: "+ ex);

}

});

app.post('/api/twilio/outgoing', function (req, res){
  var request = {
    "message":req.body.message
  }
  console.log(req.body);

if(request.message){
  twilioClient.sendSms(config.admin, request.message);
}

res.send();


});

function validateAccess(req){
  var phoneNumber = req.body.From;

  console.log("who is " + phoneNumber);
  var options = {
    method: 'GET',
    uri: config.profile + '/api/profile/' + phoneNumber,
    json: true,
    headers: { 
        "Content-Type": "application/json",
        "User-Agent": "profile"
    }
  };

  rp(options).then(function(parsedBody){
    console.log(parsedBody);

    if(parsedBody.username != ""){
      console.log("Profile Valid");
      Process(req);
    }else{
      console.log("Profile Invalid");
      return false;
    }
  
  }).catch(function(err){
    console.log(err);
  });


};

function Process(req){

  var request ={
    "message":req.body.Body,
    "from":req.body.From
  };
  
  var options = {
    method: 'POST',
    uri: config.booth + '/api/booth/incoming',
    body:  {
      "message":req.body.Body,
      "from":req.body.From
    },
    json: true,
    headers: { 
        "Content-Type": "application/json",
        "User-Agent": "ideaApi"
    }
  };
  
  rp(options).then(function(parsedBody){
    console.log(parsedBody);
  
  }).catch(function(err){
    console.log(err);
  });
    
};

app.listen(3004);
