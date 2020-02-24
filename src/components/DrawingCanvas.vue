<template>
  <canvas 
    :width="width"
    :height="height"
    ref="canvas" 
    class="drawing-canvas"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseout="onMouseUp"
    @mouseup="onMouseUp"></canvas>
</template>

<script>
class Path {
  constructor (initialX, initialY) {
    this.pixels = [];
    this.smallestX = initialX;
    this.largestX = initialX;
    this.smallestY = initialY;
    this.largestY = initialY;
  }
}

export default {
  name: 'DrawingCanvas',
  props: {
    drawingMode: Boolean,
    width: Number,
    height: Number
  },
  data () {
    return {
      context: null,
      paths: [],
      isDrawing: false
    }
  },
  methods: {
    onMouseDown (event) {
      if (!this.drawingMode) return;

      this.isDrawing = true;
      this.paths.push(new Path (event.offsetX, event.offsetY))
    },
    onMouseMove (event) {
      if (!this.isDrawing || !this.drawingMode) return;

      const pathIndex = this.paths.length - 1;
      const x = this.paths[pathIndex].pixels.length > 0 
                  ? this.paths[pathIndex].pixels[this.paths[pathIndex].pixels.length - 1].x
                  : event.offsetX;
      const y = this.paths[pathIndex].pixels.length > 0 
                  ? this.paths[pathIndex].pixels[this.paths[pathIndex].pixels.length - 1].y
                  : event.offsetY;
      const newX = event.offsetX;
      const newY = event.offsetY;

      this.paths[pathIndex].pixels.push({ x: newX, y: newY });

      this.context.beginPath();
      this.context.moveTo(x, y);
      this.context.lineTo(newX, newY);
      this.context.stroke();

      this.paths[pathIndex].smallestX = newX < this.paths[pathIndex].smallestX 
          ? newX 
          : this.paths[pathIndex].smallestX;
      this.paths[pathIndex].largestX = newX > this.paths[pathIndex].largestX 
          ? newX 
          : this.paths[pathIndex].largestX;
      this.paths[pathIndex].smallestY = newY < this.paths[pathIndex].smallestY 
          ? newY 
          : this.paths[pathIndex].smallestY;
      this.paths[pathIndex].largestY = newY > this.paths[pathIndex].largestY 
          ? newY 
          : this.paths[pathIndex].largestY;
    },
    onMouseUp () {
      if (!this.drawingMode) return;

      this.isDrawing = false;
    }
  },
  mounted () {
    this.context = this.$refs.canvas.getContext('2d');
  }
}
</script>