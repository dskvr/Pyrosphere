(function($){
    if(!$.Pyro){
        $.Pyro = new Object();
    };

		$.Pyro.Sphere = function(sss){
			var sphere = this;			
		}
		
		$.Pyro.Sphere.init = function(){
			
		}

		$.Pyro.Sphere.Update = function(method, message){
				method = method ? 'sphere.'+method : 'sphere';
				//
        $.Pyro.socket.emit(method, message);
				//
    };

		$.Pyro.Sphere.Off = function(pyro, message){
				$.Pyro.socket.emit('sphere.active', 0);
    };

		$.Pyro.Sphere.On = function(el, message){
       $.Pyro.socket.emit('sphere.active', 1);
    };
    
    $.Pyro.Sphere.defaultOptions = {
	
    };
    
})(jQuery);