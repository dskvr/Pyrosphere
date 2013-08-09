//How to use:
//$.plugin('toolbar', )

var Toolbar = {
	
  init: function( options, el ) {

    this.options = $.extend( {}, this.options, options );

    this.bar  = el;
    this.$bar = $(el);

		this.$contents = this.$bar.find('.menu-contents');
		
		this._build();
		this._bind();
		
		this.isVisible();

		// this.ui = $('#pyromote').data('Pyro.UI');

    this._build();

    return this;

  },
  
	options: {
		
		animate : false,
		onReady : function( event ){ console.log('Toolbar Ready'); },
		onShow : function( event ){ console.log('Toolbar was shown'); },
		onHide : function( event ){ console.log('Toolbar was hidden'); }
		
  },
	
	//Private / Helpers
	
	_build: function(){
		
		//Toggle Button
		this.$toggle = $('<div>');
		this.$toggle.appendTo(this.$bar);
		this.$toggle.addClass('.menu-toggle').attr('id', 'toggle-menu');
		this.$toggle.html('☰');
		
  },

	_bind: function(  ){
		
		this.$toggle.bind('click', this.toggleToolbar);
		
	},
	
	//Helper method for initilizing a callback.
	_callback : function( name ){
		
		if(typeof this.options[name] == 'function') return this.options[name];
		
	},
	
	
	//
	//Public Methods.
	//
  showToolbar : function( event ){
		
		this._callback.apply( this, [ 'onShow' , event ] );
		this.$contents.show();
		
  },

	hideToolbar : function( event ){
		
		this.$contents.hide();
		this._callback.apply( this, ['onHide', event] );	
		
	},
	
	toggleToolbar : function( event ){
	
		if( this.isVisible() ) this.hideToolbar( event ); else this.showToolbar( event );
	
	},
	
	isVisible : function(){
		
		return ( this.visible = this.$contents.is(':visible') ? true : false );
		
	}
	
};

(function(){
	$.plugin('pyroToolbar', Toolbar);	
})