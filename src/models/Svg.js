import store from '@/stores/store';
import Stackable from './Stackable';

export default class Svg extends Stackable {
  constructor ({ html, x, y, order = null }) {
    super(order);

    this.html = html;
    this.x = x;
    this.y = y;
  }
} 