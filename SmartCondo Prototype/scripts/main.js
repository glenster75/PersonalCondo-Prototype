// Wait for Apache Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

var alreadyLoggedIn = false;
var deviceInfo = new function() {
	this.model = "";
	this.cordova = "";
	this.platform = "";
	this.uuid = "";
	this.version = "";
    this.networkState = "";
    this.lastNetworkCheck = "";
};

// PhoneGap is ready
function onDeviceReady() {
    setTimeout(function() {
        navigator.splashscreen.hide();
        deviceInfo.model = device.model;
		deviceInfo.cordova = device.cordova;
		deviceInfo.platform = device.platform;
		deviceInfo.uuid = device.uuid;
		deviceInfo.version = device.version;
        
        // TODO: Add timer:
            var states = {};
            states[Connection.UNKNOWN]  = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI]     = 'WiFi connection';
            states[Connection.CELL_2G]  = 'Cell 2G connection';
            states[Connection.CELL_3G]  = 'Cell 3G connection';
            states[Connection.CELL_4G]  = 'Cell 4G connection';
            states[Connection.CELL]     = 'Cell generic connection';
            states[Connection.NONE]     = 'No network connection';

            deviceInfo.networkState = states[navigator.connection.type];
            deviceInfo.lastNetworkCheck = new Date().toLocaleTimeString().split(" ")[0];
    }, 1000);
	feedback.initialize('6dc88a40-f100-11e3-804d-756042b1e0df');
	cameraApp = new cameraApp();
    cameraApp.run();
    geolocationApp = new geolocationApp();
	geolocationApp.run();
}

var airlinesApp = function(){}

airlinesApp.prototype = function() {
    var _flightForCheckin = null,
    _flightForDetails=null,
    _ffNum = null, 
    _customerData = null,
    _login = false,

    run = function(){
        var that = this,
        $seatPicker=$('#seatPicker');

        $('#tripDetail').on('pagebeforeshow',$.proxy(_initTripDetail,that));
        $('#boardingPass').on('pageshow',$.proxy(_initBoardingPass,that));
        $('#home').on('pagebeforecreate',$.proxy(_initHome,that));
        $('#checkIn').on('pageshow', $.proxy(_initCheckIn,that));
        $("#button_logout").on("click", function () {
            _login = false;
	    	$.mobile.changePage("#splashScreen", { transition: "flip" });
	    	//$.mobile.changePage("#logon", { transition: "flip" });
            $("#login").show();
            return false;
        });
        $("#reply-btn").on("click", function () {
	    	$.mobile.changePage("#myTrips", { transition: "flip" });
            return false;
        });
        $("#send-btn").on("click", function () {
	    	$.mobile.changePage("#myTrips", { transition: "flip" });
            return false;
        });
        $("#panicButton").on("click", function () {
            navigator.notification.vibrate(3000);
            navigator.notification.alert('Botão Pânico Enviada',
                                     null,
									 'Pânico', 
									 'OK'     
			);
	    	$.mobile.changePage("#home", { transition: "flip" });
        });
        $("#portariaNotify-btn").on("click", function () {
            navigator.notification.alert('Notificação para portaria enviada',
									 function() {
                                        setTimeout(function () {
                                            navigator.notification.beep(2);
                                            navigator.notification.vibrate(3000);
                                            navigator.notification.alert('Portaria leu notificação',
                                									 null,
                                									 'Portaria', 
                                									 'OK'     
                                			);
                                        }, 3000);
                                     },
									 'Portaria', 
									 'OK'     
			);
	    	$.mobile.changePage("#portaria", { transition: "flip" });
            return false;
        });
        
        $('#myTripsListView').on('click', 'li', function () {
        	var item = $(this);
        	_flightForCheckin = item.data('flight');
            _flightForDetails = item.data('flight');
        });
        
        $seatPicker.on('pageshow', function (event) {
        	var el = $('#seatMapPickerContainer', this),
        	seat = _flightForCheckin.segments[_flightForCheckin.currentSegment].seat;
        	seatMapDrawing.drawSeatMap(el, seat);
        
        });
        
        $seatPicker.on('pagebeforehide', function (event) {
        	_flightForCheckin.segments[_flightForCheckin.currentSegment].seat = seatMapDrawing.getselectedSeat();
        });
    },
    _initTripDetail = function(){
        var seg = _flightForDetails.segments[0];
	    $('#tripDetail-title').text(seg.from + ' to ' + seg.to);
	    $('#tripDetail-flightNum').text(seg.flightNum);
	    $('#tripDetail-depart').text(seg.departDate + ' at ' + seg.time);
	    $('#tripDetail-seat').text(seg.seat);
	    seg = _flightForDetails.segments[1];
	    $('#tripDetail-return-title').text(seg.from + ' to ' + seg.to);
	    $('#tripDetail-return-flightNum').text(seg.flightNum);
	    $('#tripDetail-return-depart').text(seg.departDate + ' at ' + seg.time);
        $('#tripDetail-return-seat').text(seg.seat);
    },
    
    _initBoardingPass = function(){
        currentseg = _flightForCheckin.segments[_flightForCheckin.currentSegment];

	    $('#boardingpass-cnum').text(_flightForCheckin.cNum);
	    $('#boardingpass-passenger').text(_customerData.firstName + ' ' + _customerData.lastName);
	    $('#boardingpass-seat').text(currentseg.seat);
	    $('#boardingpass-gate').text(currentseg.gate);
	    $('#boardingpass-depart').text(currentseg.time);
	    var flight = currentseg.flightNum + ':' + currentseg.from + ' to ' + currentseg.to;
	    $('#boardingpass-flight').text(flight);
    },
    
    _initHome = function(){
        if (!_login) {
	    	$.mobile.changePage("#splashScreen");
            setTimeout(function() {
	        	if (!alreadyLoggedIn) {
		    		$.mobile.changePage("#logon", { transition: "flip" });
    		    }
            }, 10000);
	    	$('#login').submit(function () {
	    		$(this).hide();
	    		_login = true;
	    		airData.logOn($('#userName').val(), $('#pwd').val(),_handleLogOn);
	    		return false;
	    	});
	    }
    },
    
    _initCheckIn = function(){
        var currentseg = _flightForCheckin.segments[_flightForCheckin.currentSegment],
	    seat = currentseg.seat,
	    flight = currentseg.from + ' to ' + currentseg.to;
	    $('#checkIn-flight-number').text(currentseg.flightNum);
	    $('#checkIn-flight-destination').text(flight);
        
	    $('#checkIn-seat').text(seat);
    },
    
    _handleLogOn = function (ff, success) {
		if (success) {
			_ffNum = ff;
			airData.getDataforFF(_ffNum,_handleDataForFF);
		}
	},
    
    _handleDataForFF = function (data) {
        $flightList = $('#myTripsListView');
		_customerData = data;
		$('#ffname').text(data.firstName);
		$('#ffnum').text(data.ffNum);
		$('#currentStatus').text(data.status);
		$('#miles').text(data.miles);
		$('#numberOfFlights').text("2");
		for (var i in data.flights) {
			var flight = data.flights[i],
            currentSegment = flight.segments[flight.currentSegment];
			$flightList.append('<li id="' + flight.id + '"><a href="#tripDetail" data-transition="slide">' + currentSegment.from + ' to ' + currentSegment.to + '</a></li>');
			var item = $('#' + flight.id, $flightList);
			item.data('flight', flight);
			if (flight.timeToCheckIn) {

				item.addClass('checkIn');
				$('a', item).attr('href', '#checkIn');
			}
			else {
				item.addClass('tripDetail');
			}
		}
		$.mobile.changePage('#home', { transition: 'flip' });

	};
    
    return {
        run:run,
    };
}();

$(function () {
    $.mobile.defaultHomeScroll = 0;

    /* This is for portaria slide show BEGIN */
    /* http://www.w3schools.com/jquerymobile/jquerymobile_events_page.asp */
    /* SET PARAMETERS */
    var change_img_time     = 5000; 
    var transition_speed    = 100;

    var simple_slideshow    = $("#slideshow"),
        listItems           = simple_slideshow.children('li'),
        listLen             = listItems.length,
        i                   = 0,

        changeList = function () {

            listItems.eq(i).fadeOut(transition_speed, function () {
                i += 1;
                if (i === listLen) {
                    i = 0;
                }
                listItems.eq(i).fadeIn(transition_speed);
            });

        };

    listItems.not(':first').hide();
    setInterval(changeList, change_img_time);
    /*
        var refreshIntervalId = setInterval(fname, 10000);
        clearInterval(refreshIntervalId);
    */
    /* This is for portaria slide show END */
});
