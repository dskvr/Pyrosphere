var collides = (function () {
	
    function getPositions( elem ) {

        var pos, width, height;
        pos = $( elem ).position();
        width = $( elem ).width();
        height = $( elem ).height();
        return [ [ pos.left, pos.left + width ], [ pos.top, pos.top + height ] ];

    }

    function comparePositions( p1, p2 ) {

        var r1, r2;
        r1 = p1[0] < p2[0] ? p1 : p2;
        r2 = p1[0] < p2[0] ? p2 : p1;
        return r1[1] > r2[0] || r1[0] === r2[0];

    }

    return function ( a, b ) {
	
        var pos1 = getPositions( a ),
            pos2 = getPositions( b );
        return comparePositions( pos1[0], pos2[0] ) && comparePositions( pos1[1], pos2[1] );

    };

})();

(function($){
	
    if(!$.Pyro){
        $.Pyro = new Object();
    };
    
    $.Pyro.Valve = new Object(),
		$.Pyro.Valve.Methods = new Object(); //UI.Methods placeholder
		$.Pyro.Valve.Events = new Object(); //UI.Methods placeholder
 		// $.Pyro.Valve.Status = new Object(),
		// $.Pyro.Valve.Pointer = new Object(),
		// $.Pyro.Valve.Pointer.Methods = new Object();
		// $.Pyro.Valve.Idle = new Object();
		
		// //Status
		// $.Pyro.Valve.Status.Default = {
		// }

		// Options
		$.Pyro.Valve.defaultOptions = {
			valveon : function(scope, event){},
			valveoff : function(scope, event){},
			valveclass : 'pyrovalves'
		};	

    
		$.Pyro.Valve.Methods.init = function( options, scope ){
			
			// this.each(function(){
				
					var $container = $( this );
					var scope = scope || new Object();
							scope.options = $.extend({}, $.Pyro.Valve.defaultOptions, options);

					$container.data('Pyro.Valves', scope);
					
					console.log($container.data('Pyro.Valves'));
				
					$container.addClass(scope.options.valveclass);

					$.Pyro.Valve.HTML.apply( this );
					$.Pyro.Valve.Bind.apply( this );
								
					// scope.options.setup.apply( this , [ scope ] );			
					
					console.log('Valves Setup.');
				
			// });
			
			return this;

		}
		
		//Trigger activity, initialize callbacks.
		$.Pyro.Valve.Events.MouseDown = function( event ){

			var scope = $(this).data('Pyro.Valves');	
					scope.pressing = true;		
		
			var pos = { x: event.pageX, y: event.pageY };		

			$(this).data('Pyro.Valves', scope);
			
			return true;
		}
		
	
		$.Pyro.Valve.Events.MouseUp = function( event ){
			var scope = $(this).data('Pyro.Valves');
					scope.pressing = false;
			
			$(this).data('Pyro.Valves', scope);
			
			// scope.options.pressup.apply( this , [pos, event , scope] );
			return true;
		}
		
		$.Pyro.Valve.Events.MouseMove = function( event ){
			
			var self = this;
			$container = $(this);

			event.preventDefault();
			var scope = $(this).data('Pyro.Valves');		

			if(scope.pressing != true) return;
	
			var pos = { left: event.pageX, top: event.pageY };
			// scope.multiTouch = touches.length>1 ? true : false;
			$('.pointer').css(pos);
			
			var $box = $('.pointer', $container);
			
			$container.find('.valve').each(function( valveindex ){
				
				if( collides( $box, this ) && scope.valves[valveindex] == 0 )
					{ scope.options.valveon.apply( self, [ valveindex, scope, event ]);  }
				else if(scope.valves[valveindex] == 1) 		
					{ scope.options.valveoff.apply( self, [ valveindex, scope, event ]); }
				
			});
			
			$container.data('Pyro.Valves', scope);

		}
		
		$.Pyro.Valve.Events.TouchStart = function( event ){
			
			event.preventDefault();
			
			var touches = event.originalEvent.touches;
			
			console.log('Touches: ' + touches.length);
			
					scope.multiTouch = touches.length>1 ? true : false;
		
			var scope = $(this).data('Pyro.Valves');			
					scope.pressing = true;
					
			var pos = { x: event.pageX, y: event.pageY };		
			
			
			$(this).data('Pyro.Valves', scope);
		
			return true;
			
		}
		
		$.Pyro.Valve.Events.TouchEnd = function( event ){
			
			event.preventDefault();
			
			var scope = $(this).data('Pyro.Valves');
			
					scope.pressing = false;
		
			$(this).data('Pyro.Valves', scope);
			
			$('body').css('background', '#000')
		
			// scope.options.pressup.apply( this , [pos, event , scope] );
		
		}
		
		$.Pyro.Valve.Events.TouchMove = function( event ){
			
			var now = new Date().getTime();
			
			var self = this;
			$container = $(self);

			event.preventDefault();
			
			var scope = $(this).data('Pyro.Valves');
					
			var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
			var pos = { left: touch.pageX, top: touch.pageY };
			
			// $('body').css('background', '#fff')
			
			if(!scope.last || now - scope.last > 50) {
				$('.pointer').css(pos);	
				scope.last = now;
			}
		
			var $box = $('.pointer', $container);
			
			scope.options.valveon.apply( self, [ 1, scope, event ]);
					
					$container.find('.valve').map(function( valveindex ){
						
						// if(scope.valves[valveindex] == 1) return;
						
						if( collides( $box, this ) && scope.valves[valveindex] == 0 )
							{ scope.options.valveon.apply( self, [ valveindex, scope, event ]);  }
						// else if(scope.valves[valveindex] == 1 ) 		
							// { scope.options.valveoff.apply( self, [ valveindex, scope, event ]); }
						
					});
			
			$container.data('Pyro.Valves', scope);
			
			return true;

		}
		
		$.Pyro.Valve.Events.TouchEnter = function( event ){
			$(this).css('background', 'red')
		}
		
			$.Pyro.Valve.Events.valveonMouse = function( event ){

				var $valve = $(this);
				var $container = $valve.parents('.pyrovalves');

				var scope = $container.data('Pyro.Valves');

				// console.log(scope);

				$(this).data('Pyro.Valves', scope);

				scope.options.valveon.apply( this , [scope, event] );

			}

			$.Pyro.Valve.Events.valveon = function( event ){

				var $valve = $(this);

				var scope = $valve.parents('.pyrovalves').data('Pyro.Valves');

				$(this).data('Pyro.Valves', scope);

				scope.options.valveon.apply( this , [scope, event] );

			}

			$.Pyro.Valve.Events.valveoffMouse = function( event ){

				var $valve = $(this);

				var scope = $valve.parents('.pyrovalves').data('Pyro.Valves');

						scope.options.valveoff.apply( this , [scope, event] );

				$(this).data('Pyro.Valves', scope);

			}

			$.Pyro.Valve.Events.valveoff = function( event ){

				var $valve = $(this);

				var scope = $valve.parents('.pyrovalves').data('Pyro.Valves');

						scope.options.valveoff.apply( this , [scope, event] );

				$(this).data('Pyro.Valves', scope);

			}
		
		// 
		// $.Pyro.Valve.Interact = function(){
		// 	
		// }
		
		
		// examples: 	$container.pyrogrid('get', 'option', 'hold');
		//						$container.pyrogrid('get', 'scope');
		
		$.Pyro.Valve.Methods.get = function(){
			
			var $container = $(this);
			var scope = $container.data('Pyro.Valves');
			
			if(arguments[0] == 'scope') return scope;
			
			var result = scope;
			
			for(var a=0;a<arguments[length];a++) result = result[arguments[a]] || false;
			
			return result;
			
		}
		
		// examples: 	var gridstatus = $container.pyrogrid('status');
		//						$container.pyrogrid('get', 'scope');
				
		$.Pyro.Valve.Methods.status = function(){
	
			// return $.Pyro.Valve.Status.Get.apply( this );

		}
		
		$.Pyro.Valve.Methods.scope = function(){
			return $(this).data('Pyro.Valves');
		}
		
		// examples: 	$container.pyrogrid('updateOption', 'hold', true);
		$.Pyro.Valve.Methods.updateOption = function( key, newvalue ){
			
			var scope = $(this).data('Pyro.Valves');
			if( !scope.options[key] ) return;
			if( typeof scope.options[key] == 'object' && typeof newvalue != 'object' ) return; //JIC

			scope.options[key] = newvalue;
			$(this).data('Pyro.Valves', scope);
		}
		
		$.Pyro.Valve.Bind = function(){
			
			var $container = $(this);
			var scope = $container.data('Pyro.Valves');
			
			$container.bind('mousedown', $.Pyro.Valve.Events.MouseDown);
			$container.bind('mouseup', $.Pyro.Valve.Events.MouseUp);
			$container.bind('mousemove', $.Pyro.Valve.Events.MouseMove);
			$container.bind('touchstart', $.Pyro.Valve.Events.TouchStart);
			$container.bind('touchend', $.Pyro.Valve.Events.TouchEnd);
			$container.bind('touchmove', $.Pyro.Valve.Events.TouchMove);

			
			var $thevalves = $container.find('> *');

			$thevalves.bind('touchenter', $.Pyro.Valve.Events.TouchEnter);
			
			// $thevalves.bind('touchenter', $.Pyro.Valve.Events.valveon);
			// $thevalves.bind('touchleave', $.Pyro.Valve.Events.valveoff);	
			// $thevalves.bind('mouseenter', $.Pyro.Valve.Events.valveonMouse);
			// $thevalves.bind('mouseleave', $.Pyro.Valve.Events.valveoffMouse);
						
		}
	
		
		$.Pyro.Valve.HTML = function(){
			
			var $container = $(this);
			
			var scope = $container.data('Pyro.Valves');
					scope.valves = new Array();
					
			$('<div class="pointer"></div>').appendTo($container);
			
			for(var v=0; v<91; v++) {
				var $div = $('<div>').appendTo($container).addClass('valve').attr('data-valve', v);
				scope.valves[v] = 0;
			}
 			
			$container.data('Pyro.Valves', scope);			
			
		}
		

		
	
		
		
		//Mouse
		
		
		// $.Pyro.Valve.Status.Mouse = new Object();
    
		$.fn.pyrovalve = function( method ){

			var methods = $.Pyro.Valve.Methods;

			if ( methods[method] ) {
		    return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	      return methods.init.apply( this, arguments );
	    } else {
	      $.error( 'Method ' +  method + ' does not exist on jQuery.gallery ');
	    }	
		
		}
   
	return $;
	
})(jQuery);

