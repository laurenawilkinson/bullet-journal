import Stackable from './Stackable';

export default class SaveableSvg extends Stackable {
  constructor ({ page, id, el, x, y, initialWidth, initialHeight, width, height, html = null, order = null }) {
    super(order);

    if (id && id !== null) this.id = id;

    if (el) {
      this.el = el;
    } else if (html) {
      let containerEl = document.createElement('div');
      containerEl.innerHTML = html;
      this.el = containerEl.firstChild;
    }

    this.page = page;

    this.el.setAttribute('viewBox', '0 0 ' + initialWidth + ' ' + initialHeight);
    this.html = this._serializeEl();

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.initialWidth = initialWidth;
    this.initialHeight = initialHeight;
  }

  _serializeEl () {
    const serializer = new XMLSerializer();
    return serializer.serializeToString(this.el);
  }

  updateHtml () {
    this.el.setAttribute('width', this.width + 'px');
    this.el.setAttribute('height', this.height + 'px');
    this.html = this._serializeEl();
  }
}