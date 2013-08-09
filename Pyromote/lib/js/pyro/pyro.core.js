(function($){
	$.Pyro = new Object();
	
	$.Pyro.Sphere, $.Pyro.UI = {};
	
	$.Pyro.UI.Master, $.Pyro.UI.Grid, $.Pyro.UI.Valves
	
	$.Pyro.watcher = null; //Placeholder for interval.
	
	$.Pyro.session = function(){}
	
	//Socket. (emit,send,recieve)
	if(socket) $.Pyro.Socket = socket;
	
	//Namespace helpers
	$.Pyro.requestReset = function(){
		base.request = "";
		$.Pyro.debug();
	}
	
	$.Pyro.debug = function(){
		console.log('RRRRRequest: '+$.Pyro.request);
	}
	
});