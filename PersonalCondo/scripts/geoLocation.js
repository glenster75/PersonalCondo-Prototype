function geolocationApp() {}

geolocationApp.prototype = {
	_watchID:null,
    
	run:function() {
		var that = this;
        setTimeout(function () {
    		$("#watchButton").on("click", function() {
    			that._handleWatch.apply(that, arguments);
    		});
    		$("#refreshButton").on("click", function() {
    			that._handleRefresh.apply(that, arguments);
    		});
        }, 3000);
	},
    
	_handleRefresh:function() {
        var options = {
            	enableHighAccuracy: true
            },
            that = this;
        
        that._setResults("Waiting for geolocation information...");
        
		navigator.geolocation.getCurrentPosition(function() {
			that._onSuccess.apply(that, arguments);
		}, function() {
			that._onError.apply(that, arguments);
		}, options);
	},
    
	_handleWatch:function() {
		var that = this,
		// If watch is running, clear it now. Otherwise, start it.
		button = $("#watchButton");
                     
		if (that._watchID != null) {
			that._setResults();
			navigator.geolocation.clearWatch(that._watchID);
			that._watchID = null;
            if (button.innerHTML) {
            	button.innerHTML = "Start Geolocation Watch";
            } else {
            	button[0].innerHTML = "Start Geolocation Watch";
            }
		}
		else {
			that._setResults("Waiting for geolocation information...");
			// Update the watch every second.
			var options = {
				frequency: 1000,
				enableHighAccuracy: true
			};
			that._watchID = navigator.geolocation.watchPosition(function() {
				that._onSuccess.apply(that, arguments);
			}, function() {
				that._onError.apply(that, arguments);
			}, options);
			if (button.innerHTML) {
	            button.innerHTML = "Clear Geolocation Watch";
            } else {
	            button[0].innerHTML = "Clear Geolocation Watch";
            }
		}
	},
    
	_onSuccess:function(position) {
		// Successfully retrieved the geolocation information. Display it all.
        
		this._setResults('Latitude: ' + position.coords.latitude + '<br />' +
						 'Longitude: ' + position.coords.longitude + '<br />' +
						 'Altitude: ' + position.coords.altitude + '<br />' +
						 'Accuracy: ' + position.coords.accuracy + '<br />' +
						 'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '<br />' +
						 'Heading: ' + position.coords.heading + '<br />' +
						 'Speed: ' + position.coords.speed + '<br />' +
						 'Timestamp: ' + new Date(position.timestamp).toLocaleTimeString().split(" ")[0] + '<br />');
	},
    
	_onError:function(error) {
		this._setResults('code: ' + error.code + '<br/>' +
						 'message: ' + error.message + '<br/>');
	},
    
	_setResults:function(value) {
		var results = $("#results");
        if (!value) {
			if (results.innerHTML) {
	            results.innerHTML = "";
            } else {
	            results[0].innerHTML = "";
            }
		}
		else {
			if (results.innerHTML) {
	            results.innerHTML = value;
            } else {
	            results[0].innerHTML = value;
            }
		}
	},
}
