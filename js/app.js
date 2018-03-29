// game window
const game = document.getElementById('game');
const score = document.getElementById('score');

// store the open cards in an array
let openCards = [];

// push all matched cards in an array
let matchedCards = [];

// Trophy items
const trophyOne = document.getElementById('trophy-one');
const trophyTwo = document.getElementById('trophy-two');
const trophyThree = document.getElementById('trophy-three');

const trophyOneEnd = document.getElementById('trophy-one-end');
const trophyTwoEnd = document.getElementById('trophy-two-end');
const trophyThreeEnd = document.getElementById('trophy-three-end');

// move counts
let move = document.getElementById('move');
let moves = 0;

// timing functions
let min = document.getElementById('min');
let sec = document.getElementById('sec');
let minutes;
let second;
let timerActive = false;
let timerTime = 0;
let seconds = 0;

//to create matching pairs we added 8 + 8 duplicated images
const cards = [
 'img/chick-hicks.png',
 'img/chick-hicks.png',
 'img/dee.png',
 'img/dee.png',
 'img/finn.png',
 'img/finn.png',
 'img/guido.png',
 'img/guido.png',
 'img/luigi.png',
 'img/luigi.png',
 'img/mcqueen.png',
 'img/mcqueen.png',
 'img/Sarge.png',
 'img/Sarge.png',
 'img/Sheriff.png',
 'img/Sheriff.png'
];

// store the shuffled cards in an array
let shuffledArray = [];

// get the card deck
let cardDeck = document.getElementById('card-deck');

// end game modal
let endgame = document.getElementById('end-game');

// all cards
let li = document.getElementsByClassName('deck_card');

// highscore old to check against score
let highscoreOld = 0;
let highscoreResult = 0;
// amount of points
let points = 0;



//starting the timer
function start() {
 if (timerActive) {
  return;
 }
 timerActive = true;
 seconds = setInterval(timer, 1000);
}

//@description timer function
 function timer() {
 timerTime++;
 min.innerText = add(Math.floor(timerTime / 60));
 sec.innerText = add(timerTime % 60);
 minutes = min.innerHTML;
 second = sec.innerHTML;
}

//if the timer is less than 10
function add(time) {
 if (time < 10) {
  //Adding a 0 to the timer 
  return `0${time}`;
 }
 return time;
}

//it shuffles the array with cards randomly
function shuffle(array) {
 let currentIndex = array.length,
  temporaryValue,
  randomIndex;

 while (currentIndex !== 0) {
  randomIndex = Math.floor(Math.random() * currentIndex);
  currentIndex -= 1;
  temporaryValue = array[currentIndex];
  array[currentIndex] = array[randomIndex];
  array[randomIndex] = temporaryValue;
 }
 return array;
}

//Starts the game
function startGame() {

 //Adding sound at the begging of the game
 document.getElementById("my_audio").play();

 // Gives it a little time before the game board and score board are shown
 setTimeout(function() {

  //Adding a class that shakes the game at the start 
  game.classList.add('shake');

  game.classList.add('game-show');
  score.classList.add('score-show');
 }, 500);



 // make sure that the moves are 0
 moves = 0;

 // setting innerText to moves
 move.innerText = moves;

 // store shuffled cards in temporary array
 shuffledArray = shuffle(cards);

 // loop over each card in the array
 for (let i = 0; i < shuffledArray.length; i++) {
  // create li
  let item = document.createElement('li');

  // create div
  let innerItem = document.createElement('div');

  // set class to li
  item.setAttribute('class', 'deck_card');

  // set id to li
  item.setAttribute('id', 'game-card');

  // add img to div as background
  innerItem.style = `background-image: url('${shuffledArray[i]}');`;

  // give each card an id the same as the img name
  innerItem.setAttribute('id', shuffledArray[i].substring(4, 8));

  // add class card to div
  innerItem.setAttribute('class', 'card');

  // add div to li
  item.appendChild(innerItem);

  // add li to ul card-deck
  cardDeck.appendChild(item);

  // add an event listener to the card
  item.addEventListener('click', click);
 }
}

//will pass click over to cardClicked used this to removeEventListener once the card is open
function click(e) {

 // start the timer
 start();
	
 // check if the target that is clicked is the li this because the li has a border if then return and do nothing
 if (e.target.tagName === 'LI') {
  return;
 } else if (e.target.tagName === 'DIV' && e.target.className === 'card') {
  // else if target is div with class card add the open class to the card
  e.target.parentNode.classList.add('deck_card-open');
 }
 // call card clicked
 cardClicked(e.target);
}

//will pass click over to cardClicked used this to removeEventListener once the card is open
function cardClicked(e) {

 // push the open card to a temp array
 openCards.push(e);

 // create temp array with all cards
 let cards = document.getElementsByClassName('deck_card');

 // if open cards array length is 1 remove the event listener from that card to prevent a double click
 if (openCards.length === 1) {
  openCards[0].parentNode.removeEventListener('click', click);
 } else if (openCards.length === 2) {
  // temporary remove all event listeners
  for (let i = 0; i < cards.length; i++) {
   cards[i].removeEventListener('click', click);
  }

  // add one to the moves
  moves = moves + 1;

  // update moves inner text
  move.innerText = moves;

  // call count trophies to update the scoreboard stars
  countTrophy(moves);

  // if the two open cards are a match
  if (openCards[0].id === openCards[1].id) {
   // remove the event listener from the second open card
   openCards[1].parentNode.removeEventListener('click', click);

   // add matched class with timeout to allow turn animation to finish
   setTimeout(function() {
    openCards[0].parentNode.classList.add('matched');
    openCards[1].parentNode.classList.add('matched');
    openCards = [];
   }, 500);

   // move cards to matched cards for the count
   matchedCards.push(openCards[0]);
   matchedCards.push(openCards[1]);

   // add the event listener back to the cards after 400ms and then check for a match in the matched cards array to remove the eventListener again from all cards in the matched array to prevent people from clicking the same pair untill they made 8 matches 
   for (let i = 0; i < cards.length; i++) {
    setTimeout(function() {
     cards[i].addEventListener('click', click);
    }, 400);
    setTimeout(function() {
     for (let j = 0; j < matchedCards.length; j++) {
      if (matchedCards[j].id === cards[i].firstChild.id) {
       cards[i].removeEventListener('click', click);
      }
     }
    }, 500);
   }

   // if the length of matchedCards = 16 this means all possible pairs have been made and the game can be ended
   if (matchedCards.length === 16) {
    endGame(moves);
   }
  } else {
   // if there is no match add event listener back to the cards
   setTimeout(function() {
    for (let i = 0; i < cards.length; i++) {
     cards[i].addEventListener('click', click);
    }
   }, 1000);

   // add class not matched
   setTimeout(function() {
    openCards[0].parentNode.classList.add('not-matched');
    openCards[1].parentNode.classList.add('not-matched');
   }, 500);

   // call close card
   setTimeout(closeCard, 1000);
  }
 }
}

//will remove the openend and not-matched classes and empty the open cards array
function closeCard() {
 for (let i = 0; i < openCards.length; i++) {
  openCards[i].parentNode.classList.remove('deck_card-open');
  openCards[i].parentNode.classList.remove('not-matched');
 }

 openCards = [];
}

//when the user has made 8 succesful matches
function endGame(moves) {

 // remove the scoreboard
 game.classList.remove('game-show');

 // remove the card deck
 score.classList.remove('score-show');

 // If the user made less than 18 moves then he is going to win the gold Trophy 
 if (moves < 18) {

  //Add a class that removes the Silver Trophy
  trophyTwoEnd.classList.add('remove-trophy');

  //Add a class that removes the Bronge Trophy
  trophyThreeEnd.classList.add('remove-trophy');

  result = `Perfect!! you Won the Gold Trophy you are amazing.`;
  points = Math.floor(11000 / moves);
 }
 // If the user made 18 to 22 moves then he is going to win the Silver Trophy
 else if (moves >= 18 && moves <= 22) {

  //Add a class that removes the Bronge Trophy	
  trophyThreeEnd.classList.add('remove-trophy');

  //Add a class that removes the Gold Trophy
  trophyOneEnd.classList.add('remove-trophy');

  result = `Nice Job, you Won the Silver Trophy!!!`;
  points = Math.floor(10000 / moves);
 }
 // If the user made more than 23 moves then he is going to win the Bronze Trophy
 else if (moves >= 23) {

  //Add a class that removes the Silver Trophy	
  trophyTwoEnd.classList.add('remove-trophy');

  //Add a class that removes the Gold Trophy	
  trophyOneEnd.classList.add('remove-trophy');

  result = `Ok, you Won the Bronze Trophy but you should keep practicing!`;
  points = Math.floor(9000 / moves);
 }

 // get the highscore if there is one
 highscoreOld = localStorage.getItem('highscore');

 // if there is a highscore check if current points are greater than the current highscore
 // if this is the case set highscoreResult to points else to highscoreOld
 // and store in localStorage if value is changed
 if (highscoreOld) {
  if (highscoreOld > points) {
   highscoreResult = highscoreOld;
  } else {
   highscoreResult = points;

   localStorage.setItem('highscore', points);
  }
 } else {
  highscoreResult = points;

  localStorage.setItem('highscore', points);
 }

 // set only if you played longer than 59 seconds
 if (minutes > 0) {
  document.getElementById('min-end').innerText = minutes + ' minutes ';
 }
 // set seconds innetText
 document.getElementById('sec-end').innerText = second + ' seconds';

 // set amount of moves made
 document.getElementById('moves-end').innerText = moves;
 // set result string
 document.getElementById('result-text').innerText = result;
 // set highscore innerText
 document.getElementById('highscore').innerText = highscoreResult;
 // set score innerText
 document.getElementById('score-results').innerText = points;

 // show the modal
 setTimeout(function() {
  endgame.classList.add('modal-show');
 }, 400);
}

//When the streering wheel is pressed the trophies are set back to basic values
function reset() {
	
 //We are resseting the trophies at the start of the game 
 trophyThree.classList.remove('remove-trophy');
 trophyTwo.classList.remove('remove-trophy');
 trophyOne.classList.remove('remove-trophy');
 //We are resseting the trophies at the end of the game	
 trophyThreeEnd.classList.remove('remove-trophy');
 trophyTwoEnd.classList.remove('remove-trophy');
 trophyOneEnd.classList.remove('remove-trophy');

 //Removes the class when the game is reset	
 game.classList.remove('shake');

 // empty card deck
 cardDeck.innerHTML = '';

 // empty shuffledArray
 shuffledArray = [];

 // remove the end modal
 endgame.classList.remove('modal-show');

 // empty openCards
 openCards = [];
 // empty matchedCards
 matchedCards = [];

 // timerTime back to 0
 timerTime = 0;

 // seconds back to 0
 seconds = 0;

 // moves back to 0
 moves = 0;

 // points back to 0
 points = 0;

 // show the card deck and scoreboard
 setTimeout(function() {
  game.classList.add('game-show');
  score.classList.add('score-show');
 }, 400);

 // call start game
 startGame();
 
}

//Removes the Trophies during the game
function countTrophy(moves) {
 if (moves >= 18) {

  //Removes the Gold Trophy during the game if the player makes more than 18 moves
  trophyTwo.classList.add('remove-trophy');
  if (moves >= 23) {

   //Removes the Silver Trophy during the game if the player makes more than 23 moves	
   trophyThree.classList.add('remove-trophy');
  }
 }
}

//Making the image Steering Whell rotate at the end of the game 
var looper;
var degrees = 0;
var speed = 10;
function rotateAnimation(el, speed) {
 var elem = document.getElementById("steering-wheel");
 elem.style.transform = "rotate(" + degrees + "deg)";
 looper = setTimeout('rotateAnimation(\'' + elem + '\',' + speed + ')', speed);
 degrees++;
 if (degrees > 359) {
  degrees = 1;
 }
}
