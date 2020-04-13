export class BaseTrackerItem {
  constructor (id, type, title, options = []) {
    this.id = id;
    this.type = type;
    this.title = title;
    this.options = options;
  }
}

export class InfoBarTracker extends BaseTrackerItem {
  constructor (id, boxAmount = 7, tickType = 'circle', layout = 'horizontal') {
    let options = [
      {
        type: 'text-input',
        binding: {
          type: 'number',
          min: 1,
          max: 31
        },
        value: boxAmount,
        text: 'Box Amount',
        prop: 'boxAmount'
      },
      {
        type: 'select-list',
        value: tickType,
        text: 'Tick Type',
        options: [
          {
            text: 'Circle',
            value: 'circle'
          },
          { 
            text: 'Block',
            value: 'block'
          }
        ],
        prop: 'tickType'
      },
      {
        type: 'radio-list',
        value: layout,
        text: 'Tracker Layout',
        options: [
          {
            value: 'horizontal',
            text: 'Horizontal'
          },
          {
            value: 'vertical',
            text: 'Vertical'
          }
        ],
        prop: 'layout'
      },
      {
        type: 'icon-button',
        text: 'Add Item',
        binding: {
          icon: 'add',
          className: 'button--block'
        },
        click: {
          name: 'tracker:add-item',
          payload: id 
        }
      }
    ]
    
    super(id, 'tracker', 'Tracker', options)
  }
}