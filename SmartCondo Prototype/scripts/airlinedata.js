var airlinesData = function(timeToLoad) {
	this.busyTime = timeToLoad || 1000;
};

airlinesData.prototype = function() {
	var ffInfo = {
		firstName: 'Eduardo', lastName: 'Daniels', ffNum: 'Bela Vista', status: 'Ativo', miles: '12B'
	},
    
	getDataforFF = function(id, callback) {
		fauxAjax(function () {
			callback(ffInfo);
		}, 'obtendo seus dados ...', this);
	},
    
	logOn = function (uid, pwd, callback) {
		fauxAjax(function () {
			callback('12345678', true);
		}, 'iniciando sessão ...', this);
	},
    
	fauxAjax = function fauxAjax(func, text, thisObj) {
		$.mobile.loading('show', { theme: 'a', textVisible: true, text:text });
		window.setTimeout(function () {
			$.mobile.loading('hide');
			func();
           
		}, thisObj.busyTime);
	};
    
	return{
		logOn:logOn,
		getDataforFF:getDataforFF
	}
}();