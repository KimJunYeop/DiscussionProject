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

router.post('/reserveUpdate', function(req,res) {
  var inputData = req.body;
  client.hset('reserve',key,JSON.stringify(inputData),function(err,reply){ 
    if(err) return;

    res.send();
  });
})


router.post('/reserveDelete',function(req,res) { 
  console.log('reserveDelete');

  var key = req.body.key;
  var result = {
    resCode: 'false',
  }

  client.hdel('reserve',key,function(err,reply){
    if(err) return;

    result.resCode = 'success';
    res.send(result);
  })

})

router.post('/reserveCheck',function(req,res) {
  console.log('/reserveCheck');
  var date = req.body.date;
  var time = req.body.time;
  var check;
  var result = {
    resCode : 'fail'
  }

  client.hgetall('reserve',function(err, reply){ 
    // console.log(reply);
    for(key in reply) {
      var parseReply = JSON.parse(reply[key]);
      if(parseReply.date == date) {
        console.log('1111');
        check = fnCheckTime(parseReply.startTime,parseReply.endTime,time)
        console.log(check);
        if(check){
          client.hget('reserve',key,function(err,value){
            result.resCode = 'success';
            result.reply = value;
            res.send(result);
          })
        } else {
          res.send(result);
        };
        console.log('여기 맞는 데이터가 있습니다 . : ' + parseReply.date);
      }
    }
  })
})

function fnCheckTime(startTime,endTime,curTime) {
  var startDate = new Date();
  var endDate = new Date();
  var curDate = new Date();

  endDate.setHours(parseInt(endTime.substring(0,2)),parseInt(endTime.substring(2,4)),0);
  startDate.setHours(startTime.substring(0,2),startTime.substring(2,4),0);
  curDate.setHours(curTime.substring(0,2),curTime.substring(2,4),0);
  // curDate.setHours(12,0,0);
  
  console.log(endDate.getHourse + ":" + endDate.getMinutes);
  console.log(startDate.getHourse + ":" + startDate.getMinutes);
  console.log(curDate.getHourse + ":" + curDate.getMinutes);

  if(startDate <= curDate && curDate <= endDate){
    console.log('시간사이에요있어요');
    return true;
  } else {
    console.log('시간사이에없어요.');
    return false;
  }

}

router.get('/a',function(req,res){
  res.render('calendar');
})

module.exports = router;
