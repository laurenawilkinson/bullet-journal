<template>
  <vue-draggable-resizable 
    v-bind="draggableBinding" 
    @dragstop="setNewPosition"
    @resizing="setNewSize">
    <slot></slot>
  </vue-draggable-resizable>
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
    width: Number,
    height: Number
  },
  computed: {
    draggableBinding () {
      return {
        w: this.width,
        h: this.height,
        x: this.x,
        y: this.y,
        'lock-aspect-ratio': true,
        resizable: this.resizable && !this.disabled,
        draggable: !this.disabled
      }
    }
  },
  methods: {
    setNewPosition (x, y) {
      this.$emit('update:x', x);
      this.$emit('update:y', y);
    },
    setNewSize (x, y, width, height) {
      this.$emit('update:width', width);
      this.$emit('update:height', height);
    }
  }
}
</script>