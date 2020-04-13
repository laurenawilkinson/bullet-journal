<template>
  <vue-draggable-resizable 
    v-if="resizable"
    v-bind="draggableBinding" 
    @dragstop="setNewPosition"
    @resizing="setNewSize">
    <slot></slot>
  </vue-draggable-resizable>
  <div 
    v-else
    v-on="listeners"
    ref="draggable"
    :class="{ 'draggable vdr': true, active: dragging || active }"
    :style="componentStyle">
    <slot></slot>
  </div>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable'

export default {
  name: 'Draggable',
  components: {
    VueDraggableResizable
  },
  props: {
    resizable: {
      type: Boolean,
      default: true
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      localWidth: 0,
      localHeight: 0,
      dragging: false,
      offsetX: 0,
      offsetY: 0,
      containerEl: '#canvas'
    }
  },
  computed: {
    componentStyle () {
      return {
        top: this.y + 'px',
        left: this.x + 'px',
        position: 'absolute'
      }
    },
    listeners () {
      return {
        ...this.$listeners,
        mousedown: this.onDragStart,
        touchstart: this.onDragStart
      }
    },
    draggableBinding () {
      return {
        w: this.width ? this.width : this.localWidth,
        h: this.height ? this.height : this.localHeight,
        x: this.x,
        y: this.y,
        'lock-aspect-ratio': true,
        resizable: this.resizable && !this.disabled,
        draggable: !this.disabled
      }
    }
  },
  methods: {
    onDragStart (event) {
      this.setContainerListeners();
      const offsetX = this.$refs.draggable.offsetLeft;
      const offsetY = this.$refs.draggable.offsetTop;

      this.offsetX = event.type == 'touchstart'
        ? event.touches[0].clientX - offsetX
        : event.clientX - offsetX;

      this.offsetY = event.type == 'touchstart'
        ? event.touches[0].clientY - offsetY
        : event.clientY - offsetY;

      this.dragging = true;
    },
    onDragging (event) {
      if (!this.dragging) return;

      const x = event.type == 'touchmove'
        ? event.touches[0].clientX - this.offsetX
        : event.clientX - this.offsetX;

      const y = event.type == 'touchmove'
        ? event.touches[0].clientY - this.offsetY
        : event.clientY - this.offsetY;

      this.setNewPosition(x, y)
    },
    onDragEnd (e) {
      this.dragging = false;
      this.destroyContainerListeners();
    },
    setNewPosition (x, y) {
      this.$emit('update:x', x);
      this.$emit('update:y', y);
    },
    setNewSize (x, y, width, height) {
      this.$emit('update:width', width);
      this.$emit('update:height', height);
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