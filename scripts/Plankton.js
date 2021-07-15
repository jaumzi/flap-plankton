import { CanvasItem } from "./CanvasItem.js";

export class Plankton extends CanvasItem {
  frame = 0;
  img;
  audio;
  commands;
  position;
  size;
  distanceMoviment = 8;

  constructor(position = { x: 0, y: 0 }, size = { h: 50, w: 50 }) {
    super();

    this.position = position;
    this.size = size;

    this.img = new Image();
    this.img.src = "./assets/img/plankton.png";

    this.audio = new Audio();
    this.audio.src = "./assets/audio/jump.wav";


    this.addcommands();
  }

  update() {
    this.frame++; // controlar passagem do tempo

    this.executeComands();

    if (this.frame % 5) { // quando multiplo de 5
      this.applyGravity();
    }

    const { x, y } = this.position;
    const { w, h } = this.size;

    this.context.save();
    this.context.drawImage(this.img, x, y, w, h);
    this.context.restore();
  }

  addcommands() {
    this.commands = {
      '*': () => { this.jump() },
    };
  }

  jump() {
    this.audio.play();

    this.position.y -= this.distanceMoviment;

    if (this.position.y < 0) {
      this.position.y = 0;
    }
  }

  applyGravity() {
    this.position.y += this.distanceMoviment / 3;

    const planktonMaxPositionY = this.canvas.height - this.size.h - 5;
    if (this.position.y > planktonMaxPositionY) {
      this.position.y = planktonMaxPositionY;
    }
  }

}