import Stackable from "./Stackable";

export default class SaveableImage extends Stackable {
  constructor ({ x, y, src, width, height, order = null }) {
    super(order);
    
    this.x = x;
    this.y = y;
    this.src = src;
    this.width = width;
    this.height = height;
  }
}