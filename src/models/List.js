
export default class List {
  constructor ({ id, position, items }) {
    if (id !== null) this.id = id;
    this.position = position ? position : { x: 0, y: 0 };
    this.items = items ? items : [];
  }
}

export class StoreList {
  constructor ({ id, position, items }) {
    if (id && id !== null) this.id = id;
    this.x = position ? position.x : 0;
    this.y = position ? position.y : 0;
    this.items = items || [];
  }
}