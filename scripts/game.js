const convertDistanceToNumber = (margin) => {
  margin = margin.replace('px', '');
  margin = margin.replace('em', '');
  return Number(margin, 10);
}

const convertPixelsToEm = (px) => {
  return px > 0 ? (px / convertDistanceToNumber(getComputedStyle(document.documentElement).fontSize)) : 0;
}

const convertRemToPixels = (rem) => {
  return rem > 0 ? (rem * convertDistanceToNumber(getComputedStyle(document.documentElement).fontSize)) : 0;
}

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
}

const deleteHtml = (classHtml) => {
  const items = document.getElementsByClassName(classHtml);

  for (var i = 0; i < items.length; i++) {
    items[i].remove();
  }
}

class Game {
  // variables
  jumpDistance = convertRemToPixels(10);
  jumpDecay = convertRemToPixels(4);
  itemsDecay = convertRemToPixels(4);
  itemsInFrame = 0;

  handleJumpDecay = () => {
    const element = document.getElementById('plankton');

    // execute jump decay
    var distance = convertDistanceToNumber(getElementStyle(element, 'margin-bottom'));
    distance -= this.jumpDecay;
    if (distance <= 0) {
      distance = 0;
    }

    element.style.marginBottom = convertPixelsToEm(distance) + 'em';
  };

  handlePlanktonJump = () => {
    const element = document.getElementById('plankton');
    let marginBottom = convertDistanceToNumber(getElementStyle(element, 'margin-bottom'));

    let distance = 0;
    if (!marginBottom) {
      distance = this.jumpDistance;
    } else {
      distance = marginBottom += this.jumpDistance;
    }

    const maxDistance = document.body.clientHeight;
    if ((distance + (element.offsetHeight / 2)) >= maxDistance) {
      distance = (maxDistance - (element.offsetHeight / 2));
    }

    element.style.marginBottom = convertPixelsToEm(distance) + 'em';
  };

  handleAddItemsScenario = () => {
    const contentHtml = document.getElementById('game-root').getElementsByClassName('content')[0];

    const templateItemTop = `
      <div class="item pineapple item-top">
        <img class="pineapple" src="./assets/pineapple.png" alt="Pineapple" />
      </div>
    `;
    const templateItemMiddle = `
      <div class="item item-middle">
        <img class="siriqueijo" src="./assets/siriqueijo.png" alt="Siriqueijo" />
      </div>
    `;
    const templateItemBottom = `
      <div class="item pineapple item-bottom">
        <img class="pineapple" src="./assets/pineapple.png" alt="Pineapple" />
      </div>
    `;

    let templates = [templateItemTop, templateItemMiddle, templateItemBottom];
    const firstIndex = getRandomInt(0, templates.length);
    contentHtml.innerHTML += templates[firstIndex];

    templates = templates.filter(template => template !== templates[firstIndex]);
    const secondIndex = getRandomInt(0, templates.length);
    contentHtml.innerHTML += templates[secondIndex];

    this.itemsInFrame++;
  };

  handleScenarioMoviment = () => {
    const items = document.getElementsByClassName('item');
    const maxDistance = document.body.clientWidth;

    let itemsInScenarioFrame = true;

    for (var i = 0; i < items.length; i++) {
      const element = items[i];
      let distance = this.itemsDecay + convertDistanceToNumber(element.style.right);

      if (distance >= maxDistance) { // bateu no final da tela
        distance = maxDistance; // deixa passar até sair da visão
        itemsInScenarioFrame = false;
      }

      element.style.right = distance + 'px';
    }

    if (!itemsInScenarioFrame) {
      this.deleteItemsScenario();
    }
  };

  deleteItemsScenario = () => {
    deleteHtml('item-top');
    deleteHtml('item-middle');
    deleteHtml('item-bottom');

    this.itemsInFrame -= (this.itemsInFrame > 0) ? 1 : 0;
  };

  gameRunTime = () => {
    this.handleJumpDecay();

    if (this.itemsInFrame < 1) {
      this.handleAddItemsScenario();
    }

    this.handleScenarioMoviment();
  };
}


const game = new Game();

document.addEventListener('keydown', function (event) {
  game.handlePlanktonJump();
});

// game runtime
setInterval(() => {
  game.gameRunTime();
}, 200);