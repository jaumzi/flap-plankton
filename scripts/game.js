setInterval(() => {
  gameRun();
}, 400);

const jumpDistance = 80; // px
const jumpDecay = 40; // px

const clearMargin = (margin) => {
  margin = margin.replace('px', '');
  return Number(margin, 10);
}

const handlePlanktonJump = () => {
  const element = document.getElementById('plankton');
  var marginBottom = clearMargin(getElementStyle(element, 'margin-bottom'));

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

  element.style.marginBottom = distance + 'px';
}

document.addEventListener('keydown', function (event) {
  handlePlanktonJump();
});

const gameRun = () => {
  console.log('rodou');
  const element = document.getElementById('plankton');
  var distance = clearMargin(getElementStyle(element, 'margin-bottom'));
  distance -= jumpDecay;

  if(distance <= 0) {
    distance = 0;
  }

  element.style.marginBottom = distance + 'px';
};