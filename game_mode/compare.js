function showCompare(users,univalent){
	//展示第一轮
	var res = {};
	
	res["res1"] = showCompare1(users,univalent);
	res["res2"] = showCompare2(users,univalent);
	res["res3"] = showCompare3(users,univalent);
	
	return res;
}

function showCompare1(users,univalent){
	//展示第一轮
	var arr = [];
	for(var a in users){
		arr.push(users[a]["player"]["pokerArr"][users[a]["player"]["pokerCompare1"]]);
	}
	
	return getCompare1Results(arr,users,univalent);
}

function getCompare1Results(arr,users,univalent){
	var minArr = [];
	var minNum = 20;
	var maxNum = 0;
	var maxArr = [];
	var resJSON = {};
	
	getMinAndMin();
	getMaxAndMin();
	function getMinAndMin(){
		for(var i=0;i<arr.length;i++){
			if(arr[i].num<minNum){
				minNum = arr[i].num;
				minArr = [];
				minArr.push(arr[i]);
			}else if(arr[i].num==minNum){
				minArr.push(arr[i]);
			}
		}
		
	}
	
	function getMaxAndMin(){
		for(var i=0;i<arr.length;i++){
			if(arr[i].num>maxNum){
				maxNum = arr[i].num;
				maxArr = [];
				maxArr.push(arr[i]);
			}else if(arr[i].num==maxNum){
				maxArr.push(arr[i]);
			}
		}
		
	}

	if(maxNum!=minNum){
		//最大最小不同，有输赢家
		resJSON["minArr"] = minArr;
		resJSON["maxArr"] = maxArr;
		resJSON["moneyChange"] = {};
		
		for(var a in users){
			resJSON["moneyChange"][a] = [];
		}
		console.log(maxArr)
		for(var i=0;i<minArr.length;i++){
			resJSON["moneyChange"][minArr[i]["playerName"]].push(-1*univalent*maxArr.length);
			users[minArr[i]["playerName"]]["money"] = users[minArr[i]["playerName"]]["money"]+(-1*univalent*maxArr.length);
		}	
		for(var i=0;i<maxArr.length;i++){
			resJSON["moneyChange"][maxArr[i]["playerName"]].push(univalent*minArr.length);
			users[maxArr[i]["playerName"]]["money"] = users[maxArr[i]["playerName"]]["money"]+(univalent*minArr.length);
			users[maxArr[i]["playerName"]]["player"]["winNum"]++;
		}		
		
	}else{
		//所有牌都一样大，平局
		resJSON["minArr"] = null;
		resJSON["maxArr"] = null;
		
	}

	return resJSON;
	
}

function showCompare2(users,univalent){
	//展示第一轮
	console.log("s2---------")
	console.log(users)
	var arr = [];
	for(var a in users){
		console.log(users[a])
		console.log(users[a]["player"])
		arr.push([users[a]["player"]["pokerArr"][users[a]["player"]["pokerCompare2"][0]],users[a]["player"]["pokerArr"][users[a]["player"]["pokerCompare2"][1]]]);
	}
	
	return getCompare2Results(arr,users,univalent);
}

function getCompare2Results(arr,users,univalent){
	var minArr = [];
	var minNum = 20;
	var maxNum = 0;
	var maxArr = [];
	var resJSON = {};

	getMinAndMin();
	getMaxAndMin();
	function getMinAndMin(){
		for(var i=0;i<arr.length;i++){
			var n = arr[i][0].num2+arr[i][1].num2;
			if(n>10.5){
				if(minNum<0){
					minArr.push(arr[i]);
				}else{
					minNum = -1;
					minArr = [];
					minArr.push(arr[i]);
				}
				
			}else if(n<minNum){
				minNum = n;
				minArr = [];
				minArr.push(arr[i]);
			}else if(n==minNum){
				minArr.push(arr[i]);
			}
			
		}
	}
	function getMaxAndMin(){
		for(var i=0;i<arr.length;i++){
			var n = arr[i][0].num2+arr[i][1].num2;
			if(n>10.5){
				
			}else if(n==10.5){
				if(maxNum==10.5){
					maxArr.push(arr[i]);
				}else{
					maxNum = 10.5;
					maxArr = [];
					maxArr.push(arr[i]);
				}
			}else if(n>maxNum){
				maxNum = n;
				maxArr = [];
				maxArr.push(arr[i]);
				
			}else if(n==maxNum){
				maxArr.push(arr[i]);
			}
		}
		
		if(maxArr.length==0){
			maxNum = -1;
		}
		
	}
	
	if(maxNum!=minNum){
		//最大最小不同，有输赢家

		resJSON["minArr"] = minArr;
		resJSON["maxArr"] = maxArr;
		resJSON["moneyChange"] = {};
		for(var a in users){
			resJSON["moneyChange"][a] = [];
		}
		for(var i=0;i<minArr.length;i++){
			resJSON["moneyChange"][minArr[i][0]["playerName"]].push(-2*univalent*maxArr.length);
			users[minArr[i][0]["playerName"]]["money"] = users[minArr[i][0]["playerName"]]["money"]+(-2*univalent*maxArr.length);
		}	
		for(var i=0;i<maxArr.length;i++){
			resJSON["moneyChange"][maxArr[i][0]["playerName"]].push(2*univalent*minArr.length);
			users[maxArr[i][0]["playerName"]]["money"] = users[maxArr[i][0]["playerName"]]["money"]+(2*univalent*minArr.length);
			console.log("-1-1-1-1-1-1-")
			console.log(maxArr[i])
			console.log(maxArr[i][0])
			console.log("-1-1-1-1-1-1-")
			users[maxArr[i][0]["playerName"]]["player"]["winNum"]++;
		}	

	}else{
		//所有牌都一样大小，平局
		
		resJSON["minArr"] = null;
		resJSON["maxArr"] = null;
		
	}

	return resJSON;

}


function showCompare3(users,univalent){
	//展示第三轮

	var arr = [];
	for(var a in users){
		arr.push([users[a]["player"]["pokerArr"][users[a]["player"]["pokerCompare3"][0]],users[a]["player"]["pokerArr"][users[a]["player"]["pokerCompare3"][1]],users[a]["player"]["pokerArr"][users[a]["player"]["pokerCompare3"][2]]]);
	}
	
	return getCompare3Results(arr,users,univalent);
	
}

function getCompare3Results(arr,users,univalent){
	var resulitArr = [];
	var resJSON = {};
	var specialType = {
		"hasPlane" : null,
		"hasBat" : null
	}
	
	for(var i=0;i<arr.length;i++){
		resulitArr.push(getC3OneRes(arr[i],specialType));
	}
	
	
	var winRes = getC3WinRes(resulitArr,0);
	var loseRes = getC3LoseRes(resulitArr,0);

	resJSON["minArr"] = loseRes;
	resJSON["maxArr"] = winRes;
	resJSON["moneyChange"] = {};
	
	for(var a in users){
		resJSON["moneyChange"][a] = [];
	}

	for(var i=0;i<loseRes.length;i++){
		//for(var j=0;j<loseRes[i]["arr"].length;j++){
			resJSON["moneyChange"][loseRes[i]["arr"][0]["playerName"]].push(-3*univalent*winRes.length);
			users[loseRes[i]["arr"][0]["playerName"]]["money"] = users[loseRes[i]["arr"][0]["playerName"]]["money"]+(-3*univalent*winRes.length);
		//}
	}
	for(var i=0;i<winRes.length;i++){
		//for(var j=0;j<winRes[i]["arr"].length;j++){
			resJSON["moneyChange"][winRes[i]["arr"][0]["playerName"]].push(3*univalent*loseRes.length);
			users[winRes[i]["arr"][0]["playerName"]]["money"] = users[winRes[i]["arr"][0]["playerName"]]["money"]+(3*univalent*loseRes.length);
			console.log("winRes：")
			console.log(winRes)
			console.log(users[winRes[i]["arr"][0]["playerName"]]["player"]["winNum"])
			console.log("winRes：")
			users[winRes[i]["arr"][0]["playerName"]]["player"]["winNum"]++;
		//}
	}
	
	
	if(specialType["hasPlane"]){
		planeTax(users,loseRes,winRes,resJSON,univalent);
	}else if(specialType["hasBat"]){
		batTax(users,loseRes,winRes,resJSON,univalent);
	}
	
	allWinTax(users,resJSON,univalent);

	return resJSON;
}

function getC3OneRes(arr,specialType){
	
	var pokerObj;
	//获得一个玩家第三组牌的结果
	if(isPlane(arr)){
		//飞机,豹子
		specialType["hasPlane"] = true;
		pokerObj = {
			"resType":[99],
			"arr" : arr
		};
		pokerObj["resType"] = pokerObj["resType"].concat(getOnePokerArrMax(arr))
		
	}else if(isBoat(arr)&&isConnect(arr)){
		//清连,顺金
		specialType["hasBat"] = true;
		pokerObj = {
			"resType":[98],
			"arr" : arr
		};
		pokerObj["resType"] = pokerObj["resType"].concat(getOnePokerArrMax(arr))
		
	}else if(isBoat(arr)){
		//清色,金花

		pokerObj = {
			"resType":[97],
			"arr" : arr
		};
		pokerObj["resType"] = pokerObj["resType"].concat(getOnePokerArrMax(arr))
		
	}else if(isConnect(arr)){
		//顺子

		pokerObj = {
			"resType":[96],
			"arr" : arr
		};
		
		pokerObj["resType"] = pokerObj["resType"].concat(getOnePokerArrMax(arr))
		
	}else if(isCouple(arr)){
		//对子

		pokerObj = {
			"resType":[95],
			"arr" : arr
		};
		pokerObj["resType"] = pokerObj["resType"].concat(getOnePokerArrMaxForCouple(arr))

	}else{
		//单张
		
		var pokerObj = {
			"resType":[94],
			"arr" : arr
		};
		pokerObj["resType"] = pokerObj["resType"].concat(getOnePokerArrMax(arr))
		
	}
	
	return pokerObj;
}

function getC3WinRes(resulitArr,ind){
	//根据扎金花规则结果排出获胜
	if(ind>5){
		console.log("出错"+ind)
		return false;
	}
	var maxTypeNum = 0;
	var maxPokerArr = [];
	for(var i=0;i<resulitArr.length;i++){
		tmpNum = resulitArr[i]["resType"][ind];
		
		if(tmpNum>maxTypeNum){
			maxTypeNum = tmpNum;
			maxPokerArr = [];
			maxPokerArr.push(resulitArr[i]);
		}else if(maxTypeNum==tmpNum){
			maxPokerArr.push(resulitArr[i]);
		}
		
		
	}

	if(maxPokerArr.length==1){
		return maxPokerArr;
	}else{
		return getC3WinRes(maxPokerArr,(ind+1));
	}
	
}

function getC3LoseRes(resulitArr,ind){
	//根据扎金花规则结果排出失败
	if(ind>5){
		console.log("出错")
		return false;
	}
	var maxTypeNum = 99;
	var maxPokerArr = [];
	for(var i=0;i<resulitArr.length;i++){
		tmpNum = resulitArr[i]["resType"][ind];
		if(tmpNum<maxTypeNum){
			maxTypeNum = tmpNum;
			maxPokerArr = [];
			maxPokerArr.push(resulitArr[i]);
		}else if(maxTypeNum==tmpNum){
			maxPokerArr.push(resulitArr[i]);
		}
		
	}
	
	if(maxPokerArr.length==1){
		return maxPokerArr;
	}else{
		return getC3LoseRes(maxPokerArr,(ind+1));
	}
	
}

function getOnePokerArrMaxForCouple(pokerArr){
	var resArr = [];
	if(pokerArr[0].num==pokerArr[2].num){
		resArr.push(pokerArr[0].num);
		resArr.push(pokerArr[2].num);
		resArr.push(pokerArr[1].num);
	}else if(pokerArr[1].num==pokerArr[2].num){
		resArr.push(pokerArr[1].num);
		resArr.push(pokerArr[2].num);
		resArr.push(pokerArr[0].num);
	}else{
		resArr.push(pokerArr[0].num);
		resArr.push(pokerArr[1].num);
		resArr.push(pokerArr[2].num);
	}

	return resArr;
}

function getOnePokerArrMax(pokerArr){
	//按num从大到小排序
	var sortArr = [];
	for(var i=0;i<pokerArr.length;i++){
		sortArr.push(pokerArr[i].num);
	}
	
	sortArr.sort(function(a,b){return a<b?1:-1});

	return sortArr;
}

function planeTax(users,loseArr,winArr,resJSON,univalent){
	//飞机税
	console.log("飞机")
	for(var i=0;i<loseArr.length;i++){
		if(loseArr[i]["resType"][0]!=99){
			resJSON["moneyChange"][loseArr[i]["arr"][0]["playerName"]].push(-3*univalent);
			users[loseArr[i]["arr"][0]["playerName"]]["money"] = users[loseArr[i]["arr"][0]["playerName"]]["money"]+(-3*univalent);
		}
	}
	for(var i=0;i<winArr.length;i++){
		if(winArr[i]["resType"][0]==99){
			resJSON["moneyChange"][winArr[i]["arr"][0]["playerName"]].push(3*univalent);
			users[winArr[i]["arr"][0]["playerName"]]["money"] = users[winArr[i]["arr"][0]["playerName"]]["money"]+(3*univalent);
		}
	}
	
}

function batTax(users,loseArr,winArr,resJSON,univalent){
	//顺清税
	console.log("顺清")
	for(var i=0;i<loseArr.length;i++){
		if(loseArr[i]["resType"][0]!=98){
			resJSON["moneyChange"][loseArr[i]["arr"][0]["playerName"]].push(-1*univalent);
			users[loseArr[i]["arr"][0]["playerName"]]["money"] = users[loseArr[i]["arr"][0]["playerName"]]["money"]+(-1*univalent);
		}
	}
	for(var i=0;i<winArr.length;i++){
		if(winArr[i]["resType"][0]==98){
			resJSON["moneyChange"][winArr[i]["arr"][0]["playerName"]].push(univalent);
			users[winArr[i]["arr"][0]["playerName"]]["money"] = users[winArr[i]["arr"][0]["playerName"]]["money"]+univalent;
		}
	}
	
}

function allWinTax(users,resJSON,univalent){
	//全胜税
	// for(var a in users){
	// 	if(users[a]["player"]["winNum"]==3){
	// 		console.log(users[a]["player"]["winNum"])
	// 		for(var attr in users){
	// 			if(users[attr]["player"]["winNum"]!=3){
	// 				resJSON["moneyChange"][attr].push(-3*univalent);
	// 				resJSON["moneyChange"][a].push(3*univalent);
	// 				console.log("全胜")
	// 				console.log(resJSON)
	// 				console.log(resJSON["moneyChange"][attr])
	// 				console.log(resJSON["moneyChange"][a])
	// 				console.log("全胜--")
					
	// 			}
	// 		}
	// 	}
	// }
	
}

function isPlane(pokerArr){
	//判断有没有飞机
	for(var i=0;i<pokerArr.length;i++){
		var tmp = pokerArr[i].cards;
		var tmpIndArr = [pokerArr[i]];
		var num = 1;

		for(var j=0;j<pokerArr.length;j++){
			if(i!==j){
				if(tmp==pokerArr[j].cards){
					num++;
					tmpIndArr.push(pokerArr[j]);
					if(num>=3){
						
						return tmpIndArr;
					}
				}
			}
		}
	}
	return false;
}

function isBoat(pokerArr){
	//判断有没有同色
	for(var i=0;i<pokerArr.length;i++){
		var tmp = pokerArr[i].color;
		var tmpIndArr = [pokerArr[i]];
		var num = 1;
		for(var j=0;j<pokerArr.length;j++){
			if(i!==j){
				if(tmp==pokerArr[j].color){
					num++;
					tmpIndArr.push(pokerArr[j]);
					if(num>=3){
						
						return tmpIndArr;
					}
				}
			}
		}
	}
	return false;
}

function isConnect(pokerArr){
	//判断有没有顺子
	var tmpNumArr = [];
	for(var i=0;i<pokerArr.length;i++){
		tmpNumArr.push(pokerArr[i].num);
	}
	var arr2 = tmpNumArr.sort(function(a,b){return a>b?1:-1});
	if((arr2[0]+1)==arr2[1]&&arr2[1]==(arr2[2]-1)){
		return true;
	}else if((arr2[0]+1)==arr2[1]&&arr2[2]==14&&arr2[0]==2){
		//A,2,3
		console.log((arr2))
		return true;
	}
	
	return false;
}

function isCouple(pokerArr){
	//对子
	
	for(var i=0;i<3;i++){
		var tmpPokerNum = pokerArr[i].num;
		for(var j=0;j<3;j++){
			var tmpPokerNum2 = pokerArr[j].num;
			if(i!=j&&tmpPokerNum==tmpPokerNum2){
				return true;
			}
		}
	}
	
	return false;
}

function computerPlayerAI(user){
	var arr = [];//牌对象数组
	user["player"]["pokerArr"]
	
}

function getMaxPokerRes(arr){
	var maxPokerRes = {
		"resType" : null,
		"resArr" : [],
		"otherArr" : []
	};
	if(AI_isPlane(arr)){
		//飞机,豹子
		return maxPoker[""]
	}else if(AI_isBoat(arr)&&AI_isConnect(arr)){
		//清连,顺金
		
	}else if(AI_isBoat(arr)){
		//清色,金花

	}else if(AI_isConnect(arr)){
		//顺子

	}else if(AI_isCouple(arr)){
		//对子

	}else{
		//单张
				
	}
}

function AI_isPlane(pokerArr){
	//AI_判断有没有飞机
	var pokers = {};
	var resPoker = {
		"has" : {
			"pokersArr" : [],
			"indArr" : []
		},
		"other" : {
			"pokersArr" : [],
			"indArr" : []
		}
	};
	var has = false;
	for(var i=0;i<pokerArr.length;i++){
		var tmp = pokerArr[i].cards;
		var tmpIndArr = [pokerArr[i]];
		if(pokers[tmp]){
			pokers[tmp]["num"]++;
			pokers[tmp]["indArr"].push(i);
			if(pokers[tmp]["num"]>=3){
				has = true;
				resPoker["has"]["indArr"] = pokers[tmp]["indArr"];
			}
		}else{
			pokers[tmp] = {
				"num" : 1,
				"indArr" : [i]
			};
		}
	}

	if(has){
		for(var i=0;i<pokerArr.length;i++){
			(function(i){
				for(var j=0;j<resPoker["has"]["indArr"].length;j++){
					if(i==resPoker["has"]["indArr"][j]){
						resPoker["has"]["pokersArr"].push(pokerArr[i]);
						return;
					}
				}
				resPoker["other"]["indArr"].push(i);
				resPoker["other"]["pokersArr"].push(pokerArr[i]);
			})(i);
		}
		console.log(resPoker)
		return resPoker;
	}else{
		return false;
	}
}

function AI_isBoat(pokerArr){
	//AI_判断有没有同色
	for(var i=0;i<pokerArr.length;i++){
		var tmp = pokerArr[i].color;
		var tmpIndArr = [pokerArr[i]];
		var num = 1;
		for(var j=0;j<pokerArr.length;j++){
			if(i!==j){
				if(tmp==pokerArr[j].color){
					num++;
					tmpIndArr.push(pokerArr[j]);
					if(num>=3){
						
						return tmpIndArr;
					}
				}
			}
		}
	}
	return false;
}

function AI_isConnect(pokerArr){
	//AI_判断有没有顺子
	var tmpNumArr = [];
	for(var i=0;i<pokerArr.length;i++){
		tmpNumArr.push(pokerArr[i].num);
	}
	var arr2 = tmpNumArr.sort(function(a,b){return a>b?1:-1});
	if((arr2[0]+1)==arr2[1]&&arr2[1]==(arr2[2]-1)){
		return true;
	}else if((arr2[0]+1)==arr2[1]&&arr2[2]==14&&arr2[0]==2){
		//A,2,3
		console.log((arr2))
		return true;
	}
	
	return false;
}

function AI_isCouple(pokerArr){
	//AI_对子
	
	for(var i=0;i<3;i++){
		var tmpPokerNum = pokerArr[i].num;
		for(var j=0;j<3;j++){
			var tmpPokerNum2 = pokerArr[j].num;
			if(i!=j&&tmpPokerNum==tmpPokerNum2){
				return true;
			}
		}
	}
	
	return false;
}


module.exports.showCompare = showCompare;
module.exports.isPlane = isPlane;
