 function ifClickedCard(event) {
		$target = $(event.target);
    revealTheCard($target);
    var checkArr =[];
    $('.flippedCard').each( function() {
        var isActive = $(this).data("active");
        if(isActive ==="yes"){ 
          checkArr.push($(this).text());
        }
      });
    
    if(checkArr.length == 2){ 
      totalNumOfGuess = totalNumOfGuess +1;
      console.log("WELLL THIS IS KK: "+totalNumOfGuess);
      $('.flippedCard').each( function() {
          var isActive = $(this).data("active");
          if(isActive ==="yes"){ 
            if(checkArr[0] == checkArr[1]){
              $(this).data("active","no");
            }else {
              $(this).text("");
              $(this).data("active","no");
              $(this).attr('class','card');
              
            }
           
          }
        
        });
    revealTheCard($target);
      
    }
    checkLevelDone();  
	}
  
function revealTheCard($target){ 
  targetClassName = $target.attr('class');
    if( targetClassName == "card"){
      console.log("_____________1");
      $.getJSON('/memory/card', {username:user,row:$target.data("row"),column: $target.data("column")},function(data){
        doAnimation($target);
        $target.attr('class', 'flippedCard');
        $target.append("<span>"+data.value+'</span>');
     
      });
    }
}

function checkLevelDone(){
  
  numOfCards = $('.flippedCard').length; 
  console.log("numOfcards: "+numOfCards);
    if (numOfCards == (currentLevel*currentLevel)){
      console.log("_____________________3");
      $gameBoard .empty();
      alert("You have guessed: "+totalNumOfGuess);
      if(confirm("would you like to increase the level") ==true){ 
        $.getJSON('/memory/restart', {username: user}, displayBoard);
      }else { 
        alert("Thank you for playing!!");
      }
      
    }
}