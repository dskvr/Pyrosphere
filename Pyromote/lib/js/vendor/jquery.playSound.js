/**
 * @author Alexander Manzyuk <admsev@gmail.com>
 * Copyright (c) 2012 Alexander Manzyuk - released under MIT License
 * https://github.com/admsev/jquery-play-sound
 * Usage: $.playSound('http://example.org/sound.mp3');
**/

(function($){

  $.extend({
	
    playSound: function( ){
			
			length = arguments[1] || 2000;
			var id = 'sound-' + Math.round(Math.random()*Math.random()/Math.random()*100000);
			console.log(id + '    ' + length);
			setTimeout(function(){
				$('#'+id).empty().remove();
			},length);
      return $("<embed src='"+arguments[0]+"' hidden='true' autostart='true' id="+id+" loop='false' class='playSound'>").appendTo('body');

    }

  });

})(jQuery);
