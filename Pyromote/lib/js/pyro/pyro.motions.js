//values for selector
(function($){
	
	if(!$.Pyro) $.Pyro = new Object();
	
	$.Pyro.Queue = new Object();
	$.Pyro.Queue.Methods = new Object();
	
	$.Pyro.Queue.Extension = '.dat';
	
	$.Pyro.Queue.Defaults = {
		queueTimeout : 1000,
		queueShuffle : false,
		
		enableHotkeys : false,
		
		onready : function( scope ){ },
		onselect : function( scope, event ){  },
		onnext : function( scope, event ){  },
		onprev : function( scope, event ){  }
	}
	
	$.Pyro.Queue.Methods.init = function( options , data ){
		
		var $this = $(this);
		
		var scope = new Object();
		
				scope.$selector = $this;
				
				scope.options = $.extend({}, $.Pyro.Queue.Defaults, options );
				
				scope.options.queueTimeout = scope.options.queueTimeout < 500 ? 500 : scope.options.queueTimeout;
				
				scope.files = data.sort(function(a,b){return a-b});
				scope.total = scope.files.length;
				
				scope.current = new Object();
				scope.current.index = 0;
				scope.current.filename = scope.files[scope.current.index];
				
				scope.queue = new Object();
				scope.queue.status = false;
	
				scope.next = 1; 
				scope.prev = scope.total-1;
				
				scope.reset = function(){
					this.next = (typeof scope.files[this.current.index+1] != 'undefined') ? this.current.index+1 : 0; 
					this.prev = (typeof scope.files[this.current.index-1] != 'undefined') ? this.current.index-1 : this.total-1;
				}
				
				scope.$container = $this, scope.$ul = false, scope.$motions = false
			//
			
				scope.reset();
		
		$this.data('Pyro.Queue', scope); //Plural!	
		
		// $this.pyroqueue('changeTimeout', scope.options.queueTimeout); //make sure it's not too fast.
				
		$.Pyro.Queue.HTML.apply(this);
		$.Pyro.Queue.Bind.apply(this);
		
		scope.$ul.find('li').pyroqueue('select');
		
		scope.options.onready.apply(this, [scope]);
		
	}
	
	//Queue
	
	//Play Button, toggles on or off.
	
	$.Pyro.Queue.Methods.togglePlayQueue = function( scope ){
		
		if(scope.queue.status) 		scope.$container.pyroqueue('StopQueue');
 		else 											scope.$container.pyroqueue('PlayQueue');

	}
	
	
	$.Pyro.Queue.Methods.setRefresh = function(value) {
		
		if(typeof value != 'integer') return;
		var $container = $(this);
		var scope = $container.data('Pyro.Queue');
		
		scope.options.queueTimeout = value;
		
		$container.data('Pyro.Queue', scope);
		
	}
	
	
	
	//Play Queue
	
	//Changes pattern every X seconds.
	
	$.Pyro.Queue.Methods.playQueue = function( refresh, random ){
		var $trigger = $(this)
		var $container = $trigger.parents('.selector');
		var scope = $container.data('Pyro.Queue');
		
				var refresh = scope.options.queueTimeout;
		
				clearInterval(scope.queue.interval);
				scope.queue.interval = setInterval(function(){
					
					var scope = $container.data('Pyro.Queue');
					var random = scope.options.queueShuffle;
					
					if(random) scope.$container.find('li:random').click();
					else scope.toggles.$next.click();
					
				}, refresh)

				scope.queue.status = true;
				scope.toggles.$playqueue.addClass('active');
				
		$container.data('Pyro.Queue', scope);
	}
	
	$.Pyro.Queue.Methods.stopQueue = function(){
		
		var $trigger = $(this)
		var $container = $trigger.parents('.selector');
		var scope = $container.data('Pyro.Queue');
		
		clearInterval(scope.queue.interval)
		
		scope.queue.status = false;
		
		scope.toggles.$playqueue.removeClass('active');
		
		$container.data('Pyro.Queue', scope);
		
	}
	
	// CONTROLS
	
	//select a pattern.
	
	$.Pyro.Queue.Methods.select = function( event ){
		
		var $pattern = $(this);
		
		var motion = $pattern.data('Pyro.Motion') || {};
		
		var $container = $(this).parents('.selector');
		
		var scope = $container.data('Pyro.Queue');	
		
		if(scope.current.index == motion.id ) return false;

		scope.current.index = motion.id;
		scope.current.data = motion;
		scope.reset(); 
		
		console.log('pyroqueue: Select ');
		// console.log(scope);

		$container.data('Pyro.Queue', scope);
		
		scope.$ul.find('.selected').removeClass('selected');
		$pattern.addClass('selected');
		
		scope.$current.html(motion.file);
		
		scope.options.onselect.apply( this, [scope, event] );
	}
	
	$.Pyro.Queue.Methods.next = function( scope ){
			
		var $select = scope.$ul.find('li').eq(scope.next);
		
		$select.pyroqueue('select');
		
		scope.options.onnext.apply( this, [scope, event] );
		
	}
	
	$.Pyro.Queue.Methods.previous = function( scope ){
		
		var $select = scope.$ul.find('li').eq(scope.prev);
		
		$select.pyroqueue('select');
		
		scope.options.onprevious.apply( this, [scope, event] );
		
	}
	
	$.Pyro.Queue.Methods.changeTimeout = function( val ){
		var min = 1000;
		val = val < min ? min : val;
		var scope = $(this).data('Pyro.Queue');
		scope.options.queueTimeout = val;
		$(this).data('Pyro.Queue', scope);
	}
	
	$.Pyro.Queue.HTML = function( ){
		
		console.log('pyroqueue: HTML');
		
		var $container = $(this);
		var scope = $container.data('Pyro.Queue');
		
		$container.addClass('selector');
		
		scope.$pane = $('<div>').appendTo($container).addClass('pane');
		
		scope.$ul = $('<ul>').appendTo(scope.$pane);
		
		$.each(scope.files, function(key, value){
			
			$motion = $('<li>');
			$motion.appendTo(scope.$ul);
			$motion.html(value);
					
			var motion = {
						id : key,
						filename : value,
						file : value+$.Pyro.Queue.Extension,
						parent : '#'+$container.attr('id')
					}
					
			$motion
				.attr('data-id', motion.id)
				.attr('data-filename', motion.filename)
				.attr('data-file', motion.file)
				.data('Pyro.Motion', motion);
							
		});
		
		//Container for DOM toggles
		scope.toggles = new Object();
	
	
		scope.$nav = $('<div>').prependTo(scope.$pane).addClass('nav');
				
		var $previous = $('<a>');
				$previous.appendTo(scope.$nav);
				$previous.attr('id', 'previous').html('< Previous');
		scope.toggles.$previous = $previous;
		
		
		var $next = $('<a>');
				$next.appendTo(scope.$nav);
				$next.attr('id', 'next').html('Next >');		
		scope.toggles.$next = $next;
		
		
		scope.$toggles = $('<div>').prependTo(scope.$pane).addClass('toggles');
		
		// var $cue = $('<a>');
		// 			$cue.appendTo(scope.$toggles);
		// 			$cue.attr('id', 'cue-queue').html('Cue');
		//   scope.toggles.$cue = $cue;
		
		var $playqueue = $('<a>');
				$playqueue.appendTo(scope.$toggles);	
				$playqueue.attr('id', 'play-queue').html('Play');
		scope.toggles.$playqueue = $playqueue;
		
		var $stopqueue = $('<a>');
				$stopqueue.appendTo(scope.$toggles);	
				$stopqueue.attr('id', 'stop-queue').html('Stop');
		scope.toggles.$stopqueue = $stopqueue;
		
		var $shuffle = $('<a>');
				$shuffle.appendTo(scope.$toggles);	
				$shuffle.attr('id', 'shuffle').html('Shuffle');
		scope.toggles.$shuffle = $shuffle;
		
		
		//CURRENT
		var $current = $('<div>');
				$current.appendTo(scope.$pane);
				$current.attr('id', 'current');
		scope.$current = $current;
		
		
		
		$(this).data('Pyro.Queue', scope);
		
	}
	
	$.Pyro.Queue.Bind = function( ){
		
		var $this = $(this);
		var scope = $this.data('Pyro.Queue');
		
		// scope = $(this).data('Pyro.Queue');
		
		//Bind Direct Pattern selection
		scope.$container.find('li').each(function(){
			
			$pattern = $(this);
			$pattern.bind('click touchstart', $.Pyro.Queue.Methods.select);

		});
		
		//next & previous
		scope.toggles.$next.bind('click', function(){
			$.Pyro.Queue.Methods.next.apply(this, [scope])
		});
		scope.toggles.$next.bind('touchstart', function(){
			$.Pyro.Queue.Methods.next.apply(this, [scope]);
		});
		scope.toggles.$previous.bind('click', function(){
			$.Pyro.Queue.Methods.previous.apply(this, [scope])
		});
		scope.toggles.$previous.bind('touchstart', function(){
			$.Pyro.Queue.Methods.previous.apply(this, [scope])
		});
		
		// scope.toggles.$cue.bind('click', function(){
		// 	$.Pyro.Queue.Methods.togglePlayQueue.apply(this, [scope]);
		// });
		scope.toggles.$playqueue.bind('click', function(){
			$.Pyro.Queue.Methods.playQueue.apply(this, [scope]);
		});
		scope.toggles.$stopqueue.bind('click', function(){
			$.Pyro.Queue.Methods.stopQueue.apply(this, [scope]);
		});
		
		// scope.toggles.$queuespeed.bind('click', function(event){
			// scope.option.queueTimeout = scope.toggles.$queuespeed
		// });
		
		scope.toggles.$shuffle.bind('click', function(){
			$(this).toggleClass('active');
			
			if($(this).hasClass('active')) scope.options.queueShuffle = true;
			else 													 scope.options.queueShuffle = false;
			
			console.log(scope);
			
			$this.data('Pyro.Queue', scope);
		});
		
		// if(scope.options.enableHotkeys) {
			// Bind Keystrokes
		// $this.bind('keydown', 'down', function(e){ e.preventDefault(); scope.toggles.$next.click(); });
		// $this.bind('keydown', 'right', function(){ scope.toggles.$next.click(); });
		// $this.bind('keydown', 'up', function(e){ e.preventDefault(); scope.toggles.$previous.click(); });
		// $this.bind('keydown', 'left', function(){ scope.toggles.$previous.click(); });
		// }		
		
		// var $touchArea = $this,
		// 			    touchStarted = false, // detect if a touch event is sarted
		// 					swipe = false,
		// 			    currX = 0,
		// 			    currY = 0,
		// 			    cachedX = 0,
		// 			    cachedY = 0,
		// 					compareX = 0,
		// 					compareY = 0,	
		// 					distX = 0,
		// 					totalDistX = 0,
		// 					totalDistY = 0,
		// 					distY = 0,
		// 					swipestart = 0,
		// 					swiperegister = 0,
		// 					swipespeed = 0,
		// 					swipecruise = false;
		// 			
		// 			//setting the events listeners
		// 			$touchArea.bind('touchstart mousedown',function (e){
		// 			    e.preventDefault(); 
		// 			    // caching the current x
		// 			    cachedX = e.pageX;
		// 			    // caching the current y
		// 			    cachedY = e.pageY;
		// 			    // a touch event is detected      
		// 			    touchStarted = true;
		// 					console.log('Touch started.')
		// 				
		// 			    // detecting if after 200ms the finger is still in the same position
		// 			    setTimeout(function (){
		// 							
		// 			        currX = e.pageX;
		// 			        currY = e.pageY;
		// 			        if ((cachedX === currX) && !touchStarted && (cachedY === currY)) {
		// 			            // Here you get the Tap event
		// 			            console.log('Tap');
		// 			        }
		// 			    },200);
		// 			});
		// 			$touchArea.bind('touchend mouseup touchcancel mouseleave',function (e){
		// 			    e.preventDefault();
		// 			    // here we can consider finished the touch event
		// 			    touchStarted = false;
		// 			    console.log('Touchended');
		// 					distX = 0;
		// 					distY = 0;
		// 					
		// 					compareX = 0;
		// 					compareY = 0;
		// 					
		// 					if(swipe) {
		// 						
		// 						var top = $this.scrollTop();
		// 						var now = new Date().getTime();
		// 						
		// 						console.log(totalDistY);
		// 						
		// 						console.log('swipe '+(totalDistY*2 + top));
		// 						
		// 						if(now - swiperegister < 100) {
		// 						
		// 							var diff = now - swipestart;
		// 						
		// 							speed = totalDistY / diff;
		// 							if(speed < 0) speed = speed * -1;
		// 						
		// 							console.log(speed);
		// 						
		// 							$this.stop(true).animate({
		// 								scrollTop : (totalDistY*6.28 + top)+"px",
		// 								easing : 'easeOutExpo'
		// 							}, Math.round(628*speed) );
		// 						
		// 						}
		// 						
		// 						totalDistY = 0;
		// 						
		// 						swipe = false;
		// 						swipestart = false;
		// 					}
		// 					
		// 					
		// 			});
		// 			$touchArea.bind('touchmove mousemove',function (e){
		// 			    e.preventDefault();
		// 			    if(touchStarted) {
		// 				
		// 							if(!swipestart) swipestart = new Date().getTime();
		// 							
		// 							var now = new Date().getTime();
		// 							var top = $this.scrollTop();
		// 
		// 							$this.stop();
		// 							
		// 							 if(distY > 0)  { //down
		// 									swipecruise = e.pageX > cachedX ? true : false;
		// 								} else { //up
		// 									swipecruise = e.pageX < cachedX ? true : false;
		// 								}
		// 							
		// 							 swipe = true;
		// 							 
		// 			         // here you are swiping
		// 							 distX = e.pageX - cachedX,
		// 							 distY = e.pageY - cachedY;
		// 							
		// 							 totalDistX = currX - cachedX;
		// 							 totalDistY = currY - cachedY;
		// 							
		// 							 swiperegister = now;
		// 							
		// 			         console.log('Swiping, traveled '+distY+'px vertically, and '+distX+'px horizontally');
		// 			
		// 								cachedX = e.pageX;
		// 								cachedY = e.pageY;
		// 							
		// 							$this.scrollTop(top+distY*-2);
		// 			    }
		// 			
		// 			});
		// 		
		$this.data('Pyro.Queue', scope);
		
	}
	
	$.fn.pyroqueue = function( method ){
		
		var methods = $.Pyro.Queue.Methods;
		
			if ( methods[method] ) {
			  return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
			} else if ( typeof method === 'object' || ! method ) {
			  return methods.init.apply( this, arguments );
			} else {
			  $.error( 'Method ' +  method + ' does not exist on jQuery.gallery ');
			}	
	
	};
	
})(jQuery)

