
//This is where we do the configuration. 
//Below is an object, that I've mapped to 
//Various callbacks within the .pyrogrid() jquery plugin. 
//This enables us to configure the Grid as we please, while keeping
//our business logic separate. Fully configurable. 

$(function(){
	
	var pyro = new Object();
	// var pyro.ui = $.pyroUI();
	// var pyro.sphere = new Sphere( $('body') );
	
	var $app = $('body');
	var $sphere = $app.pyrosphere();
	var $loop = $app.pyroloop();
	
	var xy = new Object();
		xy.action = new Object();
		xy.status = new Object();
		
		xy.transitions = new Array();
		
		xy.transitions = shuffle(xy.transitions);
		
		xy.updateDuration = function( pos, scope ){
			var $grid = $(this);
			var pointerwidth = scope.$pointer.width();
			var max = $grid.outWidth();
			var oriented = !scope.options.invertAxis ? pos.y : pos.x;
			scope.status.value.duration = Math.round(normalize(oriented, 0, max, $.Pyro.Config.Limits.Duration.Min, $.Pyro.Config.Limits.Duration.Max));
			scope.status.displayValue.duration = Math.round(normalize(oriented, 0, 100, $.Pyro.Config.Limits.Interval.Min, $.Pyro.Config.Limits.Interval.Max));
			$grid.data("Pyro.Grid", scope);
		}
		
		xy.updateInterval = function( pos, scope ){
			var $grid = $(this);
			var pointerheight = scope.$pointer.width();
			var max = $grid.outHeight();
			var oriented = xy.status.oriented.interval = !scope.options.invertAxis ? pos.y : pos.x;
			scope.status.value.interval = Math.round(normalize(oriented, 0, max, $.Pyro.Config.Limits.Interval.Min, $.Pyro.Config.Limits.Interval.Max));
			scope.status.displayValue.interval = Math.round(normalize(oriented, 0, 100, $.Pyro.Config.Limits.Interval.Min, $.Pyro.Config.Limits.Interval.Max));
			$grid.data("Pyro.Grid", scope);
		}
		
		xy.update = function( pos, scope ){
			
			var $grid = $(this);
			
			xy.status.dim = new Object();
			xy.status.dim.width = scope.$pointer.width();
			xy.status.dim.height = scope.$pointer.height();
			
			//Interfacing limits. Considering axis inversion, max width or height.
			xy.status.limits = new Object();
			xy.status.limits.duration = !scope.options.invertAxis ? $grid.outerWidth() : $grid.outerHeight();
			xy.status.limits.interval = !scope.options.invertAxis ? $grid.outerHeight() : $grid.outerWidth();
			
			//Raw touch values, not normalized to ranges yet. Considering user preference.
			xy.status.oriented = new Object();
			xy.status.oriented.duration = !scope.options.invertAxis ? pos.x : pos.y;
			xy.status.oriented.interval = !scope.options.invertAxis ? pos.y : pos.x;
			
			//Normalized Values, ready to set sphere.
			xy.status.normalized = new Object();
			xy.status.normalized.duration = Math.round(normalize(xy.status.oriented.duration, 0, xy.status.limits.duration, $.Pyro.Config.Limits.Duration.Min, $.Pyro.Config.Limits.Duration.Max)); //no less than 30 MS, no longer than 750 ms. (flameDuration)
			xy.status.normalized.interval = Math.round(normalize(xy.status.oriented.interval, 0, xy.status.limits.interval, $.Pyro.Config.Limits.Interval.Min, $.Pyro.Config.Limits.Interval.Max)); //no less than 30 MS, no longer than 750 ms. (flameDuration)	
		
		}
		
		//Function is called when grid is setup.
		xy.action.setup = function( scope ){
			var $grid = $(this);
			
			scope.status.timestamp.lastEmit = -1;
			
			scope.transitions = [
				{ left : scope.$pointer.width()*-1 }, //left
				{ left : $(document).width() 			 }, //right
				{ top : scope.$pointer.height()*-1  }, //up
				{ top : $(document).height()       }, //down
				{ left : scope.$pointer.width()*-1, top : scope.$pointer.height()*-1 }, //left up
				{ left : scope.$pointer.width()*-1, top : $(document).height() }, //left down
				{ left : $(document).width(), top : scope.$pointer.height()*-1 }, //right up
				{ left : $(document).width(), top : $(document).height() } //right down
			];
			
			scope.$lineX = $('<div>');
			scope.$lineY = $('<div>');
			
			// scope.$stats.appendTo(scope.$pointer.find('.zero'));
			
			// watch(scope.status, 'mousedown', function(){
			    // console.log('Mousedown changed');
			// });
			
			// watch(scope.status, 'idle', function(){
			    // console.log('Idle changed');
			// });
		
			
			// watch(scope.status.value, 'x', function(prop, action, newvalue, oldvalue){
				// duration
				// console.log('x change')
			  // socket.emit('pipe', '@'+newValue.x || oldValue.x+'.');
			// });
			
			// watch(scope.status.value, function(prop, action, newvalue, oldvalue){
				//interval
				// socket.emit('pipe', '#'+newValue.y || oldValue.y+'.');
			// });
			
			// watch(scope.timestamp, 'lastActivity', function(){
			// 	    console.log('Activity')
			// 			if(scope.status.timestamp)
			// 	});
			
			
			
			scope.options.sound = true;
			
			$grid.data('Pyro.Grid', scope);
			
			return true;
		}
		
		//When there is a change in value (down or move)
		xy.action.change = function( pos, event, scope ){
			
			// var size = new Object();
					// size.x = normalize(scope.status.value.x, 20, 750, 40, 200, true ); // between 40 and 200, round it
					// size.y = normalize(scope.status.value.y, 20, 750, 40, 200, true ); // ^
					
			// scope.$stats.find('.x .value').css('font-size', size.x+'pt');
			// scope.$stats.find('.y .value').css('font-size', size.y+'pt');
			
			if(!$sphere.pyrosphere('get', 'active')) $sphere.pyrosphere('set', 'active', 1 );
			
			$sphere.pyrosphere('set', 'frameDuration', scope.status.value.x );
			$sphere.pyrosphere('set', 'frameInterval', scope.status.value.y );
			
			$sphere.pyrosphere('process');
			
		}
		
		//This will normalize the scope to the 
		xy.action.normalize = function( pos, event, scope ) {
			xy.update.apply( this, [pos, scope] );
			return {
				x : xy.status.normalized.duration,
				y : xy.status.normalized.interval
			}
		}
		
		xy.action.pointer = function( pos, scope ){ 
			
			var $grid = $(this);
			var $pointer = scope.$pointer;
			var $stats = scope.$stats;

			//Alpha
			var average = (scope.status.pos.x + scope.status.pos.y) / 2;
			var max = $grid.width() > $grid.height() ? $grid.width()  : $grid.height(); //Bigger of the two
			var alpha = normalize(average, 0, max, 0.10, 0.60); //Normalize average between
			if(!scope.options.minimal) $pointer.find('.gradient').css('opacity', alpha);
			
			//Size
			var raw = new Object();
					raw.x = (!scope.options.invertAxis) ? scope.status.value.y : scope.status.value.x;
					raw.y = (!scope.options.invertAxis) ? scope.status.value.x : scope.status.value.y;
					
			var normal = new Object();
					normal.width = Math.round(normalize(raw.x, $.Pyro.Config.Limits.Duration.Min, $.Pyro.Config.Limits.Duration.Max, 30, $(document).width()*2) );
					normal.height = Math.round(normalize(raw.y, $.Pyro.Config.Limits.Interval.Min, $.Pyro.Config.Limits.Interval.Max, 30, $(document).height()*2) );
					
			$pointer.css('width', normal.width+'px').css('height', normal.height+'px')
			
		}

		xy.action.move = function( pos, event, scope ){
			
		}
		
		xy.action.firstActivity = function( pos, event, scope){
			var self = this;
			var $grid = $(self);
			scope.status.idle = false;
			
			console.log('Hello world!');
			
			if(scope.options.sound && !scope.options.minimal) $.playSound('lib/sounds/positive.wav', 2000); 
			
			scope.status.clicks = 1;
			
			$grid.data('Pyro.Grid', scope) ;
		}

		xy.action.down = function( pos, event, scope ){ 
			var $grid = $(this);	
			scope.$pointer.css({ opacity : 1 });
			if(scope.options.sound && scope.status.clicks > 1 && !scope.options.minimal) $.playSound('lib/sounds/welcome.wav', 2000);
			scope.status.clicks++;
			
			$('.toolbar').show();
			
			$grid.data('Pyro.Grid', scope) ;
		}

		xy.action.up = function( event, scope ){
			var $grid = $(this);
			
			var rand = Math.round(Math.random() * (scope.transitions.length-1) );
			
			xy.action.setup.apply( this, [ scope ] );
			
			scope = $grid.data('Pyro.Grid');
			
			$('.toolbar').show();
			
			if(!scope.options.hold) {
				
				if(!scope.options.minimal) {
				
				var trans = scope.transitions[rand];
				
					trans.easing = 'easeInExpo';
					trans.opacity = 0;
					scope.$pointer.stop().animate(trans, 200, function(){});
				
				} else {
					
					scope.$pointer.stop().css(trans);
					
				}
						
						
				$sphere.pyrosphere('set', 'active', 0);
				$sphere.pyrosphere('process');
			}
			
			return true; //RETURN TRUE! If not, default core functionality (HIDE) will take over. You'll get frustrated. Return true.
		}
		
		xy.action.idleEnd = function( pos, event, scope ){
			//Make sure we only play it once.
			if(scope.options.sound && scope.status.clicks > 1) $.playSound('lib/sounds/positive.wav', 2000); 
		}
		
		xy.gridconfig = {
			
			labelX : 'Duration',
			labelY : 'Interval',
			// noMouseClick : true,
			hold : false,
			// useX : false,
			pressmove : xy.action.move,
			pressdown : xy.action.down,
			pressup : xy.action.up,
			alterValue : xy.action.normalize,
			minimal : true,
			// pointer : xy.action.pointer,
			change : xy.action.change,
			setup : xy.action.setup,
			firstActivity : xy.action.firstActivity,
			idleEnd : xy.action.idleEnd,
			// $loop : $loop
			
		}
		
		xy.sessionconfig = {}
	
	var $xygrid = $('#grid').pyrogrid( xy.gridconfig );
	
	var patterndata = ['00','149','236','301','349','411','462','524','604','647','100','15','237','303','35','413','463','53','605','648','101','150','238','304','354','414','464','54','606','649','102','151','239','305','357','415','465','545','607','650','104','152','241','306','358','416','466','548','608','651','105','155','242','307','359','417','468','553','609','652','106','156','243','308','360','418','47','554','610','653','107','157','244','309','361','419','470','555','611','654','108','158','245','31','364','42','471','556','612','655','109','159','246','310','366','420','472','558','613','656','110','16','247','311','367','421','473','559','614','657','111','160','249','313','368','422','474','562','615','658','112','164','250','314','369','423','475','563','616','659','113','169','251','315','372','424','476','564','617','661','114','171','252','317','373','425','477','565','618','662','115','172','253','318','374','426','478','566','619','663','116','175','254','319','375','427','479','567','620','664','117','176','255','32','376','428','48','568','621','665','118','18','256','320','377','429','480','569','622','666','119','183','257','321','378','430','481','57','623','668','120','184','258','322','379','431','482','570','624','669','121','187','259','323','38','432','483','571','625','67','122','189','26','324','380','433','484','572','626','670','123','19','262','325','381','436','485','573','627','68','124','191','263','327','382','437','486','574','628','71','125','192','27','328','383','438','487','575','629','79','126','195','271','329','386','439','49','576','630','84','127','199','272','330','387','44','494','577','631','86','129','20','274','331','389','440','496','578','632','87','130','200','275','332','39','441','497','579','633','88','131','201','277','333','390','442','50','580','634','89','132','212','278','334','399','444','508','581','635','90','133','217','28','335','400','447','51','582','636','91','134','219','280','336','401','448','513','583','637','92','135','221','281','337','402','449','514','586','638','93','139','222','286','338','403','45','515','587','639','94','141','226','287','339','404','450','516','588','64','95','142','228','29','340','405','451','517','590','640','97','143','229','293','342','406','452','518','592','641','98','144','230','296','343','407','453','519','595','642','145','231','297','344','408','454','520','599','643','146','232','299','346','409','455','521','60','644','147','233','30','347','41','456','522','602','645','148','234','300','348','410','459','523','603','646'];
	
	var patternconfig = { 

		enableHotkeys : true,
		queueTimeout : 5555,
		// $loop : $loop,
		
		onqueue : function( scope ){
			var self = this;
			scope.$clock.show();
			$('.progress', scope.$clock).stop().css({ right : '100%' }).animate({ right : '0%' }, scope.options.queueTimeout);
		},
		
		onqueuestop : function( scope ){
			var self = this;
			scope.$clock.hide();
			$('.progress', scope.$clock).stop().css({ right : '100%' });
		},
		
		onready : function(){
			console.log('OK!');
		},
		
		onselect : function( scope, event ){
			
			//If enough time has passed...
			$sphere.pyrosphere('set', 'pattern', scope.current.data.filename);
			$sphere.pyrosphere('process');
			
		}
		
	}
	
	$loop.pyroloop('addAction', 'timeElapsed', function(){
		
		var time = $app.data('Pyro.Time');
		
		if(!time) time = { started : new Date().getTime(), elapsed : 0, now : new Date().getTime(), last : new Date().getTime() };
			
 		var last = time.now;
		time.now = new Date().getTime()
		time.elapsed = time.started - last;
		// console.log(Math.round(time.elapsed / 1000)*-1)

		$app.data('Pyro.Time', time);		
		
	}, 1000);
	
	var $patterns = $('#patterns').pyroqueue(patternconfig, patterndata);
	
	var sliders = function(){
						
		return {
			useX : false,
			hold : true,
			setup : function( scope ){
				// console.log(scope.status.offset);
				// console.log(scope.status.placement);
			},
			pressdown : function( pos, event, scope ){
				// console.log(scope.status.offset);
				console.log( pos );
			}
		}
		
	}
	
	// $('#dummy').pyrogrid(sliders);
	// $('#duration').pyrogrid(new sliders());	
	// $('#pattern').pyrogrid(new sliders());	
	// $('#interval').pyrogrid(new sliders());
	
	// console.log('///');
	// console.log($('#duration').data('Pyro.Grid').status.offset);
	// console.log('///');		
	// console.log($grid);
	// console.log($patterns);
	// console.log($sphere);
});