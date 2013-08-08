(function($){
	
    if(!$.Pyro){
        $.Pyro = new Object();
    };
    
    $.Pyro.TouchGrid = new Object(),
		$.Pyro.TouchGrid.Methods = new Object(); //UI.Methods placeholder
		$.Pyro.TouchGrid.Events = new Object(); //UI.Methods placeholder
 		$.Pyro.TouchGrid.Status = new Object(),
		$.Pyro.TouchGrid.Pointer = new Object(),
		$.Pyro.TouchGrid.Pointer.Methods = new Object();
		
		//Status
		$.Pyro.TouchGrid.Status.Default = {
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
				lastMove : -1
			},
			timestamp : {
				lastActivity : -1,
				lastMove : -1
			}
		}

		// Options
		$.Pyro.TouchGrid.defaultOptions = {
			
			hold : false,
			invertAxis : false,
			useX : true,
			useY : true,
			
			labelX : 'x',
			labelY : 'y',
			
			// Callbacks
			change : function( pos, event, scope ){  },
			//
			pressdown : function( pos, event, scope ) {  },
			pressup : function( pos, event, scope ) {  },
			pressmove : function( pos, event, scope ) {  },
			//
			firstActivity : function(){ },
			breakIdle : function(){ },
			//
		 	alterValue : function( pos, event, scope ){ return pos; },
			//
			pointer : function( $el ){  },
			
			//Return the scope with this, fragile callback. Be careful!
			setup : function(scope){ $(this).data('Pyro.TouchGrid', scope) }
			
		};	

    
		$.Pyro.TouchGrid.Methods.init = function( options ){
				
				var $grid = $(this);
				var scope = new Object();
						scope.id = Math.round(Math.random()*Math.random()/Math.random()*9999999);
						scope.options = $.extend({}, $.Pyro.TouchGrid.defaultOptions, options);
						scope.status = $.Pyro.TouchGrid.Status.Default;
						
						$grid.data('Pyro.TouchGrid', scope);
						
						$.Pyro.TouchGrid.HTML.apply( this );
						$.Pyro.TouchGrid.Bind.apply( this );
						$.Pyro.TouchGrid.Placement.apply( this );
						
						scope.options.setup.apply( this , [ scope ] );

		}
		
		$.Pyro.TouchGrid.BreakIdle = function( pos, event, scope ){
			
			var $grid = $(this);
			
			scope.status.idle = false;
			scope.options.breakIdle.apply( this, [pos, event, scope] );
			
			$grid.data( 'Pyro.TouchGrid', scope );
			
		}
		
		
		//
		//Status Manager
		
		$.Pyro.TouchGrid.Status.Update = function( pos, event, scope ){

			var scope = $(this).data('Pyro.TouchGrid');
			
			var now = new Date().getTime();
			
			scope.status.elapsed.lastActivity = now - scope.status.timestamp.lastActivity;
			scope.status.timestamp.lastActivity = now;
			scope.status.pos = pos;			
			
			// Be default it returns the X,Y positions to value.
			// value is used for display, less arbitrary
			scope.status.value = scope.options.alterValue.apply( this, [ pos, event, scope ] )
			
			// console.log(scope.status.value);
			// Note! Use this callback to normalize these numbers to something useful :
			
			//Save status.
			$(this).data('Pyro.TouchGrid', scope);
			
			$.Pyro.TouchGrid.Status.HTML.apply( scope );
			
			$.Pyro.TouchGrid.PointerUpdatePosition.apply( this, [pos, scope] );
				
		}
		
		$.Pyro.TouchGrid.Status.HTML = function(){ 
			//this == scope
			if(this.options.useX) this.$stats.find('.x .value').html( this.status.value.x );
			if(this.options.useY) this.$stats.find('.y .value').html( this.status.value.y );
		}
		
		$.Pyro.TouchGrid.Status.Get = function(){ 
			var $grid = $(this);
			var scope = $grid.data('Pyro.TouchGrid');
			return scope.status;
		}
	
	
		// DOM
		$.Pyro.TouchGrid.PointerUpdatePosition = function( pos , scope ){
			var $grid = $(this);
			scope.options.pointer.apply( this, [pos, scope] );			
			if(scope.options.useX) scope.$pointer.css( { left : pos.x - (scope.$pointer.width()/2) } );
			else 									 scope.$pointer.css( { left : ( $grid.width()/2 ) - ( scope.$pointer.width()/2 ) } );
			if(scope.options.useY) scope.$pointer.css( { top : pos.y - (scope.$pointer.height()/2) } );
			else 									 scope.$pointer.css( { top : ( $grid.height()/2 ) - ( scope.$pointer.height()/2 ) } );
		}
	
		$.Pyro.TouchGrid.outOfBounds = function(pos, scope){
			if(pos.x > scope.status.offset.right || pos.x < scope.status.offset.left && scope.options.useX) return;
			if(pos.y > scope.status.offset.bottom || pos.y < scope.status.offset.top && scope.options.useY) return;
		}
		
		//Trigger activity, initialize callbacks.
		$.Pyro.TouchGrid.Events.MouseDown = function( event ){
			
			var scope = $(this).data('Pyro.TouchGrid');			
			// console.log(scope);
			var pos = { x: event.pageX, y: event.pageY };
			
			scope.$pointer.show();
			
			scope.status.mousedown = true;
			
			if($.Pyro.TouchGrid.outOfBounds(pos, scope)) return;
			
			if(scope.status.idle) $.Pyro.TouchGrid.BreakIdle.apply( this, [pos, event, scope] );
		
			$.Pyro.TouchGrid.Status.Update.apply(this, [pos, event, scope]);
			
			scope.options.pressdown.apply( this , [pos, event , scope] );
			scope.options.change.apply( this , [pos, event , scope] );
			
			scope.status.idle = false;
		}
		
	
		$.Pyro.TouchGrid.Events.MouseUp = function( event ){
			var scope = $(this).data('Pyro.TouchGrid');
			
			if(!scope.options.pressup.apply( this , [ event, scope ] )) {
				if(!scope.options.hold) {
					scope.$pointer.hide(); //Hide by default.
				}
			}
			
			scope.status.mousedown = false;
			$(this).data('Pyro.TouchGrid', scope);
		}
		
		$.Pyro.TouchGrid.Events.MouseMove = function( event ){
			var scope = $(this).data('Pyro.TouchGrid');
			var pos = { x: event.pageX, y: event.pageY };
			
			if(scope.status.mousedown == false) return;
			
			if(pos.x > scope.status.offset.right || pos.x < scope.status.offset.left) return;
			if(pos.y > scope.status.offset.bottom || pos.y < scope.status.offset.top) return;
			
			$.Pyro.TouchGrid.Status.Update.apply(this, [pos, event, scope]);
			
			scope.options.pressmove.apply( this , [pos, event , scope] );
			scope.options.change.apply( this , [pos, event , scope] );
		}
		
		$.Pyro.TouchGrid.Events.TouchStart = function( event ){
			var $grid = $(this);
			var scope = $grid.data('Pyro.TouchGrid');
			var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
			var pos = { x: touch.pageX, y: touch.pageY };
			/*
			//Support for multiple grids, nix possible bugs before they happen, test bounds.
			*/
			//Exceeds Grid's Horizontal Bounds
			if(pos.x > scope.status.offset.right || pos.x < scope.status.offset.left) return; 
			//Exceeds Grid's Vertical Bounds
			if(pos.y > scope.status.offset.bottom || pos.y < scope.status.offset.top) return;
			//
			//Update the status object in the scope.
			$.Pyro.TouchGrid.Status.Update.apply(this, [pos, event, scope]);
			//
			if(scope.status.idle) $.Pyro.TouchGrid.BreakIdle.apply( this, [pos, event, scope] );
			//
			
			scope.options.pressdown.apply( this , [pos, event , scope] );
			scope.options.change.apply( this , [pos, event , scope] );
		}
		
		$.Pyro.TouchGrid.Events.TouchEnd = function( event ){
			
			var scope = $(this).data('Pyro.TouchGrid');
			scope.options.pressup.apply( this , [pos, event , scope] );
			
		}
		
		$.Pyro.TouchGrid.Events.TouchMove = function( event ){
			
			var scope = $(this).data('Pyro.TouchGrid');
			var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
			var pos = { x: touch.pageX, y: touch.pageY };
			
			if($.Pyro.TouchGrid.outOfBounds(pos, scope)) return;
			
			$.Pyro.TouchGrid.Status.Update.apply(this, [ pos, event, scope ]);
			scope.options.pressmove.apply( this , [pos, event, scope] );
			scope.options.change.apply( this , [pos, event, scope] );
			
		}
		
		// 
		// $.Pyro.TouchGrid.Interact = function(){
		// 	
		// }
		
		
		// examples: 	$grid.pyrogrid('get', 'option', 'hold');
		//						$grid.pyrogrid('get', 'scope');
		
		$.Pyro.TouchGrid.Methods.get = function(){
			
			var $grid = $(this);
			var scope = $grid.data('Pyro.TouchGrid');
			
			if(arguments[0] == 'scope') return scope;
			
			var result = scope;
			
			for(var a=0;a<arguments[length];a++) result = result[arguments[a]] || false;
			
			return result;
			
		}
		
		// examples: 	var gridstatus = $grid.pyrogrid('status');
		//						$grid.pyrogrid('get', 'scope');
				
		$.Pyro.TouchGrid.Methods.status = function(){
	
			return $.Pyro.TouchGrid.Status.Get.apply( this );

		}
		
		$.Pyro.TouchGrid.Methods.scope = function(){
			return $(this).data('Pyro.TouchGrid');
		}
		
		// examples: 	$grid.pyrogrid('updateOption', 'hold', true);
		$.Pyro.TouchGrid.Methods.updateOption = function( key, newvalue ){
			
			var scope = $(this).data('Pyro.TouchGrid');
			if( !scope.options[key] ) return;
			if( typeof scope.options[key] == 'object' && typeof newvalue != 'object' ) return; //JIC
			return scope.options[key] = newvalue;
			
		}
		
		
		$.Pyro.TouchGrid.Bind = function(){
			
			var $grid = $(this);
			var scope = $grid.data('Pyro.TouchGrid');
			
			$grid.bind('mousedown', $.Pyro.TouchGrid.Events.MouseDown);
			$grid.bind('mouseup', $.Pyro.TouchGrid.Events.MouseUp);
			$grid.bind('mousemove', $.Pyro.TouchGrid.Events.MouseMove);
			$grid.bind('touchstart', $.Pyro.TouchGrid.Events.TouchStart);
			$grid.bind('touchend', $.Pyro.TouchGrid.Events.TouchEnd);
			$grid.bind('touchmove', $.Pyro.TouchGrid.Events.TouchMove);
			
		}
	
		
		$.Pyro.TouchGrid.HTML = function(){
			
			var $grid = $(this);
			var scope = $grid.data('Pyro.TouchGrid');
					
					$grid.attr('data-id', scope.id);
			
			var $pointer = $('<div>').appendTo($grid);
					$pointer.addClass('pointer');
					$pointer.html('<span class="gradient"></span><span class="zero"></span>')
			
			scope.$pointer = $pointer;
			scope.$stats = $('<div>');
			scope.$stats.addClass('grid-stats');					
			
			$grid.before(scope.$stats);

			if(scope.options.useX) var $x = $('<div>').appendTo(scope.$stats).addClass('x').html('<span class="key">'+scope.options.labelX+'</span><span class="value"></span>');
			if(scope.options.useY) var $y = $('<div>').appendTo(scope.$stats).addClass('y').html('<span class="key">'+scope.options.labelY+'</span><span class="value"></span>');
			
			$grid.data('Pyro.TouchGrid', scope);

		}
		
		$.Pyro.TouchGrid.Placement = function(){
			
			var $grid = $(this);
			var scope = $grid.data('Pyro.TouchGrid');			

					if(typeof scope.status == 'undefined') scope.status = new Object();
					scope.status.placement = new Object();
			
			var display = {
				width : $(document).width(),
				height : $(document).height()
			}
			
			var offset = {
				left : $grid.offset().left,
				top : $grid.offset().top
			}
			
			var grid = {
				width : $grid.outerWidth(),
				height : $grid.outerHeight()
			}
			
			offset.right = offset.left + grid.width;
			offset.bottom = offset.top + grid.height;
			
			scope.status.offset = offset;
			scope.status.dims = new Object();
			scope.status.dims.grid = grid;
			scope.status.dims.display = display;
			// scope.status.dims.pointer = display;
			
			//Holds some math to determine fractional ownership over screenspace.
			var pie = {
				half : { width : grid.width*0.51, height : grid.height*0.51 },
				third : { width : grid.width*0.34, height : grid.height*0.34 },
				fourth : { width : grid.width*0.26, height : grid.height*0.26 }
			}
			
			if(display.width == grid.width && display.height == grid.height) scope.status.placement.horizontal = 'whole';
			
			else if(offset.left == 0 && grid.width < pie.fourth.width ) scope.status.placement.horizontal = 'left-fourth';
			else if(offset.left == 0 && grid.width < pie.third.width ) scope.status.placement.horizontal = 'left-third';
			else if(offset.left == 0 && grid.width < pie.half.width )  scope.status.placement.horizontal = 'left-half';
			
			else if(offset.right == 0 && grid.width < pie.fourth.width ) scope.status.placement.horizontal = 'right-fourth';
			else if(offset.right == 0 && grid.width < pie.third.width ) scope.status.placement.horizontal = 'right-third';
			else if(offset.right == 0 && grid.width < pie.half.width )  scope.status.placement.horizontal = 'right-half';
			
			else if(offset.right != 0 && offset.left != 0 && grid.width < pie.fourth.width) scope.status.placement.horizontal = 'middle-fourth';
			else if(offset.right != 0 && offset.left != 0 && grid.width < pie.third.width) scope.status.placement.horizontal = 'middle-third';
			else if(offset.right != 0 && offset.left != 0 && grid.width < pie.half.width) scope.status.placement.horizontal = 'middle-half';
			
			if(display.height == grid.height && display.height == grid.height) scope.status.placement.vertical = 'whole';
			
			else if(offset.top == 0 && grid.height < pie.fourth.height ) scope.status.placement.vertical = 'top-fourth';
			else if(offset.top == 0 && grid.height < pie.third.height ) scope.status.placement.vertical = 'top-third';
			else if(offset.top == 0 && grid.height < pie.half.height )  scope.status.placement.vertical = 'top-half';
			
			else if(offset.bottom == 0 && grid.height < pie.fourth.height ) scope.status.placement.vertical = 'bottom-fourth';
			else if(offset.bottom == 0 && grid.height < pie.third.height ) scope.status.placement.vertical = 'bottom-third';
			else if(offset.bottom == 0 && grid.height < pie.half.height )  scope.status.placement.vertical = 'bottom-half';
			
			else if(offset.bottom != 0 && offset.top != 0 && grid.height < pie.fourth.height) scope.status.placement.vertical = 'middle-fourth';
			else if(offset.bottom != 0 && offset.top != 0 && grid.height < pie.third.height) scope.status.placement.vertical = 'middle-third';
			else if(offset.bottom != 0 && offset.top != 0 && grid.height < pie.half.height) scope.status.placement.vertical = 'middle-half';
			
			if( scope.status.placement.horizontal == 'whole' && scope.status.placement.vertical == 'whole' ) scope.status.placement.macro = 'whole';
			if( scope.status.placement.horizontal == 'left-half' && scope.status.placement.vertical == 'top-half' ) scope.status.placement.macro = 'left-top-quarter';
			if( scope.status.placement.horizontal == 'right-half' && scope.status.placement.vertical == 'top-half' ) scope.status.placement.macro = 'right-top-quarter';
			if( scope.status.placement.horizontal == 'right-half' && scope.status.placement.vertical == 'bottom-half' ) scope.status.placement.macro = 'right-bottom-quarter';
			if( scope.status.placement.horizontal == 'left-half' && scope.status.placement.vertical == 'bottom-half' ) scope.status.placement.macro = 'left-bottom-quarter';
			if( scope.status.placement.horizontal == 'whole' && scope.status.placement.vertical == 'top-half' ) scope.status.placement.macro = 'top-half';
			if( scope.status.placement.horizontal == 'whole' && scope.status.placement.vertical == 'bottom-half' ) scope.status.placement.macro = 'bottom-half';
			if( scope.status.placement.horizontal == 'left-half' && scope.status.placement.vertical == 'whole' ) scope.status.placement.macro = 'left-half';
			if( scope.status.placement.horizontal == 'right-half' && scope.status.placement.vertical == 'whole' ) scope.status.placement.macro = 'right-half';
			
			$(this).data('Pyro.TouchGrid', scope);
			
		}
		
		$.Pyro.TouchGrid.UI = new Object(); 				//UI placeholde

		// $.Pyro.TouchGrid.UI.Methods.updateStats = function( scope ){
					
		

		// }
		
		
		//Mouse
		
		
		// $.Pyro.TouchGrid.Status.Mouse = new Object();
    
		$.fn.pyrogrid = function( method ){

			var methods = $.Pyro.TouchGrid.Methods;

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