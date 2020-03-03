// const setPosition = (el, x, y) => {
//   el.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
// }

// // change into class later. Offsets can be computed (get function)
// let val = null;
// let dragging = false;
// let initialX = 0;
// let initialY = 0;
// let xOffset = 0;
// let yOffset = 0;

// const onDragStart = (e, el) => {
//   if (!val.draggable) return;
//   initialX = e.type == 'touchstart' 
//     ? e.touches[0].clientX - xOffset
//     : e.clientX - xOffset;
//   initialY = e.type == 'touchstart' 
//     ? e.touches[0].clientY - yOffset
//     : e.clientY - yOffset;

//   dragging = true;
//   el.classList.add('dragging');
// }
// const onDragging = (e, el) => {
//   if (!dragging || !val.draggable) return;
//   e.preventDefault();
  
//   val.x = e.type == 'touchmove' 
//     ? e.touches[0].clientX - initialX
//     : e.clientX - initialX;
//   val.y = e.type == 'touchmove' 
//     ? e.touches[0].clientY - initialY
//     : e.clientY - initialY;

//   setPosition(el, val.x, val.y);

//   xOffset = val.x;
//   yOffset = val.y;
// }
// const onDragEnd = (e, el, value) => {
//   if (dragging) {
//     console.log('saving postition');
//     dragging = false;
//     value = val;
//     el.classList.remove('dragging');
//   }
// }

export default {
  inserted (el, { value }) {
    console.log('binding...', el)
    console.log(value);
    // val = value;
    // xOffset = val.x;
    // yOffset = val.y;

    // el.classList.add('draggable');
    // let containerEl = document.getElementById('canvas');

    // setPosition(el, val.x, val.y);

    // el.addEventListener('mousedown', (e) => onDragStart(e, el));
    // el.addEventListener('touchstart', (e) => onDragStart(e, el));

    // containerEl.addEventListener('mousemove', (e) => onDragging(e, el));
    // containerEl.addEventListener('touchmove', (e) => onDragging(e, el));

    // containerEl.addEventListener('mouseup', (e) => onDragEnd(e, el, value));
    // containerEl.addEventListener('touchend', (e) => onDragEnd(e, el, value));

    
    let containerEl = document.getElementById('canvas');
    el.addEventListener('mousedown', (e) => value.onDragStart(e, el));
    el.addEventListener('touchstart', (e) => value.onDragStart(e, el));

    containerEl.addEventListener('mousemove', (e) => value.onDragging(e, el));
    containerEl.addEventListener('touchmove', (e) => value.onDragging(e, el));

    containerEl.addEventListener('mouseup', (e) => value.onDragEnd(e));
    containerEl.addEventListener('touchend', (e) => value.onDragEnd(e));
  },
  update (el, { value, arg }) {
    if (!arg) {
      console.log('no longer draggable...')
    }
    // console.log('updating', el)
    // console.log(value)
    // val = value;
    // if (!val.draggable) {
    //   let containerEl = document.getElementById('canvas');

    //   containerEl.removeEventListener('mousemove', (e) => onDragging(e, el));
    //   containerEl.removeEventListener('touchmove', (e) => onDragging(e, el));
  
    //   containerEl.removeEventListener('mouseup', (e) => onDragEnd(e, el, value));
    //   containerEl.removeEventListener('touchend', (e) => onDragEnd(e, el, value));
    //   return;
    // } else {
    //   el.classList.add('draggable');
    //   setPosition(el, val.x, val.y);
    // }
  },
  unbind (el) {
    console.log('unbinding...', el)
    // el.classList.remove('draggable');
  }
}