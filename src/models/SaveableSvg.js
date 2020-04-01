import store from '@/stores/store';
import Stackable from './Stackable';

export default class SaveableSvg extends Stackable {
  constructor ({ el, x, y, width, height, order = null }) {
    super(order);

    this.el = el;
    this.el.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    this.html = this._serializeEl();

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
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