export class BaseTrackerItem {
  constructor (type, title, options = []) {
    this.type = type;
    this.title = title;
    this.options = options;
  }
}

export class InfoBarTracker extends BaseTrackerItem {
  constructor (boxAmount = 7, tickType = 'circle', layout = 'horizontal') {
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
      }
    ]
    
    super('tracker', 'Tracker', options)
  }
}