var express = require('express');
var app = require('express')();
var gameMode = require('./game_mode/play');
var compareMode = require('./game_mode/compare');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var univalent = 100;
var userList = {};//所有房间和对应的用户
var allRoomState = {};//对外公布的所有房间名字和人数
// userList = {
//     "roomName" : {
//         "roomState" : 0,
//         "usersNum" : 1,
//         "users" : {
//             "userName" : {
//                 "userState" : "ready",
//                 "playerType" : "computer",
//                 "money" : 3000,
//                 "player" : {}
//             }
//         }
//     }
// }

app.get('/', function(req, res){
  res.sendfile('html/index.html');
});

app.use(express.static('html'));

io.on('connection', function(socket){
    var userName = "用户名";
    var roomName = "房间名";
    console.log('有连接');
    //广播所有房间状态
    io.sockets.emit("allRoomState",allRoomState);
    

    socket.on("room", function(room){
        console.log("room:"+room)
        if(!userList[room]){
            userList[room] = {
                "roomState" : 0,
                "usersNum" : 0,
                "users" : {}
            };
            allRoomState[room] = {
                "usersNum" : 0,
                "roomState" : true
            }
        }else if(userList[room]["usersNum"]>=3){
            return false;
        }else{
            

        }
        if(userList[room]["roomState"]!=1){
            //允许加入
            roomName = room;
            userList[room]["roomState"] = 0;
            socket.join(room);

            allRoomState[room]["usersNum"]++;
            userList[roomName]["usersNum"]++;
            console.log("roomNum:"+allRoomState[room]["usersNum"])
            console.log("usersNum:"+userList[room]["usersNum"])
        }
        //广播房间状况
        io.sockets.emit("allRoomState",allRoomState);

        //发给当前用户
        socket.emit("roomState",{
            "state" : userList[room]["roomState"]
        });

    });
    socket.on("userList", function(J){
        //创建玩家
        userName = J["userName"];
        
        if(userList[roomName]["users"][userName]){
            //该玩家已存在
            socket.emit("userNameIpt",{
                type : false,
                txt : "该玩家已存在"
            });
        }else{
            userList[roomName]["users"][userName] = {
                "userState" : "join",
                "playerType" : "player",
                "money" : 3000,
                "player" : {}
            };
            io.in(roomName).emit("setUserList",userList[roomName]["users"]);
            socket.emit("userNameIpt",{
                type : true
            });
        }
        

    });
    socket.on("userReady", function(J){
        //玩家准备
        userList[roomName]["users"][userName]["userState"] = J["userReady"];
        if(isAllReady(userList[roomName]["users"],"ready")){
            //都准备完毕
            userList[roomName]["roomState"] = 1;
            allRoomState[roomName]["roomState"] = false;

            //判断加入电脑
            if(userList[roomName]["usersNum"]<3){
                for(var i=0;i<3-userList[roomName]["usersNum"];i++){
                    userList[roomName]["users"]["电脑"+(i+1)] = {
                        "userState" : "ready",
                        "playerType" : "computer",
                        "money" : 3000,
                        "player" : {}
                    };
                }
            }

            //开始游戏
            gameMode.createPlayer(userList[roomName]);
            gameMode.play(userList[roomName]);
            io.in(roomName).emit("allReady",userList[roomName]["users"]);

        }else{
            io.in(roomName).emit("setUserList",userList[roomName]["users"]);
        }
    });

    socket.on("restart", function(J){
        gameMode.play(userList[roomName]);
        io.in(roomName).emit("restart",userList[roomName]["users"]);
    });

    socket.on("beginPlay", function(J){
        //准备比牌
        userList[roomName]["users"][J["userName"]] = J["player"];
        
        if(isAllReady(userList[roomName]["users"],"beginPlay")){
            for(var a in userList[roomName]["users"]){
                userList[roomName]["users"][a]["userState"] = "ready";
            }
            //所有人准备完毕，开始比牌
            var res = compareMode.showCompare(userList[roomName]["users"],univalent);
           
            //更新到客户端
            io.in(roomName).emit("showCompare",userList[roomName]["users"]);
            io.in(roomName).emit("showCompareResults",res);
            
        }
       


    });

    socket.on('disconnect', function() {
        console.log(userName+"退出");
        console.log(roomName+"房间退出");
        if(userList[roomName]){
            //有人退出
            //&&userList[roomName]["users"]&&userList[roomName]["users"][userName]
            if(userList[roomName]["users"][userName]){
                //这个人退出
                console.log(userList[roomName]["users"][userName])
                //转换为AI
                // userList[roomName]["users"][userName]["playerType"] = "computer";
                // userList[roomName]["users"][userName]["userState"] = "beginPlay";
                // userList[roomName]["users"][userName]["player"]["pokerCompare1"] = 0;
                // userList[roomName]["users"][userName]["player"]["pokerCompare2"] = [1,2];
                // userList[roomName]["users"][userName]["player"]["pokerCompare3"] = [3,4,5];

                //有人退出暂处理成刷新
                if(userList[roomName]["roomState"]==1){
                    io.in(roomName).emit("refresh",{
                        "refreshMode" : 0
                    });
                }
                
                delete userList[roomName]["users"][userName];
            }
            
            userList[roomName]["usersNum"]--;
            allRoomState[roomName]["usersNum"]--;
            io.in(roomName).emit("userList",userList[roomName]["users"]);
            console.log("还剩下："+userList[roomName]["usersNum"])
            if(userList[roomName]["usersNum"]==0){
                //没人了，清空房间
                userList[roomName] = null;
                delete userList[roomName];
                delete allRoomState[roomName]
            }
        }

        //广播所有房间状态
        io.sockets.emit("allRoomState",allRoomState);
    });

    socket.on('error', function(error) {
        console.log(error)
    });

});

app.set('port', process.env.PORT || 3000);

var server = http.listen(app.get('port'), function() {
    console.log('start at port:' + server.address().port);
});

function isAllReady(J,STU){
    for(var a in J){
        if(J[a]["userState"]!=STU){
            return false;
        }
    }
    return true;
}
