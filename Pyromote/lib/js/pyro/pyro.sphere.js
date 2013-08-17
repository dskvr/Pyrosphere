(function($){
	
    if(!$.Pyro){
        $.Pyro = new Object();
    };

		$.Pyro.Sphere = new Object();
		
		$.Pyro.Sphere.defaultOptions = { 
			refreshRate : 20,
			frameInterval : 400,
			frameDuration : 400,
			valve : -1,
			pattern : '00',
			active : 0,
			//
			$grid : false, 
			$loop : false
		};
		
		$.Pyro.Sphere.Methods = new Object();
		
		$.Pyro.Sphere.Pointer = new Object();
		
		$.Pyro.Sphere.Methods.init = function( options ) {
			
			var scope = {};
			
			scope.options = $.extend({}, $.Pyro.Sphere.defaultOptions, options);
				
			scope.request = '';
			
			scope.status =  {
				lastRequest : -1,
				totalRequests : 0,
			};

			// $('script[name=socket]').attr('src', $.Pyro.Config.URI.Socket+'/socket.io/socket.io.js');			
			scope.socket = io.connect($.Pyro.Config.URI.Socket);			


			// if(!scope.options.$grid) return;
			
			$(this).data('Pyro.Sphere', scope);
			
			return this;
			
		}
		
		
		//
		$.Pyro.Sphere.Methods.set = function( key, value ){
			var scope = $(this).data('Pyro.Sphere');
			scope.options[key] = value;
			$(this).data('Pyro.Sphere', scope);
			$.Pyro.Sphere.Buffer.apply( this, [ key, value ]);
			return true;
		}
		
		$.Pyro.Sphere.Methods.get = function( key ){
			var scope = $(this).data('Pyro.Sphere');
			return scope.options[key];
		}
		
		//
		$.Pyro.Sphere.Methods.process = function( forceSend ){
			
			var now = new Date().getTime();
			var scope = $(this).data('Pyro.Sphere');
			
			scope.status.totalRequests++;
			
			if(now - scope.status.lastRequest < scope.options.refreshRate && !forceSend) return; //Useful for mouseup.
			
			
			scope.status.lastRequest = now;
			
						console.log(scope.request);
			
			scope.socket.emit('pyro.pipe', scope.request);
			
			scope.request = "";
			$(this).data('Pyro.Sphere', scope);
			
		}
		
		//Adds to buffer.
		$.Pyro.Sphere.Buffer = function( key, value ){
			var scope = $(this).data('Pyro.Sphere');
			
			// if(!value.length || typeof value == 'undefined' || typeof key == 'undefined') return;
			// base.$el.data("Pyro.Master");
			var prefix = '';
			
			//What to do with them.
			if(key == 'active') 				prefix += '*';
			if(key == 'pattern') 				prefix += '!';
			if(key == 'frameDuration') 	prefix += '@';
			if(key == 'frameInterval') 	prefix += '#';
			if(key == 'valveOn') 				prefix += '+';
			if(key == 'valveOff') 			prefix += '-';
			
			// scope.checkActivity();
			
			scope.request += prefix+(value)+'.';
			
			$(this).data('Pyro.Sphere', scope);
			
		}
		
		$.Pyro.Sphere.checkActivity = function(){
			 //Tell teh pyrosphere to start opening valves.
			var scope = $(this).data('Pyro.Sphere');
			
			if(scope.options.active == false) {
				scope.request += '*1.';
				scope.options.active = true;
			}
			
			scope.data('Pyro.Sphere', scope);	
		}
		
		$.Pyro.Sphere.getStatus = function(){;
			var scope = $(this).data('Pyro.Sphere');
			return scope.status;
		}
		//
		
		$.Pyro.Sphere.Methods.send = function( request ) {
			var scope = $(this).data('Pyro.Sphere');
			//Make sure this is properly formatted!
			scope.socket.emit('pyro.pipe', request);
			// scope.socket.emit('pyro.pipe', request);
		}
		
		//Helpers
		$.Pyro.Sphere.updateInterval = function(interval){
			var scope = $(this).data('Pyro.Sphere');
			if(typeof interval != 'integer') return;
			// scope.socket.emit('pipe', '#'+interval+'.');
		}
		
		$.Pyro.Sphere.updateDuration = function(duration){
			var scope = $(this).data('Pyro.Sphere');
			if(typeof interval != 'integer') return;
			// scope.socket.emit('pipe', '@'+duration+'.');
		}
		
		$.Pyro.Sphere.updatePattern = function(pattern){
			var scope = $(this).data('Pyro.Sphere');
			if(typeof interval != 'integer') return;
			// scope.socket.emit('pipe', '!'+pattern+'.');
		}
		
		// Generic Send, formatted string.

		// $.Pyro.Sphere.update = function(method, message){
		// 			
		// 				method = method ? 'sphere.'+method : 'sphere';
		// 				//
		//         scope.socket.emit(method, message);
		// 				//
		//     };

		$.Pyro.Sphere.off = function(pyro, message){
				var scope = $(this).data('Pyro.Sphere');
				// scope.socket.emit('sphere.active', 0);
    };

		$.Pyro.Sphere.on = function(el, message){
			var scope = $(this).data('Pyro.Sphere');
       // scope.socket.emit('sphere.active', 1);
    };
		$.fn.pyrosphere = function( method ){
				var methods = $.Pyro.Sphere.Methods;

				if ( methods[method] ) {
			    return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		    } else if ( typeof method === 'object' || ! method ) {
		      return methods.init.apply( this, arguments );
		    } else {
		      $.error( 'Method ' +  method + ' does not exist on jQuery.pyrosphere ');
		    }
			
		}
			
})(jQuery);