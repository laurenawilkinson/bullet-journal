import Stackable from "./Stackable";

export default class SaveableImage extends Stackable {
  constructor (x, y, src, order = null) {
    super(order);
    
    this.x = x;
    this.y = y;
    this.src = src;
  }
}