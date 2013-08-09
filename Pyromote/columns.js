
//This is where we do the configuration. 
//Below is an object, that I've mapped to 
//Various callbacks within the .pyrogrid() jquery plugin. 
//This enables us to configure the Grid as we please, while keeping
//our business logic separate. Fully configurable. 

$(function(){
	
	var $xygrid = $('#duration').pyrogrid( { useX : false, hold : true, change : function(pos, event, scope){ console.log('DO something with interval here.') } } );
	
	var $xygrid = $('#interval').pyrogrid( { useX : false, hold : true, change : function(pos, event, scope){ console.log('DO something with interval here.') } } );
	
	// console.log($grid);
	// console.log($patterns);
	// console.log($sphere);
});