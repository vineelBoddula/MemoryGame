/*Author: Vineel Boddula 
 
*/
var user;
var totalNumOfGuess=0;
var currentLevel = 4;

$(document).ready(function(){
 /* user = prompt("What is your username: ");
  if(user === ""){ 
    user = "vineel"; //default name if user doesnt type 
  } else if(user == false){ 
    user ="vineel"; //if the user clicks cancel
  }*/
  user = "guest";
  
  $.getJSON('/memory/intro', {username: user}, displayBoard);
});
  
  //function displayBoard creates divs and adds it to the table
  //depending on the level it will create that man cards. Goes up
  //till 10x10. The parameter here is data. Data is what ever the server
  //is sending to the client. In this case username,board and level.
  //No return values
  function displayBoard(data){ 
    $gameBoard = $("#gameBoard");
    //using two for loops to create row first then add that row to the table  
    for(var i =0; i < data.board.length;i++){ 
      var $row = $("<tr>");//creating row
      for(var j=0; j < data.board[i].length;j++){
        $card = $('<div>').addClass('card');
        currentLevel = data.level;
        $card.attr("data-row",i);
        $card.attr("data-column",j);
        $card.attr("data-active","no");//is active, by default no
        $card.click(ifClickedCard)
        $row.append($card);
      }
    $gameBoard.append($row);      
    }
  }
  
//ifClickedCard function gets excuted when the card is clicked on
//parameter is the event. get the target of the event and revealTheCard
//check for match after then check if level is done.
//no return values.  
function ifClickedCard(event) {
		$target = $(event.target);
    revealTheCard($target);
    
      
}

//revealTheCard function has the target as a parameter
//it checks the div class name. if the class name is card then
//doAnimation then get the data from the server (card value of the index)
//then changed the class to flippedCard and create a span and add value.
//this function has no return values.
function revealTheCard($target){ 
  console.log("revealTheCard function");
  targetClassName = $target.attr('class');
    if( targetClassName == "card"){
        
      $.getJSON('/memory/card', {username:user,row:$target.data("row"),column: $target.data("column")},function(data){
        doAnimation($target);
        $target.attr('class', 'flippedCard');
        $target.data('active','yes');
        $target.append("<span>"+data.value+'</span>'); 
       
       var checkArr =[];
        $('.flippedCard').each( function() {
          var isActive = $(this).data("active");
          if(isActive ==="yes"){ 
            checkArr.push($(this).text());
          }
        });
        checkForMatch(checkArr,$target);
        checkLevelDone();
      });
      
    }
}

//checkForMatch takes in checkArr, if the checkArr length is 2 
//then increase the guessed counter. Check the loop of each div
//with class of flippedCard and see if the card isActive and if 
//the values of the active cards match. if they dont change the 
//class name back to card. Remove the text with it too.
//No return values for this function/
function checkForMatch(checkArr,$target){ 
  
  if(checkArr.length == 2){ 
      console.log("length is 2");
      totalNumOfGuess = totalNumOfGuess +1;
      console.log("WELLL THIS IS KK: "+checkArr);
    //loops through all the divs with this class name (.flippedCard)
    $('.flippedCard').each( function() {
          var isActive = $(this).data("active");
          //if active see if the values in the array match
          if(isActive ==="yes"){ 
            if(checkArr[0] == checkArr[1]){
              $(this).data("active","no");
            }else {
                //setting delay before flipping
                 setTimeout(function() {
                   
                   $('.flippedCard').each( function() {
                    var isActive = $(this).data("active");
                    if(isActive ==="yes"){
                     $(this).attr('class','card');
                     
                     $(this).data("active","no");
                     $(this).text("");
                    }
                 });
                }, 1000);
            }
          }
      });
      
  }
}  
//checkLevelDone function checks if the game is done by checking
//the length of the class (flippedCard). if the the length is equal
//to total number of cards in that level then alert the user total guessed
//and create a new board with same username   
//this function has no parameters and no return values
function checkLevelDone(){
  numOfCards = $('.flippedCard').length; 
  console.log("numOfcards: "+numOfCards);
    if (numOfCards == (currentLevel*currentLevel)){
      
      $gameBoard .empty();
      alert("You have guessed: "+totalNumOfGuess);
      //if the user clicks yes then 
      if(confirm("would you like to increase the level") ==true){ 
        $.getJSON('/memory/restart', {username: user}, displayBoard);
      }else { 
        alert("Thank you for playing!!");
      }
      
    }
}
//doAnimation takes in the div thats targeted and does animation(transform)
//no parameters and no return values  
function doAnimation($target){ 
    $target.data("active","yes");
    
    $target.animate({deg: 360}, {
      duration: 500,
      //now is the deg which is 360
      step: function(now){
        $(this).css({
             
			 transform: 'rotateX(' + now + 'deg)'
        });
      }
    });
	
    //doing the animation again to reset the deg value back to 0.
    $target.animate({deg: -360}, {
      duration: 1,
      step: function(now) {
        $(this).css({
            transform: 'rotateX(' + now + 'deg)'
        });
      }
    });
}
  
