var compareMode = require('./compare');

/*
 * spade 黑桃
 * heart 红桃
 * club 梅花
 * diamond 方块
 * 
 * */
var allPoker = [
	[1,"A","spade",14,1],
	[2,"2","spade",2,2],
	[3,"3","spade",3,3],
	[4,"4","spade",4,4],
	[5,"5","spade",5,5],
	[6,"6","spade",6,6],
	[7,"7","spade",7,7],
	[8,"8","spade",8,8],
	[9,"9","spade",9,9],
	[10,"10","spade",10,10],
	[11,"J","spade",11,0.5],
	[12,"Q","spade",12,0.5],
	[13,"K","spade",13,0.5],
	[14,"A","heart",14,1],
	[15,"2","heart",2,2],
	[16,"3","heart",3,3],
	[17,"4","heart",4,4],
	[18,"5","heart",5,5],
	[19,"6","heart",6,6],
	[20,"7","heart",7,7],
	[21,"8","heart",8,8],
	[22,"9","heart",9,9],
	[23,"10","heart",10,10],
	[24,"J","heart",11,0.5],
	[25,"Q","heart",12,0.5],
	[26,"K","heart",13,0.5],
	[27,"A","club",14,1],
	[28,"2","club",2,2],
	[29,"3","club",3,3],
	[30,"4","club",4,4],
	[31,"5","club",5,5],
	[32,"6","club",6,6],
	[33,"7","club",7,7],
	[34,"8","club",8,8],
	[35,"9","club",9,9],
	[36,"10","club",10,10],
	[37,"J","club",11,0.5],
	[38,"Q","club",12,0.5],
	[39,"K","club",13,0.5],
	[40,"A","diamond",14,1],
	[41,"2","diamond",2,2],
	[42,"3","diamond",3,3],
	[43,"4","diamond",4,4],
	[44,"5","diamond",5,5],
	[45,"6","diamond",6,6],
	[46,"7","diamond",7,7],
	[47,"8","diamond",8,8],
	[48,"9","diamond",9,9],
	[49,"10","diamond",10,10],
	[50,"J","diamond",11,0.5],
	[51,"Q","diamond",12,0.5],
	[52,"K","diamond",13,0.5]
];
var tmpPoker = [];//每局重新洗的牌
var pokerType = {
	diamond : "&#xe603;",
	club : "&#xe604;",
	heart : "&#xe61f;",
	spade : "&#xe61e;"
}
//牌图案


function Poker(){
	this.id;//扑克牌唯一标示
	this.cards;//牌面
	this.color;//花色
	this.num;//数值（1-14，用于第一次比牌）
	this.num2;//数值2（0.5-10，用于第二次比牌）
	this.pic;//显示图案
}

Poker.prototype.init = function(arr){
	this.id = arr[0];
	this.cards = arr[1];
	this.color = arr[2];
	this.num = arr[3];
	this.num2 = arr[4];
	this.playerName = null;
	this.pic = pokerType[arr[2]];
};

Poker.prototype.setPlayerName = function(playerName){
	this.playerName = playerName;
}




function play(room){
	playerGetPoker(room);//获取纸牌

}


function playerGetPoker(room){
	//每个玩家获得牌组
	var temporaryArr = allPoker.concat();
	for(var user in room["users"]){
		var arr = [];
		for(var i=0;i<6;i++){
			arr[i] = getOnePoker(temporaryArr,user);
		}
		room["users"][user]["player"]["pokerArr"] = arr;

		console.log("-------")
		
		//电脑AI设置牌
		if(room["users"][user]["playerType"]=="computer"){
			//compareMode.computerPlayerAI(room["users"][user]);
			room["users"][user]["userState"] = "beginPlay";
			room["users"][user]["player"]["pokerCompare1"] = 0;
			room["users"][user]["player"]["pokerCompare2"] = [1,2];
			room["users"][user]["player"]["pokerCompare3"] = [3,4,5];
		}
		

	}
	
}

function createPlayer(room){
	
	for(var user in room["users"]){
		room["users"][user]["player"] = {
			"pokerArr" : null,
			"pokerCompare1" : null,
			"pokerCompare2" : [],
			"pokerCompare3" : [],
			"winNum" : 0
		}
	}
	
}

function getOnePoker(arr,playerName){
	//获取一张牌
	var ind = parseInt(Math.random()*(arr.length-1));
	var thisArr = arr.splice(ind,1)[0];
	var poker = new Poker();
	poker.init(thisArr);
	poker.setPlayerName(playerName);
	return poker;
}


exports.createPlayer = createPlayer;
exports.play = play;
