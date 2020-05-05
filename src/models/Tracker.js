
export default class Tracker {
  constructor ({ page, id, position, items, options }) {
    this.id = id;
    this.page = page;
    this.position = position ? position : { x: 0, y: 0 };
    this.options = options ? options : {
      boxAmount: 7,
      tickType: 'circle',
      layout: 'horizontal'
    }
    this.items = items 
      ? items.map(x => new TrackerItem(x.id, { title: x.title, values: x.values }, this.options.boxAmount)) 
      : [ new TrackerItem(1, {}, this.options.boxAmount)];
  }
}

export class StoreTracker { 
  constructor ({ id, position, items, options }) {
    if (id && id !== null) this.id = id;
    this.x = position ? position.x : 0;
    this.y = position ? position.y : 0;
    this.options = options ? options : {
      boxAmount: 7,
      tickType: 'circle',
      layout: 'horizontal'
    };
    this.items = items || [ new TrackerItem(1, {}, this.options.boxAmount) ];
  }
}

export class TrackerItem {
  constructor (id, { title, values } = null, amount = 7) {
    this.id = 'tracker-item--' + id;
    this.title = title ? title : 'New Item ' + id;
    this.values = values ? values : {}; 

    this.updateValues(amount)
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