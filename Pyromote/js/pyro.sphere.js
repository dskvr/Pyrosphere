(function($){
    if(!$.Pyro){
        $.Pyro = new Object();
    };
    
    $.Pyro.Sphere = function(el, options){
        var base = this;
        
        base.$el = $(el);
        base.el = el;
        
        base.$el.data("Pyro.Sphere", base);
        
        base.init = function(){
            base.options = $.extend({},$.Pyro.Sphere.defaultOptions, options);
            
        };
        base.init();
    };
    
    $.Pyro.Sphere.defaultOptions = {
    };
    
    $.fn.pyro_Sphere = function(options){
        return this.each(function(){
            (new $.Pyro.Sphere(this, options));
        });
    };
    
})(jQuery);