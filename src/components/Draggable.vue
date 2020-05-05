<template>
  <vue-draggable-resizable 
    v-if="resizable"
    v-bind="draggableBinding" 
    @activated="localActive = true"
    @deactivated="localActive = false"
    @dragging="dragging = true"
    @dragstop="draggableStopped"
    @resizing="setNewSize"
    @resizestop="$emit('resizestop')">
    <div v-if="buttons.length > 0 && !dragging && localActive" class="draggable__tools">
      <icon-button 
        v-for="button in buttons" 
        :key="button.key" 
        :icon="button.icon"
        @click="$emit(`click:${button.key}`)" />
    </div>
    <slot></slot>
  </vue-draggable-resizable>
  <div 
    v-else
    v-on="listeners"
    ref="draggable"
    :class="{ 'draggable vdr': true, active: dragging || active }"
    :style="componentStyle">
    <div v-if="buttons.length > 0 && active" class="draggable__tools">
      <icon-button 
        v-for="button in buttons" 
        :key="button.key" 
        :icon="button.icon"
        @click="$emit(`click:${button.key}`)" />
    </div>
    <slot></slot>
  </div>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable'
import IconButton from '@/components/IconButton.vue'

export default {
  name: 'Draggable',
  components: {
    VueDraggableResizable,
    IconButton
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
    },
    buttons: {
      type: Array,
      default: () => []
    },
    maxWidth: {
      type: Number,
      default: null
    },
    maxHeight: {
      type: Number,
      default: null
    },
  },
  data () {
    return {
      localWidth: 0,
      localHeight: 0,
      dragging: false,
      offsetX: 0,
      offsetY: 0,
      containerEl: '#canvas',
      positionChanged: false,
      localActive: false
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
        maxWidth: this.maxWidth || null,
        maxHeight: this.maxHeight || null,
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
      this.positionChanged = x !== this.x || y !== this.y;
      this.setNewPosition(x, y)
    },
    onDragEnd () {
      if (!this.dragging) return;

      this.dragging = false;
      if (this.positionChanged) this.$emit('dragstop');
      this.positionChanged = false;
      this.destroyContainerListeners();
    },
    draggableStopped (x, y) {
      this.setNewPosition(x, y)
      this.dragging = false;
      this.$emit('dragstop')
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