export default class StoreObject {
  constructor (page, id = null) {
    if (id && id !== null) this.id = id;
    this.page = page;
  }
}