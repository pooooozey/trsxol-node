;(function($){
    $.fn.PZtouch = function(options) {
    	//拖动纸牌
    	var opts = $.extend({}, $.fn.PZtouch.defaults, options); 

    	this.each(function(){
	    	var card = $(this);
	    	card.on("mousedown",function(ev){
				var disX = ev.pageX - card.offset().left;
				var disY = ev.pageY - card.offset().top;

				$(document).on("mousemove.move",function(ev){
					card.css({
						"left":ev.pageX - disX,
						"top":ev.pageY - disY
					});
					return false;
				});

				$(document).on("mouseup.move",function(ev){
					$(document).off('.move');
					if(opts.callback){
						opts.callback(card);
					}
					return false;
				});

				return false;
			});
	    });

	    return this.each(function(){
	    	var card = $(this);
	    	card.on("touchstart",function(ev){
				var touch = ev.originalEvent.changedTouches[0];
				var disX = touch.pageX - card.offset().left;
				var disY = touch.pageY - card.offset().top;

				card.on("touchmove.move",function(ev){
					var touch = ev.originalEvent.changedTouches[0];
					card.css({
						"left":touch.pageX - disX,
						"top":touch.pageY - disY
					});
					return false;
				});

				card.on("touchend.move",function(ev){
					card.off('.move');
					if(opts.callback){
						opts.callback(card);
					}
					return false;
				});

				return false;
			});
	    });
	}

	$.fn.PZtouch.defaults = {
		callback : null
	};

	$.extend({
		collision : function(card,cards){
			//碰撞检测
			var arr = [];
			var l = card.offset().left;
			var t = card.offset().top;
			var w = card.width();
			var h = card.get(0).offsetHeight;
			
			cards.each(function(i,e){
				var l2 = $(e).offset().left;
				var t2 = $(e).offset().top;

				if(l+w<l2||l>l2+w||t+h<t2||t>t2+h){
					//检测每个没碰撞
				}else{
					//碰撞
					arr.push($(e));
				}
			});
			
			if(arr.length==0){
				//全部没碰撞，回归
				card.css({
					"left" : "",
					"top" : ""
				});
			}else{
				appendCard();
			}


			function appendCard(){
				for(var i=0;i<arr.length;i++){
					if(arr[i].find(".card-positive").length==0){
						arr[i].attr("cid",card.attr("cid"));
						card.hide();
						console.log(card.html())
						arr[i].addClass("showPoker").html(card.html());
						return;
					}
				}
				card.css({
					"left" : "",
					"top" : ""
				});
			}

		}
	});


})(jQuery);
