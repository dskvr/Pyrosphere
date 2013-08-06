// Placeholder
(function($){
	$.Pyro.UI = new Object();
	
	$.Pyro.UI.mouse = {
		mrefreshinterval : 500, // update display every 500ms
		lastmousex : -1, 
		lastmousey : -1,
		lastmousetime : null,
		mousetravel : 0
	}

	$.Pyro.UI.pointer = function(){}
	
	$.Pyro.UI.mouse.track = function(e) {
	     var mousex = e.pageX;
	     var mousey = e.pageY;
	     if ($.Pyro.UI.mouse.lastmousex > -1)
	         $.Pyro.UI.mouse.mousetravel += Math.max( Math.abs(mousex-$.Pyro.UI.mouse.lastmousex), Math.abs(mousey-$.Pyro.UI.mouse.lastmousey) );
	     $.Pyro.UI.mouse.lastmousex = mousex;
	     $.Pyro.UI.mouse.lastmousey = mousey;
  }
	
	$.Pyro.UI.init = function(){
		var base = this;
				base.$el = $('#pyromote');
				
				base.$el.data('Pyro.UI');
				
				base.$elements = new Array();
		
				base.$grid = base.$el.find('#grid');
		
				base.current = new Object();
				base.current.mouse = new Object();
				
				base.preferences = {
					
				}
				
				base.$el.data('$.Pyro');
		
				base.options.callbacks = new Object();
				base.options.callbacks.load = new Array();
				base.options.callbacks.watch = new Array();
				base.options.callbacks.switchView = new Array();
				base.options.callbacks.changeParameter = new Array();
				base.options.callbacks.registerElement = new Array();
				
				base.$el.data('$.Pyro');
				
		//Defaults Actions
		$.Pyro.UI.addAction('load', function(){
			base = this; //that's all we need.
		});

		$.Pyro.UI.doAction('updateOption', [
			base.$grid,
			$(this).
			
			// grid
			// stat
			// 
		]);
		
	}
	
	$.Pyro.UI.doAction(actionKey, actionParams) {
		if(!base.options.callbacks.length) return;
		var callbacks = base.options.callbacks[actionKey]
		for(var c=0;c<callbacks.length;c++) callbacks[c].apply(base, actionParams)
	}
	
	$.Pyro.UI.addAction(actionKey, fn) {
		base.options.callbacks.load.push(fn);
	}
	
})