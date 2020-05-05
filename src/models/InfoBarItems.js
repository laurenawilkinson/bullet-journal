export class BaseInfoBarItem {
  constructor (id, type, title, options = []) {
    this.id = id;
    this.type = type;
    this.title = title;
    this.options = options;
  }
}

export class InfoBarTracker extends BaseInfoBarItem {
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
      },
      {
        type: 'icon-button',
        text: 'Delete Tracker',
        binding: {
          icon: 'delete',
          className: 'button--block'
        },
        click: {
          name: 'tracker:delete',
          payload: id 
        }
      }
    ]
    
    super(id, 'tracker', 'Tracker', options)
  }
}

export class InfoBarList extends BaseInfoBarItem {
  constructor (id) {
    let options = [
      {
        type: 'icon-button',
        text: 'Add Task',
        binding: {
          icon: 'add',
          className: 'button--block'
        },
        click: {
          name: 'list:add-item',
          payload: {
            id,
            type: 'task'
          } 
        }
      },
      {
        type: 'icon-button',
        text: 'Add Event',
        binding: {
          icon: 'add',
          className: 'button--block'
        },
        click: {
          name: 'list:add-item',
          payload: {
            id,
            type: 'event'
          } 
        }
      },
      {
        type: 'icon-button',
        text: 'Add Note',
        binding: {
          icon: 'add',
          className: 'button--block'
        },
        click: {
          name: 'list:add-item',
          payload: {
            id,
            type: 'note'
          } 
        }
      },
      {
        type: 'icon-button',
        text: 'Delete List',
        binding: {
          icon: 'delete',
          className: 'button--block'
        },
        click: {
          name: 'list:delete',
          payload: id 
        }
      }
    ]
    
    super(id, 'list', 'List', options)
  }
}