LOOP = false;

(function($){
	
	if(!$.Pyro) { $.Pyro = new Object(); }
	$.Pyro.Loading = new Object();
	$.Pyro.Loading.Methods = new Object();
	
	$.Pyro.Loading.Methods.init = function(options){
		
		var self = this;
		var loop = $.extend({}, { actions: { test : function(){ console.log('testies!');} } }, options);
		
		$(self).data('Pyro.Loading', loop);
		
		$.Pyro.Loading.Reset.apply(self);
		
		return this;
		
	}
	
	
	$.fn.pyroloop = function( method ){
			
		// return this.each(function(){
			var methods = $.Pyro.Loading.Methods;

			if ( methods[method] ) {
		    return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	      return methods.init.apply( this, arguments );
	    } else {
	      $.error( 'Method ' +  method + ' does not exist on jQuery.gallery ');
	    }
		// });

	}
		
	
})(jQuery);
