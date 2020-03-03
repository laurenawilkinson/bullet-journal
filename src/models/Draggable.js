export default class Draggable {
  constructor (x, y) {
    this.initialX = x;
    this.initialY = y;
    this.currentX = x;
    this.currentY = y;
    this.active = false;
  }
  
  get xOffset () {
    return this.currentX;
  }

  get yOffset () {
    return this.currentY;
  }

  setPosition (el, x, y) {
    // el.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
    el.style.left = x + 'px';
    el.style.top = y + 'px';
  }

  onDragStart (e) {
    this.initialX = e.type == 'touchstart' 
      ? e.touches[0].clientX - this.xOffset
      : e.clientX - this.xOffset;

    this.initialY = e.type == 'touchstart' 
      ? e.touches[0].clientY - this.yOffset
      : e.clientY - this.yOffset;

    this.active = true;
  }

  onDragging (e, el) {
    if (!this.active) return;
    e.preventDefault();
    
    this.currentX = e.type == 'touchmove' 
      ? e.touches[0].clientX - this.initialX
      : e.clientX - this.initialX;
    this.currentY = e.type == 'touchmove' 
      ? e.touches[0].clientY - this.initialY
      : e.clientY - this.initialY;

    this.setPosition(el, this.currentX, this.currentY);
  }

  onDragEnd (e) {
    if (this.active) {
      console.log('saving postition');
      this.active = false;
      // el.classList.remove('dragging');
    }
  }
}