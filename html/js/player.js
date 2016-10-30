var allPlayer = [];//所有玩家(和电脑)

function Player(){
	this.id;
	this.name;
	this.money;//总金额
	this.pokerArr = [];//手牌
	this.pokerCompare1 = null;//设置第一次比较的牌
	this.pokerCompare2 = [];//设置第二次比较的牌
	this.pokerCompare3 = [];//设置第三次比较的牌
	this.winNum = 0;
}

Player.prototype.init = function(id,name,money){
	this.id = id;
	this.name = name;
	this.money = money;
	
};

Player.prototype.setPokerArr = function(arr){
	for(var i=0;i<arr.length;i++){
		this.pokerArr[i] = arr[i];
	}
};

Player.prototype.setPokerCompare1 = function(id){
	this.pokerCompare1 = id;
};
