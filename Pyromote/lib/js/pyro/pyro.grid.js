
(function($){
	
    if(!$.Pyro){
        $.Pyro = new Object();
    };
    
    $.Pyro.Grid = new Object(),
		$.Pyro.Grid.Methods = new Object(); //UI.Methods placeholder
		$.Pyro.Grid.Events = new Object(); //UI.Methods placeholder
 		$.Pyro.Grid.Status = new Object(),
		$.Pyro.Grid.Pointer = new Object(),
		$.Pyro.Grid.Pointer.Methods = new Object();
		$.Pyro.Grid.Idle = new Object();
		
		//Status
		$.Pyro.Grid.Status.Default = {
			idle : true,
			limits : {
				refreshStats : 10,
				refreshPointer : 0,
			},
			mousemove : false,
			mousedown : false,
			orientation : 'whole',
			pos : {
				x : 0,
				y : 0
			},
			elapsed : {
				lastActivity : -1,
				lastMove : 0
			},
			timestamp : {
				lastActivity : -1,
				lastMove : 0
			},
			// $loop : false
		}

		// Options
		$.Pyro.Grid.defaultOptions = {
			
			$loop : false,
			
			hold : false,
			invertAxis : false,
			useX : true,
			useY : true,
			
			labelX : 'x',
			labelY : 'y',
			
			minimal : false,
			
			// Callbacks
			change : function( pos, event, scope ){  },
			//
			pressdown : function( pos, event, scope ) {  },
			pressup : function( pos, event, scope ) {  },
			pressmove : function( pos, event, scope ) {  },
			//
			firstActivity : function( pos, event, scope){ },
			idleEnd : function(){ },
			idleBegin : function(){ },
			//
		 	alterValue : function( pos, event, scope ){ return pos; },
			//
			pointer : function( $el ){  },
			
			//Return the scope with this, fragile callback. Be careful!
			setup : function(scope){ $(this).data('Pyro.Grid', scope) }
			
		};	

    
		$.Pyro.Grid.Methods.init = function( options, scope ){
			
			this.each(function(){
					var $grid = $(this);
					var scope = scope || new Object();
							scope.id = Math.round(Math.random()*Math.random()/Math.random()*9999999);
							scope.options = $.extend({}, $.Pyro.Grid.defaultOptions, options);

							scope.status = scope.status || $.Pyro.Grid.Status.Default;

							$grid.data('Pyro.Grid', scope);

							$.Pyro.Grid.HTML.apply( this );
							$.Pyro.Grid.Bind.apply( this );
							$.Pyro.Grid.Placement.apply( this );
							$.Pyro.Grid.Idle.init.apply( this );						
							scope.options.setup.apply( this , [ scope ] );
			});
			
			return this;

		}
		
		$.Pyro.Grid.inBounds = function(pos, scope){
			
			var boundsX = pos.x < scope.status.offset.right && pos.x > scope.status.offset.left;
			var boundsY = pos.y < scope.status.offset.bottom && pos.y > scope.status.offset.top;
			
			// console.log(pos);
			// console.log(scope.status.offset);
			// console.log(scope.id + '  inBounds Horizontally: ' + boundsX + ' inBounds Vertically: ' + boundsY);
			// console.log( scope.id + (boundsX && boundsY ? 'In Bounds' : 'Out of Bounds') );
			
			return boundsX && boundsY;
			// console.log('Grid '+scope.id+' clicked, in bounds!');
		}
		
		//
		//Status Manager
		
		$.Pyro.Grid.Status.Update = function( pos, event, scope ){

			var scope = $(this).data('Pyro.Grid');	
			var now = new Date().getTime();
		
			
			if(scope.status.timestamp.lastActivity < 0) 	scope.options.firstActivity.apply( this, [ pos, event, scope ]);
			if(scope.status.idle) 												$.Pyro.Grid.Idle.end.apply( this, [pos, event, scope] );
			
			scope.status.timestamp.lastActivity = now;

			scope.status.pos = pos;			
			
			scope.status.value = scope.options.alterValue.apply( this, [ pos, event, scope ] )
			
			//Save status.
			$(this).data('Pyro.Grid', scope);
			
			$.Pyro.Grid.Status.updateLabels.apply( scope );
			$.Pyro.Grid.Pointer.Methods.updatePosition.apply( this, [pos, scope] );
				
		}
		
		$.Pyro.Grid.Status.updateLabels = function(){ 
			//this == scope
			if(this.options.useX) this.$stats.find('.x .value').html( this.status.value.x );
			if(this.options.useY) this.$stats.find('.y .value').html( this.status.value.y );
		}
		
		$.Pyro.Grid.Status.Get = function(){ 
			var $grid = $(this);
			var scope = $grid.data('Pyro.Grid');
			return scope.status;
		}
	
	
		// DOM
		$.Pyro.Grid.Pointer.Methods.updatePosition = function( pos , scope ){
			var $grid = $(this);
			// console.log(scope.id + ' pos: '+ pos);
			scope.options.pointer.apply( this, [pos, scope] );			
			if(scope.options.useX) scope.$pointer.css( { left : pos.x - (scope.$pointer.width()/2) } );
			else 									 scope.$pointer.css( { left : ( $grid.width()/2 ) - ( scope.$pointer.width()/2 ) } );
			if(scope.options.useY) scope.$pointer.css( { top : pos.y - (scope.$pointer.height()/2) } );
			else 									 scope.$pointer.css( { top : ( $grid.height()/2 ) - ( scope.$pointer.height()/2 ) } );
		}
		
		
		//Trigger activity, initialize callbacks.
		$.Pyro.Grid.Events.MouseDown = function( event ){

			var scope = $(this).data('Pyro.Grid');			
		
			var pos = { x: event.pageX, y: event.pageY };		
			
			scope.options.pressdown.apply( this , [pos, event , scope] );
	
			// if(!$.Pyro.Grid.inBounds.apply( this, [pos, scope] )) return;
			
			scope.$pointer.show();
			scope.status.mousedown = true;
		
			$.Pyro.Grid.Status.Update.apply(this, [pos, event, scope]);
			
			scope.options.change.apply( this , [pos, event , scope] );
			
			scope.status.idle = false;
			
			return true;
		}
		
	
		$.Pyro.Grid.Events.MouseUp = function( event ){
			var scope = $(this).data('Pyro.Grid');
			
			if(!scope.status.mousedown) return; //May not be active if mousedown occured on a different grid!
			
			if(!scope.options.pressup.apply( this , [ event, scope ] )) {
				if(!scope.options.hold) {
					scope.$pointer.hide(); //Hide by default.
				}
			}
		
			scope.status.mousedown = false;
			
			$(this).data('Pyro.Grid', scope);
			
				return true;
		}
		
		$.Pyro.Grid.Events.MouseMove = function( event ){
			
			event.preventDefault();
			
			var scope = $(this).data('Pyro.Grid');
			var pos = { x: event.pageX, y: event.pageY };
			// if(!$.Pyro.Grid.inBounds.apply( this, [pos, scope] )) return;
			
			$.Pyro.Grid.Status.Update.apply(this, [ pos, event, scope ]);
			scope.options.pressmove.apply( this , [pos, event, scope] );
			scope.options.change.apply( this , [pos, event, scope] );
			
			// return true;
		}
		
		$.Pyro.Grid.Events.TouchStart = function( event ){
			
			event.preventDefault();
			
			var $grid = $(this);
			var scope = $grid.data('Pyro.Grid');
			var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
			var pos = { x: touch.pageX, y: touch.pageY };
			
			// if(!$.Pyro.Grid.inBounds.apply( this, [pos, scope] )) return;
			
			$.Pyro.Grid.Status.Update.apply(this, [pos, event, scope]);
			
			scope.options.pressdown.apply( this , [pos, event , scope] );
			scope.options.change.apply( this , [pos, event , scope] );
		}
		
		$.Pyro.Grid.Events.TouchEnd = function( event ){
			
			event.preventDefault();
			
			var scope = $(this).data('Pyro.Grid');
			scope.options.pressup.apply( this , [pos, event , scope] );
			
		}
		
		$.Pyro.Grid.Events.TouchMove = function( event ){

			event.preventDefault();
			
			var scope = $(this).data('Pyro.Grid');
			var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
			var pos = { x: touch.pageX, y: touch.pageY };
			
			// if(!$.Pyro.Grid.inBounds.apply( this, [pos, scope] )) return;
			
			$.Pyro.Grid.Status.Update.apply(this, [ pos, event, scope ]);
			scope.options.pressmove.apply( this , [pos, event, scope] );
			scope.options.change.apply( this , [pos, event, scope] );
			
		}
		
		// 
		// $.Pyro.Grid.Interact = function(){
		// 	
		// }
		
		
		// examples: 	$grid.pyrogrid('get', 'option', 'hold');
		//						$grid.pyrogrid('get', 'scope');
		
		$.Pyro.Grid.Methods.get = function(){
			
			var $grid = $(this);
			var scope = $grid.data('Pyro.Grid');
			
			if(arguments[0] == 'scope') return scope;
			
			var result = scope;
			
			for(var a=0;a<arguments[length];a++) result = result[arguments[a]] || false;
			
			return result;
			
		}
		
		// examples: 	var gridstatus = $grid.pyrogrid('status');
		//						$grid.pyrogrid('get', 'scope');
				
		$.Pyro.Grid.Methods.status = function(){
	
			return $.Pyro.Grid.Status.Get.apply( this );

		}
		
		$.Pyro.Grid.Methods.scope = function(){
			return $(this).data('Pyro.Grid');
		}
		
		// examples: 	$grid.pyrogrid('updateOption', 'hold', true);
		$.Pyro.Grid.Methods.updateOption = function( key, newvalue ){
			
			var scope = $(this).data('Pyro.Grid');
			if( !scope.options[key] ) return;
			if( typeof scope.options[key] == 'object' && typeof newvalue != 'object' ) return; //JIC

			scope.options[key] = newvalue;
			$(this).data('Pyro.Grid', scope);
		}
		
		
		$.Pyro.Grid.Idle.init = function( scope ){

			
			var self = this;
			var $grid = $(this);
			var scope = $grid.data('Pyro.Grid');
			
			$grid.data('Pyro.Grid', scope);
			
			if(scope.options.$loop) {
				scope.options.$loop.pyroloop('addAction', 'checkIdle', function(){
					var scope = $grid.data('Pyro.Grid');
					if( !scope.status.idle && $.Pyro.Grid.Idle.check.apply(self, [ scope ]) ) $.Pyro.Grid.Idle.begin.apply( this, [ scope ]);
					console.log( 'Idle: '+scope.status.idle );
				}, 1000);
			}
			else {
				$.Pyro.Grid.Idle.activeInterval = setInterval(function(){
					var scope = $grid.data('Pyro.Grid');
					//If not already idle, and check idle returns true, begin idle.
					if( !scope.status.idle && $.Pyro.Grid.Idle.check.apply(self, [ scope ]) ) $.Pyro.Grid.Idle.begin.apply( this, [ scope ]);
					console.log( 'Idle: '+scope.status.idle );
				}, 5000);
			}
			
		}
		
		$.Pyro.Grid.Idle.end = function( pos, event, scope ){
			
			var $grid = $(this);
			
			// var last = scope.status.timestamp.idleSince || -1;
			
			var now = new Date().getTime();
			
			scope.status.timestamp.lastActivity = now;
			scope.status.idle = false;
			
			$grid.data( 'Pyro.Grid', scope );
			
			scope.options.idleEnd.apply( this, [pos, event, scope] );
		}
		
		$.Pyro.Grid.Idle.begin = function( scope ){
			
			var $grid = $(this);
			
			scope.status.idle = true;
			scope.status.timestamp.idleSince = new Date().getTime();
			
			$grid.data( 'Pyro.Grid', scope );
			
			scope.options.idleBegin.apply( this, [ scope ] );
			
		}
		
		$.Pyro.Grid.Idle.check = function( scope ){
			
			var since = new Date().getTime() - scope.status.timestamp.lastActivity;
			var idle = since >= $.Pyro.Config.Limits.IdleThreshold;
			// var idle = since >= 10000;
			scope.status.idle = idle;
			$(this).data('Pyro.Grid', scope);
			if(idle) return true;
			
		}
		
		
		$.Pyro.Grid.Bind = function(){
			
			var $grid = $(this);
			var scope = $grid.data('Pyro.Grid');
			
			$grid.bind('mousedown', $.Pyro.Grid.Events.MouseDown);
			$grid.bind('mouseup', $.Pyro.Grid.Events.MouseUp);
			$grid.bind('mousemove', $.Pyro.Grid.Events.MouseMove);
			$grid.bind('touchstart', $.Pyro.Grid.Events.TouchStart);
			$grid.bind('touchend', $.Pyro.Grid.Events.TouchEnd);
			$grid.bind('touchmove', $.Pyro.Grid.Events.TouchMove);
			
		}
	
		
		$.Pyro.Grid.HTML = function(){
			
			var $grid = $(this);
			var scope = $grid.data('Pyro.Grid');
					
					$grid
							.addClass('grid')
							.attr('data-id', scope.id)
							.prepend('&nbsp;');
			
			var $pointer = $('<div>').appendTo($grid);
					$pointer.addClass('pointer');
					if(scope.options.minimal){
						$pointer.html('<span class="zero"></span>')						
					} else {
						$pointer.html('<span class="gradient"></span><span class="zero"></span>')
					}

			
			scope.$pointer = $pointer;
			scope.$stats = $('<div>');
			scope.$stats.addClass('grid-stats');					
			
			$grid.prepend(scope.$stats);

			if(scope.options.useX) var $x = $('<div>').appendTo(scope.$stats).addClass('x').html('<span class="key">'+scope.options.labelX+'</span><span class="value"></span>');
			if(scope.options.useY) var $y = $('<div>').appendTo(scope.$stats).addClass('y').html('<span class="key">'+scope.options.labelY+'</span><span class="value"></span>');
			
			$grid.data('Pyro.Grid', scope);

		}
		
		
		
		$.Pyro.Grid.Placement = function(){
			
			var $grid = $(this);
			var scope = $grid.data('Pyro.Grid');			

			if(typeof scope.status == 'undefined') scope.status = new Object();
			scope.status.placement = new Object();
			scope.status.placement.vertical = new Object();
			scope.status.placement.horizontal = new Object();
			
			var display = {
				width : $(document).width(),
				height : $(document).height()
			}
			
			scope.status.offset = {
				left : Math.round($grid.offset().left),
				top : Math.round($grid.offset().top)
			}
			
			var grid = {
				width : $grid.outerWidth(),
				height : $grid.outerHeight()
			}
			
			scope.status.offset.right = Math.round(scope.status.offset.left + grid.width);
			scope.status.offset.bottom = Math.round(scope.status.offset.top + grid.height);
			
			// scope.status.offset = offset;
			scope.status.dims = new Object();
			scope.status.dims.grid = grid;
			scope.status.dims.display = display;
			
			$grid.data('Pyro.Grid', scope);
			
			console.log();
			// scope.status.dims.pointer = display;
			
			// //Holds some math to determine fractional ownership over screenspace.
			// 		var pie = {
			// 			half : { width : display.width*0.51, height : display.height*0.51 },
			// 			third : { width : display.width*0.34, height : display.height*0.34 },
			// 			fourth : { width : display.width*0.26, height : display.height*0.26 }
			// 		}
			// 		
			// 		if(offset.left == 0 && grid.width < pie.fourth.width ) scope.status.placement.horizontal = 'left-fourth';
			// 		else if(offset.left == 0 && grid.width < pie.third.width ) scope.status.placement.horizontal = 'left-third';
			// 		else if(offset.left == 0 && grid.width < pie.half.width )  scope.status.placement.horizontal = 'left-half';
			// 		
			// 		else if(offset.right == display.width && grid.width < pie.fourth.width ) scope.status.placement.horizontal = 'right-fourth';
			// 		else if(offset.right == display.width && grid.width < pie.third.width ) scope.status.placement.horizontal = 'right-third';
			// 		else if(offset.right == display.width && grid.width < pie.half.width )  scope.status.placement.horizontal = 'right-half';
			// 		
			// 		else if(offset.right != display.width && offset.left != 0 && grid.width < pie.fourth.width) scope.status.placement.horizontal = 'middle-fourth';
			// 		else if(offset.right != display.width && offset.left != 0 && grid.width < pie.third.width) scope.status.placement.horizontal = 'middle-third';
			// 		else if(offset.right != display.width && offset.left != 0 && grid.width < pie.half.width) scope.status.placement.horizontal = 'middle-half';
			// 		scope.status.placement.horizontal = 'whole';
			// 		
			// 		if(offset.top == 0 && grid.height < pie.fourth.height ) scope.status.placement.vertical = 'top-fourth';
			// 		
			// 		else if(offset.top == 0 && grid.height < pie.third.height ) scope.status.placement.vertical = 'top-third';
			// 		else if(offset.top == 0 && grid.height < pie.half.height )  scope.status.placement.vertical = 'top-half';
			// 		
			// 		else if(offset.bottom == display.height && display.height < pie.fourth.height ) scope.status.placement.vertical = 'bottom-fourth';
			// 		else if(offset.bottom == display.height && display.height < pie.third.height ) scope.status.placement.vertical = 'bottom-third';
			// 		else if(offset.bottom == display.height && display.height < pie.half.height )  scope.status.placement.vertical = 'bottom-half';
			// 		
			// 		else if(offset.bottom != display.height && offset.top != 0 && grid.height < pie.fourth.height) scope.status.placement.vertical = 'middle-fourth';
			// 		else if(offset.bottom != display.height && offset.top != 0 && grid.height < pie.third.height) scope.status.placement.vertical = 'middle-third';
			// 		else if(offset.bottom != display.height && offset.top != 0 && grid.height < pie.half.height) scope.status.placement.vertical = 'middle-half';
			// 		else scope.status.placement.vertical = 'whole';
			// 		
			// 		if( scope.status.placement.horizontal == 'whole' && scope.status.placement.vertical == 'whole' ) scope.status.placement.macro = 'whole';
			// 		if( scope.status.placement.horizontal == 'left-half' && scope.status.placement.vertical == 'top-half' ) scope.status.placement.macro = 'left-top-quarter';
			// 		if( scope.status.placement.horizontal == 'right-half' && scope.status.placement.vertical == 'top-half' ) scope.status.placement.macro = 'right-top-quarter';
			// 		if( scope.status.placement.horizontal == 'right-half' && scope.status.placement.vertical == 'bottom-half' ) scope.status.placement.macro = 'right-bottom-quarter';
			// 		if( scope.status.placement.horizontal == 'left-half' && scope.status.placement.vertical == 'bottom-half' ) scope.status.placement.macro = 'left-bottom-quarter';
			// 		if( scope.status.placement.horizontal == 'whole' && scope.status.placement.vertical == 'top-half' ) scope.status.placement.macro = 'top-half';
			// 		if( scope.status.placement.horizontal == 'whole' && scope.status.placement.vertical == 'bottom-half' ) scope.status.placement.macro = 'bottom-half';
			// 		if( scope.status.placement.horizontal == 'left-half' && scope.status.placement.vertical == 'whole' ) scope.status.placement.macro = 'left-half';
			// 		if( scope.status.placement.horizontal == 'right-half' && scope.status.placement.vertical == 'whole' ) scope.status.placement.macro = 'right-half';
			// 		
			// 		$(this).data('Pyro.Grid', scope);
			
		}
		
		$.Pyro.Grid.UI = new Object(); 				//UI placeholde

		// $.Pyro.Grid.UI.Methods.updateStats = function( scope ){
					
		

		// }
		
		
		//Mouse
		
		
		// $.Pyro.Grid.Status.Mouse = new Object();
    
		$.fn.pyrogrid = function( method ){

			var methods = $.Pyro.Grid.Methods;

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