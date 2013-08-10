class Loader = function( options ){
	
	this.filesToLoad = 0,
	this.filesLoaded = 0,
	
	this.options = options || new Object,

	this.options.load = options.load || function(){ console.log('') },
	this.options.complete = options.complete || function(){ console.log('') }, //callback fired when all files are loaded.

 	this.loaded = false;

	this.loadImage(uri)
	{
	    var img = new Image();
			this.filesToLoad++;
	    img.onload = this.isAppLoaded;
	    img.src = uri;
	    return img;
	}

	this.loadAudio(uri)
	{
	    var audio = new Audio();
			this.filesToLoad++;
	    audio.addEventListener('canplaythrough', this.isAppLoaded, false); // It works!!
	    audio.src = uri;
			autio.parent = this;
	    return audio;
	}

	this.isAppLoaded()
	{
	    this.filesLoaded++;
	    if (filesLoaded >= filesToLoad) {
				this.options.loaded();
				this.options.complete.apply( this );
			} else {
				this.options.load.apply( this );
			}
			
	}
	
	return this;
	
}

