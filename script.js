const basket = document.getElementById('basket');
const gameContainer = document.querySelector('.game-container');
const scoreDisplay = document.getElementById('score');
let action = document.getElementById("actions");

let highscore = localStorage.getItem("high-score") || 0
document.getElementById("hi-score").innerText = `high-score : ${highscore}`

let score = 0;
let gamemode = "play";

action.addEventListener('click', checkgamemode)

function checkgamemode(){
  if(gamemode == "pause"){
    action.innerText = "pause"
    gamemode = "play"
  }
  else if (gamemode == "play") {
    action.innerText = "play"
    gamemode = "pause"
  }
}
document.addEventListener('mousemove', (e) => {
    if (gamemode == "pause") {
      return
  }
    let basketPosition = e.clientX - basket.offsetWidth / 2;
    if (basketPosition >= 0 && basketPosition <= gameContainer.clientWidth - basket.offsetWidth) {
      basket.style.left = basketPosition + 'px';
    }
});

if (window.innerWidth <= 450) {
  basket.style.transition = "1s left ease"

  let startX, endX;

  document.addEventListener("touchstart", (e) => {
    if(gamemode == "pause"){
      return
     }
    startX = e.changedTouches[0].clientX;
  });

  document.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    let change = startX - endX;

    let basketLeft = parseInt(window.getComputedStyle(basket).left, 10) || 0;

    let newPosition = basketLeft - change;

    if (newPosition < 0) {
      newPosition = 0;
    } else if (newPosition > gameContainer.clientWidth - basket.offsetWidth) {
      newPosition = gameContainer.clientWidth - basket.offsetWidth;
    }

    basket.style.left = newPosition + 'px';
  });
}


function createFallingObject() {
  if (gamemode == "pause") {
    return
}
  const object = document.createElement('div');
  object.classList.add('falling-object');
   let hello = Math.floor(Math.random() * (3 - 0  + 1) + 0)
   if(hello == 3){
    object.classList.add('bomb')
   }
   let backgrounds = ["./images/p1.png","./images/p2.png","./images/p4.png","./images/p3.png"]
  object.style.background = `url("${backgrounds[hello]}")`
  object.style.left = Math.random() * (gameContainer.clientWidth - 30) + 'px'; 
  object.style.top = '0px';
  object.style.backgroundRepeat = "no-repeat";
  object.style.backgroundSize = "cover";
  object.style.backgroundPosition = "center"
  gameContainer.appendChild(object);
  let fallInterval = setInterval(() => {

    let objectTop = parseInt(window.getComputedStyle(object).getPropertyValue('top'));

    if (gamemode == "play") {
    if (score >= 50) {
      object.style.top = objectTop + 10 + 'px';
    }
    else if (score >= 100) {
      object.style.top = objectTop + 15 + 'px';
    }
    else if(score <= 50){
      object.style.top = objectTop + 5 + 'px';
    }
  }

    if (objectTop >= gameContainer.clientHeight - basket.offsetHeight - object.offsetHeight) {
      let basketLeft = basket.offsetLeft;
      let basketRight = basketLeft + basket.offsetWidth;
      let objectLeft = object.offsetLeft;
      let objectRight = objectLeft + object.offsetWidth;

      if (objectRight > basketLeft && objectLeft < basketRight) {
        if (object.classList.contains("bomb")) {
          if (score === 0) {
            score = score
          }
          else{
            score--;
          }
        }
        else{
            score++;
        }
        scoreDisplay.textContent = `Score: ${score}`;
        if (score >= highscore) {
          highscore = score
          localStorage.setItem("high-score",highscore)
          document.getElementById("hi-score").innerText = `high-score : ${highscore}`
        }
        object.remove();
        clearInterval(fallInterval);
      } else if (objectTop >= gameContainer.clientHeight - object.offsetHeight) {
        object.remove();
        clearInterval(fallInterval);
      }
    }
  }, 30);
}
  setInterval(createFallingObject, 1000);