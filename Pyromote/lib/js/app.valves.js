$(function(){
	
	var $app = $('body');
	var $sphere = $app.pyrosphere();
	var $loop = $app.pyroloop();
	
	var valveConfig = new Object();
	
			valveConfig.valveon = function(valvenum, scope, event){
				
				var $container = $(this);
				var scope = $container.data("Pyro.Valves");
				
				scope.valves[valvenum] = 1;

				// console.log(req);
				$sphere.pyrosphere('send', '+'+valvenum+'.'); 
				// $sphere.pyrosphere('process');
				$container.data('Pyro.Valves', scope);
				
				console.log(valvenum + ' on');
								
			}
			
			valveConfig.valveoff = function(valvenum, scope, event){
				
				var $container = $(this);
				var scope = $container.data("Pyro.Valves");
				// var req = '-'+$valve.attr('data-valve')+'.';
				
				$sphere.pyrosphere('send', '-'+valvenum+'.');
				
				scope.valves[valvenum] = 0;
				
				$container.data('Pyro.Valves', scope);
				
				console.log(valvenum + ' off');
				// $sphere.pyrosphere('process');
				
			}

	$('#valves').pyrovalve(valveConfig);
	
})