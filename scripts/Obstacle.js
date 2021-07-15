import { CanvasItem } from "./CanvasItem.js";
function rand(min, max) { return Math.random() * (max ? (max - min) : min) + (max ? min : 0) }
export class Obstacle extends CanvasItem {
  img;
  audio;
  commands;
  position;
  size;
  rotate;
  distanceMoviment = 1;

  constructor(position = { x: 0, y: 0 }, size = { h: 50, w: 40 }, rotate = 0) {
    super();

    this.position = position;
    this.size = size;
    this.rotate = rotate;

    this.img = new Image();
    this.img.src = "./assets/img/pineapple.png";
    this.img.style.transform = 'rotate(90deg)';
  }

  update() {
    const { x, y } = this.position;
    const { w, h } = this.size;

    this.context.save();
    // this.context.translate(x, y);
    // this.context.rotate(Math.PI);
    // this.context.translate(-x, -y);
    this.context.drawImage(this.img, x, y, w, h);

    // Matrix transformation
    this.context.translate(x, y);
    this.context.rotate(Math.PI);
    this.context.translate(-x, -y);

    this.context.drawImage(this.img, x, y, w, h);
    
    this.context.restore();
  }

  moveToLeft() {
    this.position.x -= this.distanceMoviment;
  }

  verifyIsVisible() {
    return ((this.position.x + this.size.w) < 0);
  }
}