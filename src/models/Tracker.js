let tid = 0;
let iid = 1;

export default class Tracker {
  constructor ({ id, position, items, options }) {
    this.id = id ? id : 'tracker--' + tid;
    this.position = position ? position : { x: 0, y: 0 };
    this.options = options ? options : {
      boxAmount: 7,
      tickType: 'circle',
      layout: 'horizontal'
    }
    this.items = items ? items : [ new TrackerItem(0, {}, this.options.boxAmount)];
    tid++;
  }
}

export class TrackerItem {
  constructor (id, { title, values } = null, amount = 0) {
    this.id = 'tracker-item--' + id;
    this.title = title ? title : 'New Item ' + iid;
    this.values = values ? values : {}; 

    this.updateValues(amount)

    iid++;
  }

  updateValues (amount) {
    const vals = {};
    for (let i = 0; i < amount; i++) {      
      vals[i + 1] = this.values[i + 1] || false;
    }
    this.values = vals;
  }

  setChecked (index) {
    this.values[index] = !this.values[index];
  }
}