//Original:  Derek Chilcote-Batto (dac-b@usa.net)
//Web Site:  http://www.mixed.net
//Rewritten by: Rich Reel all8.com
//Turned into a jQuery Plugin by Sean Mitchell @ basilcaprese.com

scope =false;

(function($){
	
	if(!$.Pyro) { $.Pyro = new Object(); }
	$.Pyro.Tap = new Object();
	$.Pyro.Tap.Methods = new Object();
	
	$.Pyro.Tap.DefaultOptions = {
		setup : function( scope ){ },
		beforetap : function( scope ){ },
		aftertap : function( scope ){ },
		onbeat : function(){},
		onreset : function(){},
		onchange : function(){}
	}
	
	$.Pyro.Tap.Methods.init = function(options){
		
		console.log('Pyro Tap!');
		
		var self = this;
		var scope =$.extend( {}, $.Pyro.Tap.DefaultOptions, options);
		
		scope.status = new Object();
		scope.status.multiplier = 1;
		
		scope.millisPrevious = new Date().getTime();
		scope.count = 0;
		
		$(self).data('Pyro.Tap', scope);
	
		$.Pyro.Tap.HTML.apply( this );
		$.Pyro.Tap.Bind.apply( this );
		
		scope.setup.apply( this , [ scope ] );	
		
		scope.timeout = false;
		// $.Pyro.Tap.Reset.apply(self);
		
		return this;
		
	}
	
	$.Pyro.Tap.Methods.convertToMillis = function( scope ){
		
		return (60 / scope.average * 1000);
		
	}
	
	$.Pyro.Tap.Methods.untap = function( scope ){
		
		scope.$tapper.removeClass('active');
		
	}
	
	$.Pyro.Tap.Methods.tap = function( scope ){
		
		var self = this;
		
		var $tap = $(self);
		
		scope.$tapper.addClass('active');
		
		scope.beforetap.apply( this , [ scope ]);	
		// scope.$wait.blur();
	  scope.timeSeconds = new Date;
	  scope.millis = scope.timeSeconds.getTime();
	
	  if ((scope.millis - scope.millisPrevious) > 3000) {
	    scope.count = 0;
	    }

	  if (scope.count == 0){
	    // scope.$average.attr('value', "First Beat");
	    // scope.$tap.attr('value', "First Beat")
	    scope.millisFirst = scope.millis;
	    scope.count = 1;
	   } else {
	    scope.average = 60000 * scope.count / (scope.millis - scope.millisFirst);
	    scope.$average.attr('value', Math.round(scope.average * 100) / 100 );
	    scope.$whole.attr('value', Math.round(scope.average) );
	    scope.count++;
	    scope.$tap.attr('value', scope.count);
			scope.$millis.attr('value', Math.round( $.Pyro.Tap.Methods.convertToMillis( scope ) ) );
	   }
	
		scope.status.average 	= scope.$average.attr('value'),
		scope.status.whole 		= scope.$whole.attr('value'),
		scope.status.taps 		= scope.$tap.attr('value'),
		scope.status.millis 	= scope.$millis.attr('value') * scope.status.multiplier,
		scope.status.timeout 	= scope.$wait.attr('value');

	  scope.millisPrevious = scope.millis;	
	
		$tap.data('Pyro.Tap', scope);
	
		if(scope.count >= 3 ) { scope.valid = true; }
		if(scope.valid) {
			clearTimeout(scope.timeout);
			scope.timeout = setTimeout(function(){
				var scope = $tap.data('Pyro.Tap');
				scope.onreset.apply( self );
				// alert(scope.status.millis)
				clearInterval(scope.interval);
				scope.interval = setInterval(function(){
					var scope = $tap.data('Pyro.Tap');
					scope.onbeat.apply(self);
					// console.log(scope.millis);
				}, scope.status.millis);
			}, scope.status.millis);
			scope.valid = false;
		}
	
		$tap.data('Pyro.Tap', scope);
		scope.aftertap.apply( this , [ scope , status ]);
	
	  return true;
	
	}
	
	$.Pyro.Tap.Bind = function( ){
		
		var self = this;
		var $tap = $(self);
		var scope =$tap.data('Pyro.Tap');
		
		scope.$tapper.bind('touchstart mousedown', function( event ){
			event.preventDefault();
			var $tap = $(self);
			var scope =$tap.data('Pyro.Tap');
					$.Pyro.Tap.Methods.tap.apply( self, [ scope ] );
		});
		
		scope.$tapper.bind('touchend mouseup', function( event ){
			event.preventDefault();
			var $tap = $(self);
			var scope =$tap.data('Pyro.Tap');
					$.Pyro.Tap.Methods.untap.apply( self, [ scope ] );
		});
		
		scope.$multiplier.on('change', function(){
			var $tap = $(self);
			var scope = $tap.data('Pyro.Tap');
			var $selected = $(this).find('option:selected');
					scope.status.multiplier = $selected.attr('value');
					scope.status.millis 	= scope.$millis.attr('value') * scope.status.multiplier,
					
			$tap.data('Pyro.Tap', scope);	
			scope.onchange.apply( self );
		});
		
		scope.status.multiplier = scope.$multiplier.find('option:selected').attr('value');
		
		$tap.data('Pyro.Tap', scope);
		
	}
	
	$.Pyro.Tap.HTML = function( ){
		var self = this;
		var $container = $(self);
		
		var scope =$container.data('Pyro.Tap');
		
		console.log(scope);
				
				scope.$whole = $('<input>').appendTo($container)
				scope.$whole.attr('id', 'scope-whole');
				//
				scope.$average = $('<input>').appendTo($container)
				scope.$average.attr('id', 'scope-average');
				//
				scope.$tapper = $('<div>').appendTo($container)
				scope.$tapper.attr('id', 'scope-tapper');
				//
				scope.$tap =  $('<input>').appendTo($container)
				scope.$tap.attr('id', 'scope-tap');
				//
				scope.$wait = $('<input>').appendTo($container);
				scope.$wait.attr('id', 'scope-wait');
				scope.$wait.attr('value', 2);
				//
				scope.$multiplier = $('<select>').appendTo($container);
				scope.$multiplier
					 	.attr('id', 'scope-millis')                                                    
					  .append( $('<option value="1" selected="selected">Whole</option>') )                                 
					  .append( $('<option value="0.5">Half</option>') )  
						.append( $('<option value="'+1/3+'.5">Third</option>') )                                
					  .append( $('<option value="0.25">Quarter</option>') )                        
					  .append( $('<option value="'+1/8+'">Eighth</option>') );             
				//
				scope.$millis = $('<input>').appendTo($container);
				scope.$millis.attr('id', 'scope-millis');
				//
				scope.$stepper = $('<div></div>').appendTo($container);
				scope.$stepper.attr('id', 'scope-millis');
				//
				scope.$represent = $('<div>').appendTo($container)
				scope.$represent.attr('id', 'scope-millis');
				
		$container.data('Pyro.Tap', scope);
	
	}
	
	
	$.fn.pyrotap = function( method ){
			
		// return this.each(function(){
			var methods = $.Pyro.Tap.Methods;

			if ( methods[method] ) {
		    return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	      return methods.init.apply( this, arguments );
	    } else {
	      $.error( 'Method ' +  method + ' does not exist on jQuery.gallery ');
	    }
		// });

	}

		return $;
	
})(jQuery);

