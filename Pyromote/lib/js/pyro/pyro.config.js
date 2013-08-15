// session.options
// session.preferences
// session.mode
// session.auth


$(function($){
	
	$.Pyro.Config = new Object();
	
	//Show menu after [one second]
	$.Pyro.Config.ShowMenuAfter = 1000;
	
	$.Pyro.Config.Limits = new Object();
	
	
	/***************************************
		Environment Configuration
		Developers edit these...!
	/***************************************/
	
	$.Pyro.Config.URI = new Object();

	$.Pyro.Config.URI.Socket = 'http://192.168.1.100:3000'; /*development*/
	// $.Pyro.Config.URI.Socket = 'http://192.168.1.111:3000'; /*production*/
	// $.Pyro.Config.URI.Socket = 'http://dskvr-2.local:3000'; /*edge testing, alpha*/




	/***************************************
		Experience Configuration
		Edit these to create optimal user experience by 
		finding the 'sweet spot'
	/***************************************/	
	

	
	//
	// ACTIONABLE PARAMS
	//
	//Flame Duration
	$.Pyro.Config.Limits.Interval = new Object();
	$.Pyro.Config.Limits.Interval.Min = 40;
	$.Pyro.Config.Limits.Interval.Max = 400;
	
	//Flame Duration Limits
	$.Pyro.Config.Limits.Duration = new Object();
	$.Pyro.Config.Limits.Duration.Min = 40;
	$.Pyro.Config.Limits.Duration.Max = 400;
	
	$.Pyro.Config.Limits.IdleThreshold = 60*1000; //sixty seconds.
	
	
	

	//
	// UI PREFERENCES
	//
	//Alpha of the stats limits, these are normalized.
	$.Pyro.Config.Limits.StatsAlpha = new Object();
	$.Pyro.Config.Limits.StatsAlpha.Min = 0.1;
	$.Pyro.Config.Limits.StatsAlpha.Max = 0.85;
	
	//Font size of the stats, normalized between these numbers, in 'pt'
	$.Pyro.Config.Limits.StatsFontSize = new Object();
	$.Pyro.Config.Limits.StatsFontSize.Min = 40;
	$.Pyro.Config.Limits.StatsFontSize.Max = 150;
	
	
});
