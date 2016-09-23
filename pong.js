$(document).ready(function() {

  var c = document.getElementById("gameBoard");
  var ctx = c.getContext("2d");

  var MAXBOUNCEANGLE = 5*Math.PI/12;

  var paddle = function(x, y) {
    this.xPos = x;
    this.yPos = y;
    this.width = 20;
    this.height = 150;
    this.minY = 0;
    this.maxY = c.height - this.height;
    this.colour = "white";
    this.drawPaddle = drawPaddle;
    this.score = 0;
  };

  var ball = function() {
  	this.xPos = 640;
    this.yPos = 360;
    this.radius = 10;
    this.xV = -10;
    this.yV = 0;
    this.speed = 10;
    this.drawBall = drawBall;
    this.engine = engine;
  };

  var drawPaddle = function() {
    ctx.fillStyle = this.colour;
    //Collision detection with Canvas boundry
    if(this.yPos <= this.minY){
      ctx.fillRect(this.xPos,this.minY,this.width,this.height);
    }
    else if (this.yPos >= this.maxY) {
      ctx.fillRect(this.xPos,this.maxY,this.width,this.height);
    }
    else{
      ctx.fillRect(this.xPos,this.yPos,this.width,this.height);
    }
  };

  var drawBall = function(x,y) {
  	ctx.beginPath();
    ctx.arc(x||this.xPos,y||this.yPos,this.radius,0,2*Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.stroke();
  };

  var drawBoard = function() {
  	ctx.fillStyle = "black";
    ctx.fillRect(0,0,c.width,c.height);
  };

  function bounceAngle(paddleY, paddleHeight, ballY) {
    var relativeIntersectY = (paddleY+(paddleHeight/2)) - ballY;
    var normalizedRelativeIntersectionY = (relativeIntersectY/(paddleHeight/2));
    return normalizedRelativeIntersectionY * MAXBOUNCEANGLE;
  }

  var engine = function() {

    if(this.xPos - this.radius <= playerOne.xPos + playerOne.width && this.yPos >= playerOne.yPos && this.yPos <= playerOne.yPos+playerOne.height){

      this.speed += 2;
      var angle = bounceAngle(playerOne.yPos, playerOne.height, this.yPos);
      this.xV = this.speed*Math.cos(angle);
      this.yV = this.speed*-Math.sin(angle);
    }
    else if(this.xPos + this.radius >= playerTwo.xPos && this.yPos >= playerTwo.yPos && this.yPos <= playerTwo.yPos+playerTwo.height){
      this.speed += 2;
      var angle = bounceAngle(playerOne.yPos, playerOne.height, this.yPos);
      this.xV = -1*this.speed*Math.cos(angle);
      this.yV = this.speed*-Math.sin(angle);
    }
    else if(this.xPos - this.radius  <= playerOne.xPos + playerOne.width/2){
    	this.xV = 10;
      this.yV = 0;
      this.xPos = 640;
      this.yPos = 360;
      this.speed = 10;
      playerTwo.score += 1;
    }
    else if(this.xPos + this.radius >= playerTwo.xPos + playerTwo.width/2){
    	this.xV = -10;
      this.yV = 0;
      this.xPos = 640;
      this.yPos = 360;
      this.speed = 10;
      playerOne.score += 1;
    }
    else if (this.yPos - this.radius <= 0 || this.yPos + this.radius >= c.height) {
      this.yV *= -1;
    }
    //Update Position

    this.xPos = this.xPos + this.xV;
    this.yPos = this.yPos + this.yV;
  };

  function drawScore(scoreOne, scoreTwo){
    ctx.font="100px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(scoreOne + " - " + scoreTwo,c.width/2,100);
  }

  var main = function() {
    c.width = c.width; //clear canvas
    drawBoard();
    gameBall.drawBall();
    gameBall.engine();
    playerOne.drawPaddle();
    playerTwo.drawPaddle();
    drawScore(playerOne.score,playerTwo.score);
    window.requestAnimationFrame(main);
  };

  var playerOne = new paddle(30,285);
  var playerTwo = new paddle(c.width-50, 285);
	var gameBall = new ball();

  window.requestAnimationFrame(main);

  $("#gameBoard").mousemove(function(e) {
    playerOne.yPos = e.pageY-playerOne.height/2;
    playerTwo.yPos = e.pageY-playerTwo.height/2;
  });
});
