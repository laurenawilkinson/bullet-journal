import Stackable from "./Stackable";
import StoreObject from "./StoreObject";

export default class SaveableImage extends Stackable {
  constructor ({ page, x, y, src, width, height, order = null, id = null }) {
    super(order);
    
    if (id !== null) this.id = id;
    this.page = page;
    this.x = x;
    this.y = y;
    this.src = src;
    this.width = width;
    this.height = height;
  }
}

export class StoreImage extends StoreObject {
  constructor ({ page, x, y, width, height, src, id = null }) {
    super(page, id)

    this.x = x;
    this.y = y;
    this.src = src;
    this.width = width;
    this.height = height;
  }
}