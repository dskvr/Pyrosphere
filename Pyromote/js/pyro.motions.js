//values for patterns
(function($){
	
	if(!$.Pyro) $.Pyro = new Object();
	
	$.Pyro.Motions = new Object();
	$.Pyro.Motions.Methods = new Object();
	
	$.Pyro.Motions.Data = ['00','149','236','301','349','411','462','524','604','647','100','15','237','303','35','413','463','53','605','648','101','150','238','304','354','414','464','54','606','649','102','151','239','305','357','415','465','545','607','650','104','152','241','306','358','416','466','548','608','651','105','155','242','307','359','417','468','553','609','652','106','156','243','308','360','418','47','554','610','653','107','157','244','309','361','419','470','555','611','654','108','158','245','31','364','42','471','556','612','655','109','159','246','310','366','420','472','558','613','656','110','16','247','311','367','421','473','559','614','657','111','160','249','313','368','422','474','562','615','658','112','164','250','314','369','423','475','563','616','659','113','169','251','315','372','424','476','564','617','661','114','171','252','317','373','425','477','565','618','662','115','172','253','318','374','426','478','566','619','663','116','175','254','319','375','427','479','567','620','664','117','176','255','32','376','428','48','568','621','665','118','18','256','320','377','429','480','569','622','666','119','183','257','321','378','430','481','57','623','668','120','184','258','322','379','431','482','570','624','669','121','187','259','323','38','432','483','571','625','67','122','189','26','324','380','433','484','572','626','670','123','19','262','325','381','436','485','573','627','68','124','191','263','327','382','437','486','574','628','71','125','192','27','328','383','438','487','575','629','79','126','195','271','329','386','439','49','576','630','84','127','199','272','330','387','44','494','577','631','86','129','20','274','331','389','440','496','578','632','87','130','200','275','332','39','441','497','579','633','88','131','201','277','333','390','442','50','580','634','89','132','212','278','334','399','444','508','581','635','90','133','217','28','335','400','447','51','582','636','91','134','219','280','336','401','448','513','583','637','92','135','221','281','337','402','449','514','586','638','93','139','222','286','338','403','45','515','587','639','94','141','226','287','339','404','450','516','588','64','95','142','228','29','340','405','451','517','590','640','97','143','229','293','342','406','452','518','592','641','98','144','230','296','343','407','453','519','595','642','145','231','297','344','408','454','520','599','643','146','232','299','346','409','455','521','60','644','147','233','30','347','41','456','522','602','645','148','234','300','348','410','459','523','603','646'];
	$.Pyro.Motions.Extension = '.dat';
	
	$.Pyro.Motions.Defaults = {
		queueTimeout : 10000,
		queueRandom : false,
		
		enableHotkeys : false,
		
		onReady : function( scope ){ },
		onselect : function( event ){  },
		onnext : function( event ){  },
		onPrev : function( event ){  }
	}
	
	$.Pyro.Motions.Methods.init = function( options ){
		
		alert('wtf');
		
		var $this = $(this);
		
		var scope = new Object();
				
				scope.options = $.extend({}, $.Pyro.Motions.Defaults, options);
				
				scope.files = $.Pyro.Motions.Data;
				scope.total = scope.files.length;
				
				scope.current = new Object();
				scope.current.index = 0;
				scope.current.filename = scope.files[scope.current.index];
				
				scope.queue = new Object();
				scope.queue.status = false;
	
				scope.next = 1; 
				scope.prev = scope.total-1;
				
				scope.reset = function(){
					this.next = (typeof $.Pyro.Motions.Data[this.current.index+1] != 'undefined') ? this.current.index+1 : 0; 
					this.prev = (typeof $.Pyro.Motions.Data[this.current.index-1] != 'undefined') ? this.current.index-1 : this.total-1;
				}
				
				scope.$container = $this, scope.$ul = false, scope.$motions = false
			//
				
		$.Pyro.Motions.HTML.apply(this, [scope]);
		$.Pyro.Motions.Bind.apply(this, [scope]);
		
		$this.data('Pyro.Motions', scope); //Plural!
		
		console.log(scope);
		
		return this;
		
	}
	
	//Queue
	
	//Play Button, toggles on or off.
	
	$.Pyro.Motions.Methods.togglePlayQueue = function(){
		
		var $container = $(this);
		var scope = $container.data('Pyro.Motions');
		
		if(scope.queue.status) $container.pyromotions('StopQueue');
 		else $container.pyromotions('PlayQueue');

	}
	
	
	
	//Play Queue
	
	//Changes pattern every X seconds.
	
	$.Pyro.Motions.Methods.playQueue = function( refresh, random ){
		var $container = $(this);
		var scope = $container.data('Pyro.Motions');
		
				var refresh = refresh || scope.options.queueTimeout;
				var random = random || scope.options.queueRandom;
		
				scope.queue.interval = setInterval(function(){
					
					if(random) scope.$container.find('li:random').click();
					else scope.toggles.$next.click();
					
				}, refresh)
				
				scope.queue.status = true;
	}
	
	$.Pyro.Motions.Methods.stopQueue = function(){
		
		var $container = $(this);
		var scope = $container.data('Pyro.Motions');
		
		clearInterval(scope.queue.interval)
		
		scope.queue.status = false;
		
		$container.data('Pyro.Motions', scope);
		
	}
	
	// CONTROLS
	
	//select a pattern.
	
	$.Pyro.Motions.Methods.select = function( event ){
		
		var $pattern = $(this);
		var motion = $pattern.data('Pyro.Motions');
		
		if(!motion.length) return;
		
		var $container = $(motion.parent);
		var scope = $container.data('Pyro.Motions');	
		
		if(scope.current.index == motion.id ) return false;

		scope.current.index = motion.id;
		scope.reset(); 

		$container.find('.selected').removeClass('selected');
		$pattern.addClass('selected');

		$container.data('Pyro.Motions', scope);
		
		scope.options.onselect.apply( this, scope, event );
	}
	
	$.Pyro.Motions.Methods.next = function( event ){
		
		var $container = $(this);
		var scope = $container.data('Pyro.Motions');
		
		var $select = $container.find('li').eq(scope.next);
		
		$select.pyromotions('select');
		
		scope.options.onnext.apply( this, scope, event );
		
	}
	
	$.Pyro.Motions.Methods.previous = function( event ){
		
		var $container = $(this);
		var scope = $container.data('Pyro.Motions');
		
		var $select = $container.find('li').eq(scope.prev);
		
		$select.pyromotions('select');
		
		scope.options.onnext.apply( this, scope, event );
		
	}
	
	$.Pyro.Motions.HTML = function( scope ){s
		var $container = $(this);
		
		scope.$ul = $('<ul>').appendTo($container);
		
		
		$.each($.Pyro.Motions.Data, function(key, value){
			
			scope.$motions = $('<li>');
			scope.$motions.appendTo(scope.$ul);
			scope.$motions.html(value);
					
			var motion = {
						id : key,
						filename : value,
						file : value+$.Pyro.Motions.Extension,
						parent : '#'+scope.$container.attr('id')
					}
			scope.$motions
				.attr('data-id', motion.id)
				.attr('data-filename', motion.filename)
				.attr('data-file', motion.file)
				.data('Pyro.Motion', motion);
							
		});
		
		//Container for DOM toggles
		scope.toggles = scope.toggles || new Object();
		
		scope.toggles.$next = $('<a>');
		scope.toggles.$next.appendTo($container);
		scope.toggles.$next.attr('id', 'next');
				
		scope.toggles.$previous = $('<a>');
		scope.toggles.$previous.appendTo($container);
		scope.toggles.$previous.attr('id', 'prev');
		
		scope.$cue = $('<a>');
		scope.$cue.appendTo($container);
		scope.$cue.attr('id', 'cue-queue');
		
		scope.$playqueue = $('<a>');
		scope.$playqueue.appendTo($container);	
		scope.$playqueue.attr('id', 'play-queue').html('Play');
		
		scope.$stopqueue = $('<a>');
		scope.$stopqueue.appendTo($container);	
		scope.$stopqueue.attr('id', 'stop-queue').html('Stop');;
		
		$(this).data('Pyro.Motion', scope);
		
	}
	
	$.Pyro.Motions.Bind = function( scope ){
		
		var $this = $(this);
		
		//Bind Direct Pattern selection
		scope.$container.find('li').each(function(){
			
			$pattern = $(this);
			$pattern.bind('click', $.Pyro.Motions.Methods.select);
			$pattern.bind('touchstart', $.Pyro.Motions.Methods.select);

		});
		
		//next & previous
		scope.toggles.$next.bind('click', $.Pyro.Motions.Methods.next);
		scope.toggles.$next.bind('touchstart', $.Pyro.Motions.Methods.next);
		scope.toggles.$previous.bind('click', $.Pyro.Motions.Methods.previous);
		scope.toggles.$previous.bind('touchstart', $.Pyro.Motions.Methods.previous);
		
		scope.$cue.bind('click', $.Pyro.Motions.Methods.TogglePlayQueue);
		scope.$playqueue.bind('click', $.Pyro.Motions.Methods.PlayQueue);
		scope.$stopqueue.bind('click', $.Pyro.Motions.Methods.StopQueue);
		
		if(scope.options.enableHotkeys) {
			// Bind Keystrokes
			$(document).bind('keydown', 'down', $.Pyro.Motions.Methods.next);
			$(document).bind('keydown', 'right', $.Pyro.Motions.Methods.next);
			$(document).bind('keydown', 'up', $.Pyro.Motions.Methods.previous);
			$(document).bind('keydown', 'left', $.Pyro.Motions.Methods.previous);
		}		
		
	}
	
	$.fn.pyromotion = function( method ){
		var methods = $.Pyro.Motions.Methods;
		return this.each(function(){
		
			if ( methods[method] ) {
			  return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
			} else if ( typeof method === 'object' || ! method ) {
			  return methods.init.apply( this, arguments );
			} else {
			  $.error( 'Method ' +  method + ' does not exist on jQuery.gallery ');
			}	
		
		});
	};
	
})($)

