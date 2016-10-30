var socket = io();
var setting = {
	"jQueryMap" : {},
	"config" : {
		"userName" : null,
		"roomName" : null
	},
	"userList" : [],
	"userLength" : 0,
	"selfPlayer" : null
};
var tipInv = null;
$(function(){
	setting["jQueryMap"]["$toget-cards_card"] = $("#toget-cards .card");
	setting["jQueryMap"]["$ready-cards_card"] = $(".ready-cards .card");
	setting["jQueryMap"]["$tool-reset"] = $("#tool .reset");
	setting["jQueryMap"]["$tool-ready"] = $("#tool .ready");
	setting["jQueryMap"]["$tip"] = $("#tip");
	
	//绑定拖动事件
	setting["jQueryMap"]["$toget-cards_card"].PZtouch({
		callback : function(card){
			//碰撞检测
			$.collision(card,$(".ready-cards .card"));
			//所有牌选择完毕
			if(setting["jQueryMap"]["$ready-cards_card"].find(".card-positive").length==6){
				setting["jQueryMap"]["$tool-ready"].removeClass("banned");
			}
		}
	});

	//重置拖动
	$(".reset").click(function(){
		setting["jQueryMap"]["$ready-cards_card"].attr("cid","").removeClass("showPoker");
		setTimeout(function(){
			setting["jQueryMap"]["$ready-cards_card"].find(".card-positive").remove();
		},270);
		setting["jQueryMap"]["$toget-cards_card"].css({"left":"","top":""}).fadeIn(300);

	});

	setting["jQueryMap"]["$tool-ready"].click(function(){
		if($(this).hasClass("banned")){
			return false;
		}else{
			//已准备好手牌
			setting["jQueryMap"]["$tool-reset"].addClass("banned");
			setting["jQueryMap"]["$tool-ready"].addClass("banned");
			setting["jQueryMap"]["$tip"].fadeIn(300).find(".text").html("等待其他玩家");

			console.log(setting["userList"][setting["config"]["userName"]])
			setting["userList"][setting["config"]["userName"]]["player"]["pokerCompare1"] = setting["jQueryMap"]["$ready-cards_card"].eq(0).attr("cid");
			setting["userList"][setting["config"]["userName"]]["player"]["pokerCompare2"] = [setting["jQueryMap"]["$ready-cards_card"].eq(1).attr("cid"),setting["jQueryMap"]["$ready-cards_card"].eq(2).attr("cid")];
			setting["userList"][setting["config"]["userName"]]["player"]["pokerCompare3"] = [setting["jQueryMap"]["$ready-cards_card"].eq(3).attr("cid"),setting["jQueryMap"]["$ready-cards_card"].eq(4).attr("cid"),setting["jQueryMap"]["$ready-cards_card"].eq(5).attr("cid")];

			setting["userList"][setting["config"]["userName"]]["userState"] = "beginPlay";
			console.log(setting["userList"]);
			//发送到服务器
			socket.emit("beginPlay",{
				"userName" : setting["config"]["userName"],
				"player" : setting["userList"][setting["config"]["userName"]]
			});
		}

	});


	//输入房间名、用户名
	$(".iptRoom .btn").click(function(){
		var This = $(this);
		setting["config"]["roomName"] = $(this).prev().val();
		socket.emit("room",setting["config"]["roomName"]);

	});
	$(".iptName .btn").click(function(){
		setting["config"]["userName"] = $(this).prev().val();
		socket.emit("userList",{
			"userName":setting["config"]["userName"],
			"roomName":setting["config"]["roomName"]
		});
		
	});
	$(".userList .btn").click(function(){
		if($(this).hasClass("userReady")){
			$(this).removeClass("userReady").val("准备");
			socket.emit("userReady",{
				"userName":setting["config"]["userName"],
				"roomName":setting["config"]["roomName"],
				"userReady":"notReady"
			});
		}else{
			$(this).addClass("userReady").val("已准备");
			socket.emit("userReady",{
				"userName":setting["config"]["userName"],
				"roomName":setting["config"]["roomName"],
				"userReady":"ready"
			});
		}
	});

	$(document).on("click",".entering",function(){
		//加入某个房间
		if(parseInt($(this).find(".num").html())>=3){
			return false;
		}
		$("#roomList").hide();
		setting["config"]["roomName"] = $(this).find(".n").html();
		socket.emit("room",setting["config"]["roomName"]);
	});

	$(".createRoom").click(function(){
		$("#roomList").hide();
	});

	socket.on('setUserList', function(userList){
		setting["userList"] = userList;
		createUserList();
	});

	socket.on('userReady', function(userList){
		setting["userList"] = userList;
		createUserList();
	});

	socket.on('userNameIpt', function(J){
		if(!J["type"]){
			//错误提示：用户名存在
			clearInterval(tipInv);
			setting["jQueryMap"]["$tip"].fadeIn(300).find(".text").html(J["txt"]);
			tipInv = setInterval(function(){
				setting["jQueryMap"]["$tip"].fadeOut(300);
			},1000);
		}else{
			$(".iptName").hide().next().show();
			$("#username-self .txt").html(setting["config"]["userName"]);
		}
		
	});

	socket.on('roomState', function(J){
		//提交房间名的反馈
		if(J["state"]==1){
			setting["jQueryMap"]["$tip"].fadeIn(300).find(".text").html("人数已满或游戏已开始");
			setTimeout(function(){
				setting["jQueryMap"]["$tip"].fadeOut(300);
			},1000);
		}else{
			$(".iptRoom").hide().next().show();
			$("#room-self .txt").html(setting["config"]["roomName"]);
		}

	});

	socket.on('allRoomState', function(J){
		//所有房间的状态
		console.log(J)
		var str = '';
		for(var a in J){
			console.log(J[a]["roomState"])
			var roomStr = J[a]["roomState"]?"":"(游戏中)";
			str += '<li class="entering">'+roomStr+'房间：<span class="n">'+a+'</span>&nbsp;-&nbsp;<span class="num">'+J[a]["usersNum"]+'</span>/3人</li>'
		}
		$("#roomList ul").html(str);
	});
	

	socket.on('showCompare', function(userList){
		//获取最后结果牌
		setting["userList"] = userList;
	});

	socket.on('showCompareResults', function(res){
		//结果对比
		setting["jQueryMap"]["$tip"].fadeOut(700).find(".text").html("开始对比");

		console.log(res)
		//对比第一组
		setTimeout(function(){
			showRes1(res["res1"]);
		},500);

		//对比第二组
		setTimeout(function(){
			showRes2(res["res2"]);
		},3000);
		
		//对比第三组
		setTimeout(function(){
			showRes3(res["res3"]);
		},5500);

		//结算分数，准备下一局
		setTimeout(function(){
			$("#tool .reset,#tool .ready").hide();
			$("#tool .next").addClass("btnShow").click(function(){
				socket.emit("restart");
			});
		},7000);
		
	});

	socket.on('allReady', function(userList){
		//都准备好进入游戏
		setting["userList"] = userList;
		createUserList();
		setting["jQueryMap"]["$tip"].fadeIn(300).find(".text").html("开始游戏");


		clearInterval(tipInv);
		tipInv = setTimeout(function(){
			setting["jQueryMap"]["$tip"].fadeOut(300);
			$(".pop,#popBg").fadeOut(300);
			//开始游戏
			//设置自己的默认牌
			setOtherPlayerInfo();
			console.log(setting["userList"][setting["config"]["userName"]])
			setMyPoker(setting["userList"][setting["config"]["userName"]]);
		},1000);
		
	});
	socket.on('refresh', function(J){
		var txt = "";
		if(J["refreshMode"]==0){
			txt = "有玩家退出，即将退出房间!!!"
		}
		setting["jQueryMap"]["$tip"].fadeIn(300).find(".text").html(txt);
		clearInterval(tipInv);
		tipInv = setTimeout(function(){
			window.location.reload();
		},3000);
	});

	socket.on('restart', function(userList){
		//重新一局
		console.log("下一局")
		console.log(userList)
		setting["userList"] = userList;
		createUserList();
		$("#tool .reset").removeClass("banned").show();
		$("#tool .ready").show();
		$("#tool .next").removeClass("btnShow");
		$("#self .card").removeClass("showPoker").removeClass("win").removeClass("lose");
		setTimeout(function(){
			$("#self .card").find(".card-positive").remove();
		},270);
		$("#other-player .card").removeClass("showPoker").removeClass("win").removeClass("lose");
		$("#toget-cards .card").css({"left":"","top":""}).fadeIn(300);

		setOtherPlayerInfo();
		setMyPoker(setting["userList"][setting["config"]["userName"]]);

	});

	socket.on('userList', function(userList){
		setting["userList"] = userList;
		createUserList();
	});

	function createUserList(){
		var userListLength = getJSONlength(setting["userList"]);
		var str = '';
		for(var a in setting["userList"]){
			str += '<li>';
			if(setting["userList"][a]["userState"]=="ready"||setting["userList"][a]["userState"]=="beginPlay"){
				str += '<span class="ready">已准备</span>';
			}
			if(setting["userList"][a]["playerType"]=="computer"){
				str += '<span class="iconfont">&#xe609;</span><span class="txt">'+a+'</span></li>';
			}else{
				str += '<span class="iconfont">&#xe60a;</span><span class="txt">'+a+'</span></li>';
			}
		}
		var tmpLen = userListLength<3?3-userListLength:0;
		for(var i=0;i<tmpLen;i++){
			str += '<li><span class="ready">已准备</span><span class="iconfont">&#xe609;</span><span class="txt">电脑'+(i+1)+'</span></li>';
		}
		$(".userList ul").html(str);
	}

	function getJSONlength(J){
		//获取一个JSON的值数量
		var len = 0;
		for(var a in J){
			len++;
		}
		return len;
	}

	function setMyPoker(player){
		//显示手牌
		$("#toget-cards .card").each(function(i,e){
			var str = '<span class="num">'+player["player"].pokerArr[i].cards+'</span><span class="iconfont">'+player["player"].pokerArr[i].pic+'</span>';
			$(e).attr("cid",i).addClass("showPoker").find(".card-positive").removeClass().addClass("card-positive").addClass(player["player"].pokerArr[i].color).html(str);
		});
		$("#score .s").html(setting["userList"][setting["config"]["userName"]]["money"]);
	}

	function showOnePoker(obj,poker){
		console.log(poker)
		obj.addClass("showPoker").find(".card-positive").removeClass().addClass("card-positive").addClass(poker.color).html('<span class="num">'+poker.cards+'</span><span class="iconfont">'+poker.pic+'</span>');
	}

	function getScoreString(obj,num){
		if(num<0){
			obj.html(obj.html()+""+num);
		}else{
			obj.html(obj.html()+"+"+num);
		}
		
	}
	
	function setOtherPlayerInfo(){
		var ind = 1;
		var selfName = setting["config"]["userName"];
		setting["userList"][setting["config"]["userName"]]["otherDOMId"] = {};
		setting["userList"][setting["config"]["userName"]]["otherDOMId"][selfName] = ["#score .s","#self"];
		for(var a in setting["userList"]){
			if(a!=setting["config"]["userName"]){
				setting["userList"][setting["config"]["userName"]]["otherDOMId"][a] = ["#player"+ind+" .score .s","#player"+ind];

				if(setting["userList"][a]["playerType"]=="computer"){
					$("#player"+ind).find(".userinfo .iconfont1").html("&#xe609;");
				}else{
					$("#player"+ind).find(".userinfo .iconfont1").html("&#xe60a;");
				}
				$("#player"+ind).find(".userinfo .username .s").html(a);
				$("#player"+ind).find(".userinfo .score .s").html(setting["userList"][a]["money"]);
				ind++;
			}
		}
		console.log(setting["userList"][setting["config"]["userName"]]["otherDOMId"])
	}
	
	function showRes1(res1){
		showGroupPoker();
		if(res1["maxArr"]){
			showWin();
			showLose();
		}else{
			//没输赢
		}

		function showGroupPoker(){
			//明牌
			console.log(setting["userList"])
			for(var a in setting["userList"]){
				var DOMArr = setting["userList"][setting["config"]["userName"]]["otherDOMId"][a];
				var card = $(DOMArr[1]).find(".cards .card").eq(0);
				showOnePoker(card,setting["userList"][a]["player"]["pokerArr"][setting["userList"][a]["player"]["pokerCompare1"]]);
			}
		}
		
		function showWin(){
			for(var i=0;i<res1["maxArr"].length;i++){
				showCardRes(i);
			}
			function showCardRes(i){
				var name = res1["maxArr"][i]["playerName"];
				var DOMArr = setting["userList"][setting["config"]["userName"]]["otherDOMId"][name];
				var card = $(DOMArr[1]).find(".cards .card").eq(0);
				getScoreString($(DOMArr[0]),res1["moneyChange"][name]);
				setTimeout(function(){
					card.addClass("win");
				},700);
			}
		}
		function showLose(){
			for(var i=0;i<res1["minArr"].length;i++){
				showCardRes(i);
			}
			function showCardRes(i){
				var name = res1["minArr"][i]["playerName"];
				var DOMArr = setting["userList"][setting["config"]["userName"]]["otherDOMId"][name];
				var card = $(DOMArr[1]).find(".cards .card").eq(0);
				getScoreString($(DOMArr[0]),res1["moneyChange"][name]);
				setTimeout(function(){
					card.addClass("lose");
				},700);
			}
		}
		
	}

	function showRes2(res2){
		showGroupPoker();
		if(res2["maxArr"]){
			showWin();
			showLose();
		}else{
			//没输赢
		}
		function showGroupPoker(){
			//明牌
			for(var a in setting["userList"]){
				
				var DOMArr = setting["userList"][setting["config"]["userName"]]["otherDOMId"][a];
				var card1 = $(DOMArr[1]).find(".cards .card").eq(1);
				var card2 = $(DOMArr[1]).find(".cards .card").eq(2);
				showOnePoker(card1,setting["userList"][a]["player"]["pokerArr"][setting["userList"][a]["player"]["pokerCompare2"][0]]);
				showOnePoker(card2,setting["userList"][a]["player"]["pokerArr"][setting["userList"][a]["player"]["pokerCompare2"][1]]);
			}
		}
		function showWin(){
			for(var i=0;i<res2["maxArr"].length;i++){
				showCardRes(i);
			}
			function showCardRes(i){
				var name = res2["maxArr"][i][0]["playerName"];
				var DOMArr = setting["userList"][setting["config"]["userName"]]["otherDOMId"][name];
				var card1 = $(DOMArr[1]).find(".cards .card").eq(1);
				var card2 = $(DOMArr[1]).find(".cards .card").eq(2);
				getScoreString($(DOMArr[0]),res2["moneyChange"][name]);
				setTimeout(function(){
					card1.addClass("win");
					card2.addClass("win");
				},700);
			}
		}
		function showLose(){
			for(var i=0;i<res2["minArr"].length;i++){
				showCardRes(i);
			}
			function showCardRes(i){
				var name = res2["minArr"][i][0]["playerName"];
				var DOMArr = setting["userList"][setting["config"]["userName"]]["otherDOMId"][name];
				var card1 = $(DOMArr[1]).find(".cards .card").eq(1);
				var card2 = $(DOMArr[1]).find(".cards .card").eq(2);
				getScoreString($(DOMArr[0]),res2["moneyChange"][name]);
				setTimeout(function(){
					card1.addClass("lose");
					card2.addClass("lose");
				},700);
			}
		}
	}
	function showRes3(res3){
		showGroupPoker();
		console.log(res3)
		if(res3["maxArr"]){
			showWin();
			showLose();
		}else{
			//没输赢
		}

		function showGroupPoker(){
			//明牌
			for(var a in setting["userList"]){
				var DOMArr = setting["userList"][setting["config"]["userName"]]["otherDOMId"][a];
				var card1 = $(DOMArr[1]).find(".cards .card").eq(3);
				var card2 = $(DOMArr[1]).find(".cards .card").eq(4);
				var card3 = $(DOMArr[1]).find(".cards .card").eq(5);
				showOnePoker(card1,setting["userList"][a]["player"]["pokerArr"][setting["userList"][a]["player"]["pokerCompare3"][0]]);
				showOnePoker(card2,setting["userList"][a]["player"]["pokerArr"][setting["userList"][a]["player"]["pokerCompare3"][1]]);
				showOnePoker(card3,setting["userList"][a]["player"]["pokerArr"][setting["userList"][a]["player"]["pokerCompare3"][2]]);
			}
		}
		function showWin(){
			for(var i=0;i<res3["maxArr"].length;i++){
				(function(i){
					var name = res3["maxArr"][i]["arr"][0]["playerName"];
					var DOMArr = setting["userList"][setting["config"]["userName"]]["otherDOMId"][name];
					var card1 = $(DOMArr[1]).find(".cards .card").eq(3);
					var card2 = $(DOMArr[1]).find(".cards .card").eq(4);
					var card3 = $(DOMArr[1]).find(".cards .card").eq(5);
					for(var i=0;i<res3["moneyChange"][name].length;i++){
						getScoreString($(DOMArr[0]),res3["moneyChange"][name][i]);
					}
					
					setTimeout(function(){
						card1.addClass("win");
						card2.addClass("win");
						card3.addClass("win");
					},700)
				})(i);
			}
		}
		function showLose(){
			for(var i=0;i<res3["minArr"].length;i++){
				(function(i){
					var name = res3["minArr"][i]["arr"][0]["playerName"];
					var DOMArr = setting["userList"][setting["config"]["userName"]]["otherDOMId"][name];
					var card1 = $(DOMArr[1]).find(".cards .card").eq(3);
					var card2 = $(DOMArr[1]).find(".cards .card").eq(4);
					var card3 = $(DOMArr[1]).find(".cards .card").eq(5);
					for(var i=0;i<res3["moneyChange"][name].length;i++){
						getScoreString($(DOMArr[0]),res3["moneyChange"][name][i]);
					}
					setTimeout(function(){
						card1.addClass("lose");
						card2.addClass("lose");
						card3.addClass("lose");
					},700)
				})(i);
			}
		}
	}
	
 });