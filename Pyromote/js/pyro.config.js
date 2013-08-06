// session.options
// session.preferences
// session.mode
// session.auth


$(function($){
	
	$.Pyro.Config = new Object();
	$.Pyro.Config.Limits = new Object();


	//
	// ACTIONABLE PARAMS
	//
	//Flame Duration
	$.Pyro.Config.Limits.Interval = new Object();
	$.Pyro.Config.Limits.Interval.Min = 40;
	$.Pyro.Config.Limits.Interval.Max = 750;
	
	//Flame Duration Limits
	$.Pyro.Config.Limits.Duration = new Object();
	$.Pyro.Config.Limits.Duration.Min = 40;
	$.Pyro.Config.Limits.Duration.Max = 750;


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
