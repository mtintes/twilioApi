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

  const twiml = new MessagingResponse();

  if(req.body.From !== config.admin){
    res.send();
    throw("Unauthorized request: "+ req.body);
  }

console.log("test");

var request ={
  "message":req.body.Body,
  "from":req.body.From
};

res.writeHead(200, {'Content-Type': 'text/xml'});
res.end(twiml.toString());

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

}catch(ex){
  console.log(ex);
}

})

app.post('/api/twilio/outgoing', function (req, res){
  var request = {
    "message":req.body.message
  }
  console.log(req.body);

if(request.message){
  twilioClient.sendSms(config.admin, request.message);
}

res.send();


})

app.listen(3004);
