$(function(){
	
	var $app = $('body');
	var $sphere = $app.pyrosphere();
	var $tap = $('#tap-it').pyrotap({
		
		setup : function( ){
			var scope = $(this).data('Pyro.Tap');
					scope.$thing = $('<div>').appendTo( $(this) ).attr('id', 'thing');
					scope.beats = 0;
		},
		beforetap : function( scope ){
			console.log('Tapped!');
			if(scope.count < 1) $('body').stop().css({ 'background-color' : '#000000' });
		},
		aftertap : function( scope , status ){
			console.log(scope);
		},
		onbeat : function(){
			console.log('beat');
			
			var scope = $(this).data('Pyro.Tap');
			$('body').css('background', '#222').stop().animate({ 'background-color' : '#000000' , easing : 'easeInExpo' });
			
		},
		onchange : function(){
			var self = this;
			var scope = $(self).data('Pyro.Tap');
			var duration = function(){
				// var self = this;
				// var $tap = $(self);
				return Math.round( scope.status.millis / 2 );
			}

			var interval = function(){
				// var self = this;
				// var $tap = $(self);
				return Math.round(scope.status.millis / 2);
			}
			
			$sphere.pyrosphere('send', '*2.');
			$sphere.pyrosphere('set', 'frameDuration', duration() );
			$sphere.pyrosphere('set', 'frameInterval', interval() );
			$sphere.pyrosphere('process');
			
		},
		onreset : function ( ) {
			var self = this;
			var scope = $(self).data('Pyro.Tap');
			
			var duration = function(){
				// var self = this;
				// var $tap = $(self);
				return Math.round( scope.status.millis / 2 );
			}

			var interval = function(){
				// var self = this;
				// var $tap = $(self);
				return Math.round(scope.status.millis / 2);
			}
			
			//
			$sphere.pyrosphere('send', '*2.');
			$sphere.pyrosphere('set', 'frameDuration', duration() );
			$sphere.pyrosphere('set', 'frameInterval', interval() );
			$sphere.pyrosphere('process');
			
		}
	});
	
})