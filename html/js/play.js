function play(){
	playerGetPoker();//获取纸牌

	//设置对手牌
	// for(var i=1;i<allPlayer.length;i++){
	// 	autoSetCompare(allPlayer[i]);
	// }
	
	//设置自己牌
	setting.selfPlayer = allPlayer[0];
	setMyPoker();

}

function playerGetPoker(){
	//每个玩家获得牌组
	var temporaryArr = allPoker.concat();
	for(var i=0;i<allPlayer.length;i++){
		var arr = [];
		for(var j=0;j<6;j++){
			arr[j] = getOnePoker(temporaryArr,allPlayer[i].id);
		}
		allPlayer[i].setPokerArr(arr);
	}
	
}

function createPlayer(size,money){
	for(var i=0;i<size;i++){
		allPlayer[i] = new Player();
		allPlayer[i].init(i,"",money);
	}
	// $(".body .money").html(money);
	
}

function getOnePoker(arr,playerId){
	//获取一张牌
	var ind = parseInt(Math.random()*(arr.length-1));
	var thisArr = arr.splice(ind,1)[0];
	var poker = new Poker();
	poker.init(thisArr);
	poker.setPlayerId(playerId);
	return poker;
}

function setMyPoker(){
	//显示手牌
	$("#toget-cards .card").each(function(i,e){
		$(e).attr("cid",setting.selfPlayer.pokerArr[i].id).html('<div class="card-positive '+setting.selfPlayer.pokerArr[i].color+'"><span class="num">'+setting.selfPlayer.pokerArr[i].cards+'</span><span class="iconfont">'+setting.selfPlayer.pokerArr[i].pic+'</span></div>');
	});
}