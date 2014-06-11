// Wait for Apache Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {
    setTimeout(function() {
        navigator.splashscreen.hide();
    }, 10000);
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
	    	$.mobile.changePage("#logon", { transition: "flip" });
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
        $("#portariaNotify-btn").on("click", function () {
	    	$.mobile.changePage("#bagTrack", { transition: "flip" });
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
	    	$.mobile.changePage("#logon", { transition: "flip" });
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
		$('#numberOfFlights').text(data.flights.length);
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