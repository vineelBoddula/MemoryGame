var express = require('express');
var app = express();


var users = [];
var gameBoard =[];
app.set('port', (process.env.PORT || 5000));

app.use(express.static("./public")); 

app.use(function(req,res,next){
	console.log(req.method+" request for "+req.url);
	next();
});

app.get('/',function(req,res){
  res.sendFile('index.html');
  //It will find and locate index.html
});

app.get(["/memory/intro"],function(req,res){
	//process the request
	
	
	var username = req.query.username;
    console.log(username);
	var levelNum = 4; //default level at 4 
    gameBoard = makeBoard(levelNum);
    users[username] = {
		username: username,
		board: gameBoard,
		level: levelNum
	};
	res.send(users[username]);
});

app.get(["/memory/card"],function(req,res){
	//process the request
	console.log(req.method+" request for: "+req.url);
	var cardInfo = req.query;
    var loadBoard = users[cardInfo.username].board;
    console.log("the array value"+loadBoard);
    var cardValueRow = loadBoard[cardInfo.row];
    var cardValue = cardValueRow[cardInfo.column];
    console.log(cardValue);
    
	var returnValue ={
      value: cardValue
    }
	
	res.send(returnValue);
});

app.get(["/memory/restart"],function(req,res){
	
	var username = req.query.username;
    var levelNum = users[username].level;
    if(levelNum != 10){ 
      levelNum +=2;
    }
      
    gameBoard = makeBoard(levelNum);
      users[username] = {
        username: username,
        board: gameBoard,
        level: levelNum
      }
	
	res.send(users[username]);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
app.all("*",function(req,res){
	res.sendStatus(404);
});

function makeBoard(size){
	
	items = [];
	for(var i=0;i<(size*size)/2;i++){
		items.push(i);
		items.push(i);
	}
	board = [];
	for(var i=0;i<size;i++){
		board[i]=[]
		for(var j=0;j<size;j++){
			var r = (Math.floor(Math.random()*items.length));
			board[i][j]= items.splice(r,1)[0];  //remove item r from the array
			
		}
	}
	return board;
}


//app.listen(2406,function(){console.log("Server listening on port 2406");});
