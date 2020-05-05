
export default class List {
  constructor ({ id, position, items }) {
    if (id !== null) this.id = id;
    this.position = position ? position : { x: 0, y: 0 };
    this.items = items ? items : [ new BulletListItem({ id: 1, content: 'New Task' }) ];
  }
}

export class BulletListItem {
  constructor ({ id, type, state, priority, content, removed }) {
    this.id = id;
    this.type = type || 'task';
    this.state = state || 'default'; // default, completed, migrated
    this.priority = priority || false;
    this.content = content || '';
    this.removed = removed || false;
  }
}

export class StoreList {
  constructor ({ id, position, items }) {
    if (id && id !== null) this.id = id;
    this.x = position ? position.x : 0;
    this.y = position ? position.y : 0;
    this.items = items || [ new BulletListItem({ id: 1, content: 'New Task' }) ];
  }
}