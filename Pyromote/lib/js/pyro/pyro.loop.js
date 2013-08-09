LOOP = false;

(function($){
	
	if(!$.Pyro) { $.Pyro = new Object(); }
	$.Pyro.Loop = new Object();
	$.Pyro.Loop.Methods = new Object();
	
	$.Pyro.Loop.Methods.init = function(options){
		
		var self = this;
		var loop = $.extend({}, { actions: { test : function(){ console.log('testies!');} } }, options);
		
		$.Pyro.Loop.Reset.apply(self, [loop]);
		
		console.log('Pyroloop init!');
		
		return this;
	}
	
	$.Pyro.Loop.Reset = function(loop){
		console.log('Pyroloop Reset!');
		var self = this;

		if(LOOP) window.clearInterval(LOOP);
		
		console.log(loop.actions);
		
		if(!loop.actions.length) return;
		LOOP = window.setInterval(function(  ){
			
			// console.log(loop.actions.length);
			
			// console.log('Intval!');
			
			if(!loop.actions.length) return;
			for (var handle in loop.actions) {
				var fn = loop.actions[key];
				if(typeof fn != 'function') continue;
				fn.apply(self, [loop]);
			}
			
		}, 100);
	}
	
	$.Pyro.Loop.Methods.blog = function(){
		console.log('Yes?');
	}
	
	$.Pyro.Loop.Methods.addAction = function(handle, fn) {
		
		console.log(handle);
		
		$scope = $(this);

		var loop = $scope.data('Pyro.Loop');
		
		loop.actions[handle] = fn;
		
		$.Pyro.Loop.Reset.apply( this, [ loop ]);

		$scope.data('Pyro.Loop', loop);
	}

	$.Pyro.Loop.Methods.removeAction = function(handle) {
		$scope = $(this);

		var loop = $scope.data('Pyro.Loop');
		unset(loop.actions[handle]);

		$scope.data('Pyro.Loop', loop);
	}
	
	$.extend({
	
		pyroloop : function( method ){
			
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
		
	});
	
})(jQuery);
