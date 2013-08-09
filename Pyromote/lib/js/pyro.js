Pyro = new Object();

Pyro.Core = new Object();
Pyro.Core.Init = function(){

}

//
// Singleton
//
Pyro.User = new Object();
Pyro.User.Init = function(){
	var user = this;
	
			user.id = Math.round( ( Math.random()*( new Date().getTime() ) / ( Math.random()*Math.Random() ) );
	
	Pyro.Status.Register('User', { 
		online : true,
		active : false
		timeOnline : false,
	});
	
}
Pyro.User.Update = function(){
	
}

Pyro.Status = new Object();
Pyro.Status.Data = new Object();

Pyro.Status.Register = function( namespace , object ){
	object = (typeof object == 'object') ? object : new Object();
	if(typeof Pyro.Status.Data[namespace] == 'function') return; //reserved
	Pyro.Status.Data[namespace] = object;
}

Pyro.Status.Update = function( namespace, key, value ){
	if(!Pyro.Status.Data[namespace] || !Pyro.Status.Data[namespace][key]) return;
	Pyro.Status.Data[namespace][key] = value;
}

Pyro.Status.Get = function( namespace, key ){
	if(!Pyro.Status.Data[namespace] || !Pyro.Status.Data[namespace][key]) return;
	return Pyro.Status.Data[namespace][key];
}


//Namespace
Pyro.Grid = new Object();

//************************************
/**   Init
			options (object)
				@databind
//************************************/
Pyro.Grid.Init = function(options){
	
	var $grid = $(this);

	var base = $.data($grid, 'Pyro.Grid');	

	if(!base.length) {
		$.extend(true, options, Pyro.Grid.defaultOptions, options);
		base.options = options;
		base.preferences = new Object();
		base.since = new Object();
		base.axis = new Object();
	} else {
		$.extend(true, options, base.options, options);
	}

	$.data($grid, 'Pyro.Grid', base);
}

//************************************
/**   Method: Invert Axis
			Description: Inverts associated axis data.
			options (object)
				--
//************************************/

Pyro.Grid.Methods.InvertAxis = function(){
	
}

//************************************
/**   Method: Mouse/Touch XY data.
			Description: Inverts associated axis data.
			options (object)
				--
//************************************/
Pyro.Grid.Methods.Update = function( xy ){ 
	var $grid = $(this);
	var state = $grid.data('Pyro.Grid');
}

Pyro.Grid.Methods.UpdateValues = function( valuesArray ){
	var $grid = $(this);
	var state = $grid.data('Pyro.Grid');
}


Pyro.Grid.Events.MouseDown = function( event ){
	
}

Pyro.Grid.Events.MouseUp = function( event ){
	
}

Pyro.Grid.Events.MouseMove = function( event ){
	
}

Pyro.Grid.defaultOptions = {
	axis : {
		x : {
			namespace : 'Pyro.'
		}
	}
	
	//Actions
	onActive : function( event ){ console.log( event ) },
	onMove : function( data ){  }
	
	afterUpdate : function( event ){  }
	//Filters
	beforeUpdate : function( data ){ return data; } 
	
}

(function($){
	
	var methods = Pyro.Grid;
	
	$.fn.xyGrid = function( method ){
		return this.each(function(){
			if ( methods[method] ) {
		    return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	      return methods.init.apply( this, arguments );
	    } else {
	      $.error( 'Method ' +  method + ' does not exist on jQuery.toolbar ');
	    }
		});
	};
	
})( jQuery );

//Namespace
Pyro.UI = new Object();
//
Pyro.UI.Register = function(){}




//Toolbar
Pyro.UI.Toolbar = new Object();
//
Pyro.UI.Toolbar.init = function(){ };
Pyro.UI.Toolbar.show = function(){ };
Pyro.UI.Toolbar.hide = function(){ };
Pyro.UI.Toolbar.toggle = function(){ };

Pyro.UI.Toolbar.defaultOptions = {

}

(function($){
	
	var methods = Pyro.UI.Toolbar;
	
	$.fn.toolbar = function( method ){
		if ( methods[method] ) {
	      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	      return methods.init.apply( this, arguments );
	    } else {
	      $.error( 'Method ' +  method + ' does not exist on jQuery.toolbar ');
	    }
	};
	
})( jQuery );


////


Pyro.Sphere = new Object();
Pyro.Sphere.init = function(){

	Pyro.Status.Register('Sphere', {
		status : 0
	})
	
}
Pyro.Sphere.FrameDuration = function(){}
Pyro.Sphere.FrameInterval = function(){}
Pyro.Sphere.Patterns = function(){}

Pyro.UI.Sphere.defaultOptions = {}

Pyro.Socket = socket ? socket : null;

// @author: Sean Mitchell