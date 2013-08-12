// loop.intval = false;

(function($){
	
	if(!$.Pyro) { $.Pyro = new Object(); }
	$.Pyro.Loop = new Object();
	$.Pyro.Loop.Methods = new Object();
	
	$.Pyro.Loop.Methods.init = function(options){
		
		var self = this;
		var loop = $.extend({}, { actions: { test : function(){ console.log('testies!');} } }, options);
		// var loop = new Object()
				// loop.actions = new Object();
		
		console.log('Pyroloop init!');
		
		$(self).data('Pyro.Loop', loop);
		
		$.Pyro.Loop.Reset.apply(self);
		
		return this;
		
	}
	
	$.Pyro.Loop.Reset = function(){
		console.log('Pyroloop Reset!');
		var self = this;
		
		var loop = $(self).data('Pyro.Loop');

		if(loop.intval) clearInterval(loop.intval);
		
		loop.intval = setInterval(function(  ){
			var loop = $(self).data('Pyro.Loop');
			for (var handle in loop.actions) {
				// console.log(loop)
				// console.log('Checking... '+handle);
				if(loop.actions[handle] == null) continue;
				if(new Date().getTime() - loop.actions[handle].last > loop.actions[handle].refresh) {
					var fn = loop.actions[handle].fn;
					if(typeof fn != 'function') continue;
					fn.apply(self, [ loop, loop.actions[handle] ]);
					loop.actions[handle].last = new Date().getTime();
					$(self).data('Pyro.Loop', loop);
					// console.log('In loop for '+handle);
				}
			}
			
		}, 20);
	}
	
	$.Pyro.Loop.Methods.blog = function(){
		console.log('Yes?');
	}
	
	$.Pyro.Loop.Methods.addAction = function(handle, fn, refresh) {
		
		refresh = refresh || 20;
		console.log(handle);
		$scope = $(this);
		var loop = $scope.data('Pyro.Loop');
		var action = { handle : handle, fn : fn, refresh : refresh, last : new Date().getTime() };		
		loop.actions[handle] = action;
		$scope.data('Pyro.Loop', loop);
		
		$.Pyro.Loop.Reset.apply( this, [ loop ] );
		
		
	}

	$.Pyro.Loop.Methods.removeAction = function(handle) {
		$scope = $(this);

		var loop = $scope.data('Pyro.Loop');
		loop.actions[handle] = null;

		$scope.data('Pyro.Loop', loop);
	}
	
	$.Pyro.Loop.Methods.setRefresh = function(handle, refresh) {
		$scope = $(this);
		var loop = $scope.data('Pyro.Loop');
		var action = loop.actions[handle];
		if(!action) return;
		action.refresh = refresh;
		loop.actions[handle] = action;
		$scope.data('Pyro.Loop', loop);
	}
	
	$.fn.pyroloop = function( method ){
			
		// return this.each(function(){
			var methods = $.Pyro.Loop.Methods;

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
