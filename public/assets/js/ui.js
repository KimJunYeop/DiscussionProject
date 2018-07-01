
var _monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
var _dayNames = ["일", "월", "화", "수", "목", "금", "토"]
var _monthdays = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

var _weekNext = 0;
var _key;

$(document).ready(function() {
	$("#month, #prev, #next").hide();
	init();
	brickUi();
	clock();
	test();
	//test를 위한 
	//setInterval : clock 1초마다 갱신.
	setInterval('clock()', 1000);
});

function init() {
	$("#reserveUpdate").hide();
	fnTableInit();
	// $("#wraps").removeClass("reserve");
}

function test() {
	// $( "#btnReserve" ).trigger( "click" );
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
			tableBodyStr += "<td data-time="+(time-1)+fnLeadingZeros(minute,2)+" data-date=" + fnReturnDate(daysArray[j]) + " data-key = 0 ></td>"
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
	var colorIndex = 0;
	fnAjaxGetReserve(function(result){
		for(key in result) {
			var findDate = result[key].date;
			var title = result[key].title;
			var html = '';
			html += '<span class="w3-opacity">'
			html += title;
			html += '</span>'
			var test = '1';
			var lastHtml = '';
			lastHtml += '<button onclick="fnAjaxDelete('+key+')" class="w3-button w3-right w3-tinny reserveDelete" data-key="'+key+'">X</button>'
			var only = '';
			only += html;
			only += lastHtml;
			var findStartTime = result[key].startTime;
			var findEndTime = result[key].endTime;
			var timeArray = fnGetTimeBetweenArray(findStartTime,findEndTime);
			console.log(timeArray.length);
			for(var i = 0 ; i < timeArray.length ; i ++) {
				if(i==0){
					if(timeArray.length == 1) {
						$("td[data-date="+findDate+"][data-time="+timeArray[i]+"]").attr('data-key',key).addClass(fnFontColorChange(colorIndex)).html(only);
					} else {
						$("td[data-date="+findDate+"][data-time="+timeArray[i]+"]").attr('data-key',key).addClass(fnFontColorChange(colorIndex)).html(html);
					}
				} else if(i==(timeArray.length-1)){
					$("td[data-date="+findDate+"][data-time="+timeArray[i]+"]").attr('data-key',key).addClass(fnFontColorChange(colorIndex)).html(lastHtml);
				} else {
					$("td[data-date="+findDate+"][data-time="+timeArray[i]+"]").attr('data-key',key).addClass(fnFontColorChange(colorIndex));
				}
			}
			colorIndex++;
		}
	})
	reservationUi()
}

function fnFontColorChange(num){
	var result = '';
	if((num%5) == 0){ 
		result = 'w3-panel w3-pink';
	} else if ((num%5) == 1) {
		result = 'w3-panel w3-orange';
	} else if ((num%5) == 2) {
		result = 'w3-panel w3-yellow';
	} else if ((num%5) == 3) { 
		reuslt = 'w3-panel w3-blue';
	} else if ((num%5) == 4){
		result = 'w3-panel w3-light-grey';
	} else {}
	return result;
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
	$("#btnHome, #btnReserveBack, #homeTitle").click(function (){
		$("#btnHome").addClass("active").siblings().removeClass("active");
		$("#wraps").removeClass("reserve");
		$("#reserveFull").hide();
		$("#reserveIng").show();
		$("#reserveWrite").hide();
		$("#month, #prev, #next").hide();
		$("#navi").show();
	})
	
	$("#btnReserve").click(function (){
		$("#btnReserve").addClass("active").siblings().removeClass("active");
		$("#wraps").removeClass("reserve");
		$("#reserveUpdate").hide();
		$("#reserveIng").hide();
		$("#reserveFull").show();
		$("#navi").hide();
		$("#month, #prev, #next").show();
	})
	
	$("#reserveChoice").click(function (){
		$("#reserveDate").addClass("active");
	})
	
	$("#reserveChoiceOk").click(function (){
		$("#reserveDate").removeClass("active");
	})
	
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

	$('#reserveTableBody td').mousedown(function(event){
		event.stopPropagation;
		var key = $(this).attr('data-key');
		if(key == 0){
			$(this).css('background-color','red');
			$('#inputdate').val($(this).attr('data-date'));
			$('#startTime').val($(this).attr('data-time'));
			$('#reserveTableBody td').hover(function(){
				$(this).css('background-color','red');
			})
		} else {
			//key값을 이용해서 data를 가져온다.
			$("#wraps").addClass("reserve");
			$("#reserveUpdate").show();
			_key = key;
			fnGetAjaxSpecificKey(key);
		}
	});

	$('#reserveTableBody td').mouseup(function(){
		var key = $(this).attr('data-key');
		if(key == 0){
			$('#endTime').val($(this).attr('data-time'));
			$('#reserveTableBody td').unbind('mouseenter mouseleave');
			// document.getElementById('id01').style.display='block';
			$('#id01').css('display','block');
		}
	});

	$('#btnFormSubmmitCancel').on("click",function(){
		$('#reserveTableBody td[style][data-key=0]').css('background-color','');
		$('#id01').css('display','none');
	})

	$('#btnUpdateOk').on("click",function() {

		fnAjaxUpdate();
	})

	$('#btnUpdateCancel').on("click",function() {
		$("#wraps").removeClass("reserve");
		$("#reserveUpdate").hide();
	})

	
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
	var checkDate = (newDate.getFullYear()).toString() + fnLeadingZeros(((newDate.getMonth()+1)).toString(),2) + fnLeadingZeros((newDate.getDate()).toString(),2);

	$('#date').html(newDate.getFullYear() + '년 ' + _monthNames[newDate.getMonth()] + ' ' + newDate.getDate() + '일 ' + ' (' + _dayNames[newDate.getDay()] + ') 요일');

    var today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();


	fnCheckReserve(checkDate,fnLeadingZeros(hours,2),fnLeadingZeros(minutes,2));

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
 
function fnCheckReserve(checkDate,hour,minute) {
	var time = hour.toString() + minute.toString();
	var data = {
		date : checkDate,
		time : time
	}

	$.ajax({
		type: "POST",
		url: "/reserveCheck",
		data:data,
		success: function(result) {
			if(result.resCode == 'success') {
				var parseReply = JSON.parse(result.reply);
				var time = '';
				var startTime = parseReply.startTime;
				var endTime = parseReply.endTime;

				$('#curTitle').html(parseReply.title);
				time += startTime.substring(0,2) + " : " + startTime.substring(2,4);
				time += ' ~ ';
				time += endTime.substring(0,2) + " : " + endTime.substring(2,4);
				$('#curTime').html(time);
				$('#curEmployee').html(parseReply.employee);

				console.log(time);
			}
		}
	})

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
			$('#id01').css('display','none');
			fnTableValueInit();
		} 
	})
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
				$('#input_demo_01').val(display.title);
				$('#input_demo_02').val(display.employee);
				$('#input_demo_03').val(display.phone);
				$('#input_demo_04').val(display.date);
				$('#input_demo_05').val(display.startTime);
				$('#input_demo_06').val(display.endTime);
			} else {
				console.log('error..');
				return;
			}
		} 
	})
}

function fnAjaxUpdate() {

	var data = { 
		title: $('#input_demo_01').val(),
		employee: $('#input_demo_02').val(),
		phone: $('#input_demo_03').val(),
		date: $('#input_demo_04').val(), 
		startTime: $('#input_demo_05').val(),
		endTime: $('#input_demo_06').val(),
	}

	$.ajax({
		type: "POST",
		url: "/reserveUpdate",
		data: data,
		success : function(result) {
			init();
			$("#wraps").removeClass("reserve");
			$("#reserveUpdate").hide();
		}
	})
}

function fnAjaxDelete(key) {
	var data = {
		key : key
	}

	$.ajax({
		type: "POST",
		url: "/reserveDelete",
		data: data,
		success : function(result) {
			if(result.resCode == 'false'){
				console.log('delete err');
				return;
			}
			
			$("#wraps").removeClass("reserve");
			$("#reserveUpdate").hide();
			init();
		}
	})
}