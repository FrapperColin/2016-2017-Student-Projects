/**
 * Created by Colin Frapper
 * 23/10/2016
 */

"use strict";

var MemoryContent = require("./MemoryContent");
var MemoryCard = require("./MemoryCard");

/**
 * Constructor
 * @param x
 * @param y
 * @param element
 * @constructor
 */
function MemoryGame(x, y, element)
{
  this.element = element;
  this.x = x;
  this.y = y;
  this.layout = new MemoryContent(this.x, this.y, element);
  this.board = []; // array for the game
  this.visibleCards = []; // array to get the visible card
  this.turns = 0; // the number of the turn
  this.correctCount = 0;
  this.imageList = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];
  this.images = this.imageList.slice(0, (this.y * this.x));
  this.clickFunc = this.click.bind(this);

  //shuffle and add eventlisteners
  this.shuffle();
  this.addEvents();
}

/**
 * Init the game
 */
MemoryGame.prototype.start = function()
{
  var i = 0;


  this.board = []; //init the empty board-array
  if (this.x > this.y)
  {
    for (i = 0; i < this.x; i += 1) // create the dimension of array
    {
      this.board.push(new Array(this.y));
    }
  }
  else
  {
    for (i = 0; i < this.y; i += 1) // create the dimension of array
    {
      this.board.push(new Array(this.x));
    }
  }

  this.visibleCards = [];

  for (i = 0; i < this.y; i += 1)   //push new cards to the board-array
  {
    for (var j = 0; j < this.x - 1; j += 2)
    {
      this.board[i][j] = new MemoryCard("" + i + j, this.images.pop()); // create the cards
      this.board[i][j + 1] = new MemoryCard("" + i + (j + 1), this.images.pop()); // create the cards
    }
  }
};

/**
 * Function to shuffle the images-array
 */
MemoryGame.prototype.shuffle = function()
{
  var temp;
  var rand;
  for (var i = 0; i < this.images.length; i += 1)
  {
    temp = this.images[i];
    rand = Math.floor(Math.random() * this.images.length);
    this.images[i] = this.images[rand];
    this.images[rand] = temp;
  }
};


/**
 * Function to add the events needed
 */
MemoryGame.prototype.addEvents = function()
{
  this.element.addEventListener("click", this.clickFunc);
};

/**
 * Function to remove the events
 */
MemoryGame.prototype.removeEvents = function()
{
  this.element.removeEventListener("click", this.clickFunc);
};

/**
 * Function to handle the clicks
 * @param event - the click-event
 */
MemoryGame.prototype.click = function(event)
{
  this.turnCard(event.target);
};

/**
 * Function to turn the given carde
 * @param element - the card to turn
 */
MemoryGame.prototype.turnCard = function(element)
{
  if (this.visibleCards.length < 2 && !element.classList.contains("disable")) // if we didn't turned 2 cards and the card not already turned
  {
    if (element.classList.contains("card"))
    {
      var yx = element.classList[0].split("-")[1];
      var y = yx.charAt(0);
      var x = yx.charAt(1);


      element.classList.add("img-" + this.board[y][x].img_number); //add classes to show the card
      element.classList.add("img");

      this.visibleCards.push(this.board[y][x]);

      //disable the card that got clicked
      this.element.querySelector(".card-" + this.board[y][x].id).classList.add("disable");

      if (this.visibleCards.length === 2)
      {
        this.checkCorrect(); // check if it's the same cards
      }
    }
  }
};

/**
* Function to check if the pair is the same
*/
MemoryGame.prototype.checkCorrect = function()
{
  this.turns += 1;
  if (this.visibleCards[0].img_number === this.visibleCards[1].img_number)
  {
    //it was the same image, show it to the user
    this.element.querySelector(".card-" + this.visibleCards[0].id).classList.add("show"); // right
    this.element.querySelector(".card-" + this.visibleCards[1].id).classList.add("show"); // right

    //reset the visible-cards array
    this.visibleCards = [];

    this.correctCount += 1;

    if (this.correctCount === (this.x * this.y / 2))
    {
      //the game is over since the correctcount is the amount of cards
      this.gameOver();
    }
  }
  else
  {
    //it was not correct, set the classes
    for (var i = 0; i < this.visibleCards.length; i += 1)
    {
      this.element.querySelector(".card-" + this.visibleCards[i].id).classList.add("wrong");
      this.element.querySelector(".card-" + this.visibleCards[i].id).classList.remove("disable");
    }

    //turn back the cards
    setTimeout(this.turnBackCards.bind(this), 1000);
  }
};

/**
 * Function to turn back cards when wrong
 */
MemoryGame.prototype.turnBackCards = function()
{
  var tempCard;
  for (var i = 0; i < this.visibleCards.length; i += 1)
  {
    tempCard = this.visibleCards[i];
    this.element.querySelector(".card-" + tempCard.id).classList.remove("wrong", "img", "img-" + tempCard.img_number);
  }

  this.visibleCards = [];
};

/**
 * Function to show the game over
 */
MemoryGame.prototype.gameOver = function()
{
  var template = document.querySelector("#template_memory_gameover").content.cloneNode(true);
  template.querySelector(".memory_turns").appendChild(document.createTextNode(this.turns));
  this.element.appendChild(template);
};

module.exports = MemoryGame;