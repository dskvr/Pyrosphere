(function($){
    if(!$.Pyro){
        $.Pyro = new Object();
    };
    
    $.Pyro.Grid = function(el, options){
        var base = this;
        
        base.$el = $(el);
        base.el = el;
        
        base.$el.data("Pyro.Grid", base);
        
        base.init = function(){
            base.options = $.extend({},$.Pyro.Grid.defaultOptions, options);
        };
        base.init();
    };
    
    $.Pyro.Grid.defaultOptions = {
    };
    
    $.fn.pyro_Grid = function(options){
        return this.each(function(){
            (new $.Pyro.Grid(this, options));
        });
    };
   
	return $;
})(jQuery);