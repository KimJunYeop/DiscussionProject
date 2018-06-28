var express = require('express');
var router = express.Router();
var redis = require('redis');
var client = redis.createClient(6379, "127.0.0.1");

var reserve = require('../api/reserve.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main');
});

router.post('/reserveWrite', function(req,res){ 
  console.log('## POST /reserveWrite');
  var inputData = req.body;
  var maxIndex;
  client.hkeys("reserve",function(err,reply){
    var keysArray = new Array();
    if(reply.length == 0) {
      maxIndex = 1;
    } else {
      reply.forEach(function(reply,index){
        keysArray.push(parseInt(reply));
      })
      maxIndex = Math.max.apply(null, keysArray) || 1;
      maxIndex++;
    }
    client.hset('reserve',maxIndex,JSON.stringify(inputData),redis.print);
    res.send();
  })
})

router.post('/reserveGet',function(req,res) {
  console.log('## POST / /reserveGet');
  var daysArray = req.body.daysArray;
  var _result = {
    response : 'false',
    resultJson : {}
  }
  client.hgetall("reserve",function(err,reply){
    for(key in reply) {
      var parseReply = JSON.parse(reply[key]);
      for(var i = 0 ; i < daysArray.length ; i++) {
        if(parseReply.date == daysArray[i]) {
          _result.response = 'true';
          _result.resultJson[key] = parseReply;
        }
      }
    }
    res.send(_result);
  })
});


router.post('/reserveGetByKey',function(req,res){
  var _result = {
    resCode : 'false',
    resultJson : {}
  }

  var key = req.body.key;
  console.log('key : ' + key);
  client.hget("reserve",key,function(err,reply){
    if(err) {
      console.log(err);
      res.send();
    }
    _result.resCode = 'true';
    _result.resultJson = reply;
    res.send(_result);
  });
})

router.get('/a',function(req,res){
  res.render('calendar');
})

module.exports = router;
