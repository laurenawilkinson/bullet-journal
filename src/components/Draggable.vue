<template>
  <component 
    :is="component" 
    :style="componentStyle"
    @mousedown="onDragStart"
    @touchstart="onDragStart">
    <slot></slot>
  </component>
</template>

<script>
export default {
  name: 'Draggable',
  props: {
    component: {
      type: String,
      default: 'div'
    },
    id: Number,
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    }
  },
  model: {
    event: 'change'
  },
  data () {
    return {
      containerEl: '#canvas',
      initialX: this.x,
      initialY: this.y,
      currentX: this.x,
      currentY: this.y,
      dragging: false
    }
  },
  computed: {
    componentStyle () {
      return {
        top: this.currentY + 'px',
        left: this.currentX + 'px',
        position: 'absolute'
      }
    },
    xOffset () {
      return this.currentX;
    },
    yOffset () {
      return this.currentY;
    },
    listeners () {
      return {
        ...this.$listeners,
        mouseDown: this.onDragStart,
        touchStart: this.onDragStart
      }
    }
  },
  watch: {
    x (val) {
      this.initialX = val;
      this.currentX = val;
    },
    y (val) {
      this.initialY = val;
      this.currentY = val;
    },
    dragging (val) {
      this.$emit('dragging', val);
    }
  },
  methods: {
    onDragStart (event) {
      this.setContainerListeners();
      if (event.type === 'touchstart') {
        this.initialX = event.touches[0].clientX - this.xOffset;
        this.initialY = event.touches[0].clientY - this.yOffset;
      } else {
        this.initialX = event.clientX - this.xOffset;
        this.initialY = event.clientY - this.yOffset;
      }
      this.dragging = true;
      this.$emit('change', this.dragging)
    },
    onDragging (event) {
      if (!this.dragging) return;

      if (event.type === 'touchmove') {
        this.currentX = event.touches[0].clientX - this.initialX;
        this.currentY = event.touches[0].clientY - this.initialY;
      } else {
        this.currentX = event.clientX - this.initialX;
        this.currentY = event.clientY - this.initialY;
      }
    },
    onDragEnd () {
      this.dragging = false;
      this.$emit('update:x', this.currentX);
      this.$emit('update:y', this.currentY);
      this.$emit('change', this.dragging)
      this.destroyContainerListeners();
    },
    setContainerListeners () {
      const el = document.querySelector(this.containerEl);
      
      el.addEventListener('mousemove', this.onDragging);
      el.addEventListener('touchmove', this.onDragging);

      el.addEventListener('mouseup', this.onDragEnd);
      el.addEventListener('touchend', this.onDragEnd);
    },
    destroyContainerListeners () {
      const el = document.querySelector(this.containerEl);

      el.removeEventListener('mousemove', this.onDragging);
      el.removeEventListener('touchmove', this.onDragging);

      el.removeEventListener('mouseup', this.onDragEnd);
      el.removeEventListener('touchend', this.onDragEnd);
    }
  }
}
</script>