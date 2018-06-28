
var _monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
var _dayNames = ["일", "월", "화", "수", "목", "금", "토"]
var _monthdays = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

var _weekNext = 0;

var _mouseflag = 1;

$(document).ready(function() {
	init();
	brickUi();
	clock();
	test();

	//test를 위한 
	//setInterval : clock 1초마다 갱신.
	setInterval('clock()', 1000);
});

function init() {
	fnTableInit();
}

function test() {
	$( "#btnReserve" ).trigger( "click" );
	// $('#subject').val("Reserver System 구축");
	// $('#employee').val("김준엽");
	// $('#phone').val("010-2312-1111");
}

function fnTableInit() {
	var datePrint = new Date();
	var tableStr = '';
	var time = 8;
	var minute = 0;
	tableStr += '<thead><tr>'

	// get Date.
	var daysArray = new Date().getWeek();
	tableStr += '<th scope="col">&nbsp;</th>';
	for(var i = 0 ; i < 5 ; i++) {
		tableStr += '<th scope="col">'+_dayNames[i+1]+' ('+(daysArray[i].getMonth()+1)+'/'+(daysArray[i].getDate())+')</th>';
	}
	tableStr += '</tr></thead>'

	$('#month').html(_monthNames[daysArray[0].getMonth()]);
	$('#reserveTableHeader').html(tableStr);


	// var myDate = fnReturnDate(daysArray[1]);

	var tableBodyStr = '';
	for(var i = 0 ; i < 60 ; i ++) {
		if(i%6 == 0) {
			tableBodyStr += "<tr class='hr'>";
		} else {
			tableBodyStr += "<tr>";
		}
		for(var j = 0 ; j < 5 ; j++) {
			if(i%6==0 && j == 0){
				tableBodyStr += "<td rowspan='6' class='time'>"+(time++)+"</td>"
			}
			tableBodyStr += "<td data-time="+(time-1)+fnLeadingZeros(minute,2)+" data-date=" + fnReturnDate(daysArray[j]) + "></td>"
		}
		minute += 10;
		if(minute == 60){
			minute = 0;
		}
		tableBodyStr += "</tr>"
	}
	// $('#reserveTableBody').html();
	$('#reserveTableBody tbody').html(tableBodyStr);
	fnTableValueInit();
}

function fnTableValueInit() {
	fnAjaxGetReserve(function(result){
		for(key in result) {
			var findDate = result[key].date;
			var title = result[key].title;
			var findStartTime = result[key].startTime;
			var findEndTime = result[key].endTime;
			var timeArray = fnGetTimeBetweenArray(findStartTime,findEndTime);
			for(var i = 0 ; i < timeArray.length ; i ++) {
				$("td[data-date="+findDate+"][data-time="+timeArray[i]+"]").css('background-color','red').attr('data-key',key).html(title);
			}
		}
	})
	reservationUi()
}

function fnGetTimeBetweenArray(startTime,endTime){
	var timeArray = new Array();
	if(startTime.length == 4){
		var startTimeHour = parseInt(startTime.substring(0,2));
		var startTimeMinute = parseInt(startTime.substring(2));
	} else {
		var startTimeHour = parseInt(startTime.substring(0,1));
		var startTimeMinute = parseInt(startTime.substring(1,3));
	}
	var timeValue = startTime;
	
	while(timeValue != endTime) {
		timeArray.push(timeValue);
		startTimeMinute += 10;
		if(startTimeMinute == 60) {
			startTimeHour ++;
			startTimeMinute = 0;
		}
		timeValue = startTimeHour.toString() + fnLeadingZeros(startTimeMinute.toString(),2);
	}
	timeArray.push(endTime);
	return timeArray;
}

// function fnGetEndTimeBefore(endTime) {
// 	var prevTime;

// 	if(endTime.length == 4){
// 		var hour = parseInt(endTime.substring(0,2));
// 		var minute = parseInt(endTime.substring(2));
// 	} else {
// 		var hour = parseInt(endTime.substring(0,1));
// 		var minute = parseInt(endTime.substring(1,3));
// 	}

// 	if(minute == 0) {
// 		hour -= 1;
// 		minute = 50;
// 	} else {
// 		minute -= 10;
// 	}
// 	prevTime = hour.toString() +fnLeadingZeros(minute.toString(),2);

// 	return prevTime;
// }

function fnAjaxGetReserve(resultReturn) {
	//array post로 보내게 설정
	$.ajaxSettings.traditional = true;
	var daysArray = new Date().getWeek();
	var postData = new Array();

	for(var i = 0 ; i < daysArray.length; i++) {
		postData.push(fnReturnDate(daysArray[i]));
	}

	var data = {
		'daysArray': postData
	}

	$.ajax({
		type: "POST",
		url: "/reserveGet",
		data: data,
		success: function(result){
			if(result.response == 'true'){
				resultReturn(result.resultJson)
			} else {
				console.log('fail');
				return;
			}
		} 
	})
}

function fnReturnDate(date) {
	var year = date.getFullYear();
	var month = fnLeadingZeros((date.getMonth()+1),2);
	var day = fnLeadingZeros((date.getDate()),2);

	var resultDate = year+month+day;

	return resultDate;
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
	
/*****************************************
 * reservationUi UI
*****************************************/	
function reservationUi () {
	
	$("#homeTitle, #btnHome, #btnReserveBack").click(function (){
		$("#btnHome").addClass("active").siblings().removeClass("active");
		$("#wraps").removeClass("reserve");
		$("#reserveFull").hide();
		$("#reserveIng").show();
		$("#reserveWrite").hide();
		$("#navi").show();
	})
	
	$("#btnReserve").click(function (){
		$("#btnReserve").addClass("active").siblings().removeClass("active");
		$("#wraps").addClass("reserve");
		$("#reserveIng").hide();
		$("#reserveFull").show();
		$("#navi").hide();
		$("#reserveWrite").show();
	})
	
	
	//
	$("#reserveChoice").click(function (){
		$("#reserveDate").addClass("active");
	})
	
	$("#reserveChoiceOk").click(function (){
		$("#reserveDate").removeClass("active");
	})
	
	//
	$("#reserveDataClose").click(function (){
		$("#reserveSelect").removeClass("active");
	})

	$("#btnFormSubmmit").unbind('click').bind('click',function(){
		fnAjaxWriteReserve();
	})

	$("#next").unbind("click").bind("click",function(){
		_weekNext += 7;
		fnTableInit();
	})
	
	$("#prev").unbind("click").bind("click",function(){
		_weekNext -= 7;
		fnTableInit();
	})

	$('#reserveTableBody td').unbind('click').mousedown(function(event){
		event.preventDefault();
		var key = $(this).attr('data-key');
		if(key == undefined){
			$(this).css('background-color','red');
			$('#inputdate').val($(this).attr('data-date'));
			$('#startTime').val($(this).attr('data-time'));
			$('#reserveTableBody td').hover(function(){
				$(this).css('background-color','red');
			})
		} else {
			//key값을 이용해서 data를 가져온다.
			fnGetAjaxSpecificKey(key);
		}

	});

	$('#reserveTableBody td').unbind('click').mouseup(function(){
		event.preventDefault();
		var key = $(this).attr('data-key');
		if(key == undefined){
			$('#endTime').val($(this).attr('data-time'));
			$('#reserveTableBody td').unbind('mouseenter mouseleave');
		}
	});
};

// reserveData
function reserveData() {
	$("#reserveSelect").addClass("active");
}
	
/*****************************************
 * BRICK UI
*****************************************/	
function brickUi () {
// selectmenu
	$(".selectmenu").selectmenu();
};

/***********************************************************
 * Ui - clock
 ************************************************************/
function clock() {
	
	// Create two variable with the names of the months and days in an array
	//var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
	//var dayNames= ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
	
	// Create a newDate() object
	var newDate = new Date();
	// Extract the current date from Date object
	newDate.setDate(newDate.getDate());
	// Output the day, date, month and year
	//$('#Date').html(dayNames[newDate.getDay()] + " " + newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear());
	$('#date').html(newDate.getFullYear() + '년 ' + _monthNames[newDate.getMonth()] + ' ' + newDate.getDate() + '일 ' + ' (' + _dayNames[newDate.getDay()] + ') 요일');

    var today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();

    //Set the AM or PM time
    if (hours >= 12) {
        meridiem = " 오후";
    } else {
        meridiem = " 오전";
    }

    //convert hours to 12 hour format and put 0 in front
    if (hours > 12) {
        hours = hours - 12;
    } else if (hours === 0) {
        hours = 12;
    }

    //Put 0 in front of single digit minutes and seconds
    if (minutes < 10) {
        minutes = "0" + minutes;
    } else {
        minutes = minutes;
    }

    if (seconds < 10) {
        seconds = "0" + seconds;
    } else {
        seconds = seconds;
    }
	document.getElementById("clock").innerHTML = (hours + ":" + minutes + ":" + seconds + '<span>'+ meridiem +'</span>');			
}
 
function fnAjaxWriteReserve() {

	var reserveData = {
		title: $('#subject').val(),
		employee: $('#employee').val(),
		phone: $('#phone').val(),
		date: $('#inputdate').val(), 
		startTime: $('#startTime').val(),
		endTime: $('#endTime').val()
	}

	$.ajax({
		type: "POST",
		url: "/reserveWrite",
		data: reserveData,
		success: function(){
			console.log('success!');
		} 
	})
}

function fnGetWeek(){
	
}

Date.prototype.getWeek = function(start) 
{ 
    //Calcing the starting point 
	var start = start || 0; 

	var today = new Date(this.setHours(0, 0, 0, 0)); 
	var dayPlus = today.getDate();
	today.setDate(dayPlus + _weekNext);

	// TODO :: 30일 언저리에서 바뀔때 문제가 발생한다.
	// var myDate = new Date("1/1/1990");
	// var dayOfMonth = myDate.getDate();
	// myDate.setDate(dayOfMonth - 1);

	var day = today.getDay() - start; 
	var date = today.getDate() - day; 
	var daysArray = new Array();

	for(var i=1 ; i<6 ; i++ ) {
		daysArray.push(new Date(today.setDate(date + i)));
	}

    return daysArray; 
} 

function fnGetAjaxSpecificKey(key){
	var data = {
		key : key
	}
	$.ajax({
		type: "POST",
		url: "/reserveGetByKey",
		data: data,
		success: function(result){
			console.log(result);
			if(result.resCode == 'true') {
				var display = JSON.parse(result.resultJson);
				$('#subject').val(display.title);
				$('#employee').val(display.employee);
				$('#phone').val(display.phone);
				$('#')
			} else {
				console.log('error..');
				return;
			}
		} 
	})
}