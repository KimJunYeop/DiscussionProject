
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
	var tableStr = '';
	var time = 8;
	var minute = 0;
	tableStr += '<thead><tr>'


	// get Date.
	var daysArray = new Date().getWeek(); ;
	tableStr += '<th scope="col">&nbsp;</th>';
	for(var i = 0 ; i < 5 ; i++) {
		tableStr += '<th scope="col">'+_dayNames[i+1]+' ('+(daysArray[i].getMonth()+1)+'/'+(daysArray[i].getDate())+')</th>';
	}
	tableStr += '</tr></thead>'

	$('#month').html(_monthNames[daysArray[0].getMonth()]);
	$('#reserveTableHeader').html(tableStr);

	var tableBodyStr = '';
	for(var i = 0 ; i < 60 ; i ++) {
		if(i%6 == 0) {
			tableBodyStr += "<tr class='hr'>";
		} else {
			tableBodyStr += "<tr>";
		}
		for(var j = 0 ; j < 5 ; j++) {
			if(i%6==0 && j == 0){
				tableBodyStr += "<td rowspan='6'>"+(time++)+"</td>"
			}
			tableBodyStr += "<td data-time="+(time-1)+':'+minute+">&nbsp;</td>"
		}
		minute += 10;
		if(minute == 60){
			minute = 0;
		}
		tableBodyStr += "</tr>"
	}
	// $('#reserveTableBody').html();
	$('#reserveTableBody tbody').html(tableBodyStr);
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

	$("#reserveTableBody td").unbind("click").bind("click",function(){
		console.log($(this));
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

function fnGetWeek(){
	
}

Date.prototype.getWeek = function(start) 
{ 
    //Calcing the starting point 
	var start = start || 0; 

	var today = new Date(this.setHours(0, 0, 0, 0)); 
	var dayPlus = today.getDate();
	today.setDate(dayPlus + _weekNext);

	var myDate = new Date("1/1/1990");
	var dayOfMonth = myDate.getDate();
	myDate.setDate(dayOfMonth - 1);

	var day = today.getDay() - start; 
	var date = today.getDate() - day; 
	var daysArray = new Array();

	for(var i=1 ; i<6 ; i++ ) {
		daysArray.push(new Date(today.setDate(date + i)));
	}

    return daysArray; 
} 