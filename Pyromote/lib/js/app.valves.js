$(function(){
	
	var THRESH = 20;
	
	var $app = $('body');
	var $sphere = $app.pyrosphere();
	var $loop = $app.pyroloop();
	
	var valveConfig = new Object();
	
			valveConfig.valveon = function(valvenum, scope, event){
				
				var $container = $(this);
				var scope = $container.data("Pyro.Valves");
				var now = new Date().getTime();
				var diff = now - scope.lastRequest;
				
				if(valvenum != 1) scope.valves[valvenum] = 1;

				// console.log(req);
				$sphere.pyrosphere('set', 'valveOn', valvenum); 
				if( diff > THRESH ) {
					$sphere.pyrosphere('process');
					scope.lastRequest = now;

				}

				scope.valves[valvenum] = 1;
				
				scope.lastRequest = now;

				$container.data('Pyro.Valves', scope);

				console.log(valvenum + ' on');

			}
			
			valveConfig.valveoff = function(valvenum, scope, event){
				
				var $container = $(this);
				var scope = $container.data("Pyro.Valves");
				var now = new Date().getTime();
				var diff = now - scope.lastRequest;
				// var req = '-'+$valve.attr('data-valve')+'.';
				
				$sphere.pyrosphere('set', 'valveOff', valvenum); 
				
				if( diff > THRESH ) {
					$sphere.pyrosphere('process');
					scope.lastRequest = now;
				}
				
				scope.valves[valvenum] = 0;
				
				$container.data('Pyro.Valves', scope);
				
				console.log(valvenum + ' off');
				// $sphere.pyrosphere('process');
				
			}

	$('#valves').pyrovalve(valveConfig);
	
})