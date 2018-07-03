var reserve = {};
var redis = require('redis');
var client = redis.createClient(6379, "127.0.0.1");
var socketio = require('socket.io');

var io = socketio.listen(8091);
console.log('socket.io 요청을 받아들일 준비가 되었습니다. port : 8091');

io.sockets.on('connection',function(socket){
  console.log('connection info : ', socket.request.connection._peername);
  socket.remoteAddress = socket.request.connection._peername.address;
  socket.remotePort = socket.request.connection._peername.port;
})

setInterval(fnCheckReserve,60000);

function fnCheckReserve() {
  var check;
  var message = {
    resCode : 'empty'
  }
  var curDate = new Date();
  curDate.setDate(curDate.getDate());

  var checkDate = (curDate.getFullYear()).toString() + fnLeadingZeros(((curDate.getMonth()+1)).toString(),2) + fnLeadingZeros((curDate.getDate()).toString(),2);

  var today = new Date();
  var hours = today.getHours();
  var minutes = today.getMinutes();
  var time = fnLeadingZeros(hours,2) + fnLeadingZeros(minutes,2);

  new Promise(function(resolve,resject){
    client.hgetall('reserve', function (err, reply) {
      for (key in reply) {
        var parseReply = JSON.parse(reply[key]);
        if (parseReply.date == checkDate) {
          check = fnCheckTime(parseReply.startTime, parseReply.endTime, time)
          if (check) {
            message.resCode = 'success';
            message.reply = JSON.stringify(parseReply);
          } 
          resolve(message);
        }
      }
      resolve(message);
    })
  }).then(function(message){
    io.sockets.emit('message',message);
  }).catch(function(err) {

  });
  // console.log('hello!');
}

function fnLeadingZeros(n, digits) {
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
      for (var i = 0; i < digits - n.length; i++)
          zero += '0';
  }
  return zero + n;
}


function fnCheckTime(startTime, endTime, curTime) {
  var result;
  var startDate = new Date();
  var endDate = new Date();
  var curDate = new Date();

  if (endDate.length == 3) {
    endDate.setHours(parseInt(endTime.substring(0, 1)), parseInt(endTime.substring(1, 3)), 0);
  } else {
    endDate.setHours(parseInt(endTime.substring(0, 2)), parseInt(endTime.substring(2, 4)), 0);
  }

  if (startTime.length == 3) {
    startDate.setHours(startTime.substring(0, 1), startTime.substring(1, 3), 0);
  } else {
    startDate.setHours(startTime.substring(0, 2), startTime.substring(2, 4), 0);
  }
  curDate.setHours(curTime.substring(0, 2), curTime.substring(2, 4), 0);

  if (startDate <= curDate && curDate <= endDate) {
    result = true;
  } else {
    result = false;
  }
  return result;
}

module.exports = reserve;