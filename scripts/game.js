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

// variables
const jumpDistance = convertRemToPixels(10);
const jumpDecay = convertRemToPixels(4);
const itemsDecay = convertRemToPixels(4);
let itemsInFrame = 0;

const handlePlanktonJump = () => {
  const element = document.getElementById('plankton');
  let marginBottom = convertDistanceToNumber(getElementStyle(element, 'margin-bottom'));

  let distance = 0;
  if (!marginBottom) {
    distance = jumpDistance;
  } else {
    distance = marginBottom += jumpDistance;
  }

  const maxDistance = document.body.clientHeight;
  if ((distance + (element.offsetHeight / 2)) >= maxDistance) {
    distance = (maxDistance - (element.offsetHeight / 2));
  }

  element.style.marginBottom = convertPixelsToEm(distance) + 'em';
}

document.addEventListener('keydown', function (event) {
  handlePlanktonJump();
});

const handleJumpDecay = () => {
  const element = document.getElementById('plankton');

  // execute jump decay
  var distance = convertDistanceToNumber(getElementStyle(element, 'margin-bottom'));
  distance -= jumpDecay;
  if (distance <= 0) {
    distance = 0;
  }

  element.style.marginBottom = convertPixelsToEm(distance) + 'em';
}

const handleAddItemsScenario = () => {
  const contentHtml = document.getElementById('game-root').getElementsByClassName('content')[0];

  const templateItemTop = `
    <div class="item pineapple item-top">
      <img class="pineapple" src="./assets/pineapple.png" alt="Pineapple" />
    </div>
  `;
  contentHtml.innerHTML += templateItemTop;

  const templateItemMiddle = `
    <div class="item item-middle">
      <img class="siriqueijo" src="./assets/siriqueijo.png" alt="Siriqueijo" />
    </div>
  `;
  contentHtml.innerHTML += templateItemMiddle;

  const templateItemBottom = `
    <div class="item pineapple item-bottom">
      <img class="pineapple" src="./assets/pineapple.png" alt="Pineapple" />
    </div>
  `;
  contentHtml.innerHTML += templateItemBottom;
}

const handleScenarioMoviment = () => {
  const items = document.getElementsByClassName('item');
  const maxDistance = document.body.clientWidth;

  for (var i = 0; i < items.length; i++) {
    const element = items[i];
    let distance = itemsDecay + convertDistanceToNumber(element.style.right);

    if (distance >= maxDistance) { // bateu no final da tela
      distance = maxDistance; // deixa passar até sair da visão
    }

    element.style.right = distance + 'px';
  }
}

const gameRunTime = () => {
  handleJumpDecay();

  if (itemsInFrame < 1) {
    handleAddItemsScenario();
    itemsInFrame++;
  }

  handleScenarioMoviment();

};

// game runtime
setInterval(() => {
  gameRunTime();
}, 200);