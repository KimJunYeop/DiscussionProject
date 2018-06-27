
var _monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
var _dayNames = ["일", "월", "화", "수", "목", "금", "토"]
var _monthdays = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

var _weekNext = 0;

$(document).ready(function() {
	init();
	reservationUi();
	brickUi();
	clock();
	test();

	//test를 위한 
	//setInterval : clock 1초마다 갱신.
	setInterval('clock()', 1000);
});


 

function init() {
	
	// console.log($('#reserveTableHeader'));


	// getMonth();
	fnTableInit();
}

function test() {
	$( "#btnReserve" ).trigger( "click" );
	$('#input_demo_01').val("Reserver System 구축");
	$('#input_demo_02').val("김준엽");
	$('#input_demo_03').val("010-2312-1111");
	$('#input_demo_04').val("17:00");
	$('#input_demo_05').val("18:00");
}

function fnTableInit() {
	var datePrint = new Date();
	var dayOfWeek = _dayNames[datePrint.getDay()];
	var tableStr = '';
	tableStr += '<thead><tr>'
	$('#month').html(_monthNames[datePrint.getMonth()]);

	// test code 
	var daysArray = new Date().getWeek(_weekNext); 
	// alert(dates[0].toLocaleDateString() + ' to '+ dates[1].toLocaleDateString());

	// var weekStartDate = dates[0].getDate();
	// var weekEndDate = dates[1].getDate();

	tableStr += '<th scope="col">&nbsp;</th>';

	// for(var i = 0 ; i < 5 ; i++) {
	// 	tableStr += '<th scope="col">'+_dayNames[i+1]+' ('+(daysArray[i].getMonth()+1)+'/'+(daysArray[i].getDate())+')</th>';
	// }

	// tableStr += '<th scope="col">월 ('+weekGetMonth+'/'+(weekStartDate+index++)+')</th>';
	// tableStr += '<th scope="col">화 ('+weekGetMonth+'/'+(weekStartDate+index++)+')</th>';
	// tableStr += '<th scope="col">수 ('+weekGetMonth+'/'+(weekStartDate+index++)+')</th>';
	// tableStr += '<th scope="col">목 ('+weekGetMonth+'/'+(weekStartDate+index++)+')</th>';
	// tableStr += '<th scope="col">금 ('+weekGetMonth+'/'+(weekStartDate+index++)+')</th>';
	tableStr += '</tr></thead>'
	$('#reserveTableHeader').html(tableStr);
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
		console.log('##_weekNext : ' + _weekNext);
		_weekNext += 7;
		fnTableInit();
	})
	
	$("#prev").unbind("click").bind("click",function(){
		fnTableInit(7);
	})
};

function fnSetNextWeek() {
	var nextmonth;
}

function fnSetPrevWeek() {

}

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
		title: $('#input_demo_01').val(),
		name: $('#input_demo_02').val(),
		phone: $('#input_demo_03').val(),
		startTime: $('#input_demo_04').val(), 
		endTime: $('#input_demo_05').val(),
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

Date.prototype.getWeek = function(start) 
{ 
    //Calcing the starting point 
	var start = start || 0; 
	console.log('start : ' + start);
    var today = new Date(this.setHours(0, 0, 0, 0)); 
	var day = today.getDay() - start; 
	//getDay = return this day of the week
    var date = today.getDate() - day; 
 
	// Grabbing Start/End Dates
	// Mon 여기서 +7 씩하면 된다 다음주나오들.

	var daysArray = new Array();
	// for(var i = 0 ; i < 5 ; i ++) {
	// 	var dayValue = new Date(today.setDate(date+1));
	// 	daysArray.push(dayValue);
	// }

	// console.log('###~~~~~~~~~~~~~~~~~~~~~~###');
	// console.log(daysArray);
	// console.log('###~~~~~~~~~~~~~~~~~~~~~~###');

	var StartDate = new Date(today.setDate(date + 1)); 
	var EndDate = new Date(today.setDate(date + 5)); 
	console.log(StartDate);
	console.log(EndDate);

    // return daysArray; 
} 