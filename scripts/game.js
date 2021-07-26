import { Plankton } from "./Plankton.js";
import { CanvasItem } from "./CanvasItem.js";
import { Obstacle } from "./Obstacle.js";

const convertDistanceToNumber = (margin) => {
  margin = margin.replace('px', '');
  margin = margin.replace('em', '');
  return Number(margin, 10);
}

const convertPixelsToEm = (px) => {
  return px > 0 ? (px / convertDistanceToNumber(getComputedStyle(document.documentElement).fontSize)) : 0;
}

const convertRemToPixels = (em) => {
  return em > 0 ? (em * convertDistanceToNumber(getComputedStyle(document.documentElement).fontSize)) : 0;
}

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
}

const deleteHtml = (classHtml) => {
  const items = document.getElementsByClassName(classHtml);

  for (var i = 0; i < items.length; i++) {
    items[i].emove();
  }
}

// class Game {
//   // variables
//   jumpDistance = convertRemToPixels(10);
//   jumpDecay = convertRemToPixels(4);
//   itemsDecay = convertRemToPixels(4);
//   itemsInFrame = 0;

//   handleJumpDecay = () => {
//     const element = document.getElementById('plankton');

//     // execute jump decay
//     var distance = convertDistanceToNumber(getElementStyle(element, 'margin-bottom'));
//     distance -= this.jumpDecay;
//     if (distance <= 0) {
//       distance = 0;
//     }

//     element.style.marginBottom = convertPixelsToEm(distance) + 'em';
//   };

//   handlePlanktonJump = () => {
//     const element = document.getElementById('plankton');
//     let marginBottom = convertDistanceToNumber(getElementStyle(element, 'margin-bottom'));

//     let distance = 0;
//     if (!marginBottom) {
//       distance = this.jumpDistance;
//     } else {
//       distance = marginBottom += this.jumpDistance;
//     }

//     const maxDistance = document.body.clientHeight;
//     if ((distance + (element.offsetHeight / 2)) >= maxDistance) {
//       distance = (maxDistance - (element.offsetHeight / 2));
//     }

//     element.style.marginBottom = convertPixelsToEm(distance) + 'em';
//   };

//   handleAddItemsScenario = () => {
//     const contentHtml = document.getElementById('game-root').getElementsByClassName('content')[0];

//     const templateItemTop = `
//       <div class="item pineapple item-top">
//         <img class="pineapple" src="./assets/pineapple.png" alt="Pineapple" />
//       </div>
//     `;
//     const templateItemMiddle = `
//       <div class="item item-middle">
//         <img class="siriqueijo" src="./assets/siriqueijo.png" alt="Siriqueijo" />
//       </div>
//     `;
//     const templateItemBottom = `
//       <div class="item pineapple item-bottom">
//         <img class="pineapple" src="./assets/pineapple.png" alt="Pineapple" />
//       </div>
//     `;

//     let templates = [templateItemTop, templateItemMiddle, templateItemBottom];
//     const firstIndex = getRandomInt(0, templates.length);
//     contentHtml.innerHTML += templates[firstIndex];

//     templates = templates.filter(template => template !== templates[firstIndex]);
//     const secondIndex = getRandomInt(0, templates.length);
//     contentHtml.innerHTML += templates[secondIndex];

//     this.itemsInFrame++;
//   };

//   handleScenarioMoviment = () => {
//     const items = document.getElementsByClassName('item');
//     const maxDistance = document.body.clientWidth;

//     let itemsInScenarioFrame = true;

//     for (var i = 0; i < items.length; i++) {
//       const element = items[i];
//       let distance = this.itemsDecay + convertDistanceToNumber(element.style.right);

//       if (distance >= maxDistance) { // bateu no final da tela
//         distance = maxDistance; // deixa passar até sair da visão
//         itemsInScenarioFrame = false;
//       }

//       element.style.right = distance + 'px';
//     }

//     if (!itemsInScenarioFrame) {
//       this.deleteItemsScenario();
//     }
//   };

//   deleteItemsScenario = () => {
//     deleteHtml('item-top');
//     deleteHtml('item-middle');
//     deleteHtml('item-bottom');

//     this.itemsInFrame -= (this.itemsInFrame > 0) ? 1 : 0;
//   };

//   gameRunTime = () => {
//     this.handleJumpDecay();

//     if (this.itemsInFrame < 1) {
//       this.handleAddItemsScenario();
//     }

//     this.handleScenarioMoviment();
//   };
// }


// const game = new Game();



// game runtime
// setInterval(() => {
//   game.gameRunTime();
// }, 200);



export class Game extends CanvasItem {
  frame = 0;
  plakton;
  obstacles = [];
  obstaclesTemplate = [];
  obstaclesVelocity = 0;
  obstaclesVelocityIncrement = 0.5;
  timerIncrementVelocity;
  pause = false;
  playerDead = false;

  constructor() {
    super();

    this.plakton = new Plankton(
      { x: this.canvas.width * 0.25, y: this.canvas.height * 0.5 },
      { w: this.canvas.width / 6, h: this.canvas.height / 7 }
    );

    // set velocity increment
    this.timerIncrementVelocity = setInterval(() => {
      if (!this.pause) {
        this.obstaclesVelocity += this.obstaclesVelocityIncrement;
      }
    }, 5000);
  }

  registerKeysListener() {
    // game commands hook
    window.keyEvent = { '': false };
    document.addEventListener('keydown', function (event) {
      window.keyEvent[event.code] = true;
    });
    document.addEventListener('keyup', function (event) {
      window.keyEvent[event.code] = false;
    });
  }

  registerResizeListener() {
    // resize screen game
    window.addEventListener('resize', () => {
      const rootElement = document.getElementById('game-root');
      const canvas = document.getElementById('game-content');

      canvas.width = rootElement.offsetWidth;
      canvas.height = rootElement.offsetHeight;

      this.update();
    })
  }

  registerFocusGameListener() {
    window.addEventListener('blur', () => {
      this.pauseGame();
    });
    window.addEventListener('focus', () => {
      this.playGame();
    });
  }

  update() {
    if (this.pause || this.playerDead) {
      return;
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.plakton.update();

    this.obstacles.forEach((obstacle, index) => {
      obstacle.moveToLeft(this.obstaclesVelocity);
      obstacle.update();

      if (obstacle.verifyIsVisible()) {
        this.obstacles.splice(index, 1);
      }
    });

    this.generateNewObstacles();
    this.verifyPlanktonColiderInObstacles();
  }

  generateNewObstacles() {
    if (this.obstacles.length === 0) {
      // resets
      this.obstaclesTemplate = [
        new Obstacle(
          { x: this.canvas.width, y: 0 },
          { w: this.canvas.width / 4, h: this.canvas.height / 3 },
          "./assets/img/pineapple_rotate.png"
        ),
        new Obstacle(
          { x: this.canvas.width, y: this.canvas.height / 3 },
          { w: this.canvas.width / 4, h: this.canvas.height / 3 },
          "./assets/img/siriqueijo.png"
        ),
        new Obstacle(
          { x: this.canvas.width, y: this.canvas.height - (this.canvas.height / 3) },
          { w: this.canvas.width / 4, h: this.canvas.height / 3 },
          "./assets/img/pineapple.png"
        )
      ];

      // definitions
      let obstaclesTemplateArray = this.obstaclesTemplate;

      const firstIndex = getRandomInt(0, obstaclesTemplateArray.length);
      this.obstacles.push(obstaclesTemplateArray[firstIndex]);

      obstaclesTemplateArray = obstaclesTemplateArray.filter(template => template !== obstaclesTemplateArray[firstIndex]);

      const secondIndex = getRandomInt(0, obstaclesTemplateArray.length);
      this.obstacles.push(obstaclesTemplateArray[secondIndex]);
    }
  }
  verifyPlanktonColiderInObstacles() {
    for (var i = 0; i < this.obstacles.length; i++) {
      if (this.verifyObjectsColider(this.obstacles[i], this.plakton)) {
        this.pauseGame();
        this.playerDead = true;
        return;
      }
    }
  }

  verifyObjectsColider(object1, object2) {
    const object1MinX = object1.position.x;
    const object1MaxX = object1.position.x + object1.size.w;
    const object1MinY = object1.position.y;
    const object1MaxY = object1.position.y + object1.size.h;

    const object2MinX = object2.position.x;
    const object2MaxX = object2.position.x + object2.size.w;
    const object2MinY = object2.position.y;
    const object2MaxY = object2.position.y + object2.size.h;

    if (
      (
        (object1MinX < object2MinX && object2MinX < object1MaxX) ||
        (object1MinX < object2MaxX && object2MaxX < object1MaxX)
      ) 
      &&
      (
        (object1MinY < object2MinY && object2MinY < object1MaxY) ||
        (object1MinY < object2MaxY && object2MaxY < object1MaxY)
      )
    ) {
      return true;
    }

    return false;
  }

  pauseGame() {
    this.pause = true;
  }
  playGame() {
    this.pause = false;
  }

  run() {
    this.update();
    requestAnimationFrame(() => this.run());
  }
}


