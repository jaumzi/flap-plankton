import { CanvasItem } from "./CanvasItem.js";

export class Obstacle extends CanvasItem {
  img;
  audio;
  commands;
  position;
  size;
  distanceMoviment = 5;

  constructor(position = { x: 0, y: 0 }, size = { h: 50, w: 40 }, path) {
    super();

    const sizeAux = {
      h: size.h,
      w: size.w > 180 ? 180 : size.w
    }

    this.position = position;
    this.size = sizeAux;

    this.img = new Image();
    this.img.src = path;
  }

  update() {
    const { x, y } = this.position;
    const { w, h } = this.size;

    this.context.save();
    this.context.drawImage(this.img, x, y, w, h);
    this.context.restore();
  }

  moveToLeft(velocity) {
    this.position.x -= (this.distanceMoviment + velocity);
  }

  resetPosition() {
    this.position.x = this.canvas.width;
  }

  verifyIsVisible() {
    return ((this.position.x + this.size.w) < 0);
  }
}