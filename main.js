import { Game } from "./scripts/Game.js";

function getElementStyle(oElm, strCssRule){
  var strValue = "";
  if(document.defaultView && document.defaultView.getComputedStyle){
      strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
  }
  else if(oElm.currentStyle){
      strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
          return p1.toUpperCase();
      });
      strValue = oElm.currentStyle[strCssRule];
  }
  return strValue;
}

const loadComponent = async (path) => {
  return fetch(path)
    .then(response => {
      return response.text()
    })
    .then(data => {
      document.getElementById('root').innerHTML = data;
    });
}
const loadJS = (jsFilePath, callback = () => {}) => {
  var js = document.createElement("script");
  js.type = "module";
  js.src = jsFilePath;
  js.onreadystatechange = callback;
  js.onload = callback;
  document.head.appendChild(js);
}

const showComponent = (componentId) => {
  document.getElementById(componentId).style.display = "block";
}
const hideComponent = (componentId) => {
  document.getElementById(componentId).style.display = "none";
}


const game = new Game();

game.registerKeysListener();
game.registerResizeListener();
game.registerFocusGameListener();

game.run();


// document.addEventListener('keydown', function (event) {
//   game.keyEvent[event.code] = true;
// });
// document.addEventListener('keyup', function (event) {
//   game.keyEvent[event.code] = false;
// });

// window.onload = () => {
//   showComponent('loading-root');
// };
// window.addEventListener('load', function () {
//   this.setTimeout(() => {
//     showComponent('loading-root');
    // loadJS('./scripts/menu.js', () => {
      // hideComponent('loading-root');
      // showComponent('menu-root');
    // });
//   }, 2000);
// });

// loadJS('./scripts/game.js', () => {
  // hideComponent('loading-root');
  // showComponent('game-root');
// });