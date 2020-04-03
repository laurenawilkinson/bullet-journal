let lid = 0;

export default class List {
  constructor ({ id, position, items }) {
    this.id = id ? id : 'list--' + lid;
    this.position = position ? position : { x: 0, y: 0 };
    this.items = items ? items : [];
    lid++;
  }
}