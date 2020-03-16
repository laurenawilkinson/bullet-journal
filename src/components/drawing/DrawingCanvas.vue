<template>
  <canvas 
    :width="width"
    :height="height"
    ref="canvas" 
    class="drawing-canvas"
    @mousedown="onMouseDown"
    @touchstart="onMouseDown"
    @mousemove="onMouseMove"
    @touchmove="onMouseMove"
    @mouseout="onMouseUp"
    @mouseup="onMouseUp"
    @touchend="onMouseUp"></canvas>
</template>

<script>
class Path {
  constructor (initialX, initialY, strokeWidth, color) {
    this.pixels = [];
    this.lineWidth = strokeWidth;
    this.strokeStyle = color;
    this.smallestX = initialX;
    this.largestX = initialX;
    this.smallestY = initialY;
    this.largestY = initialY;
  }
}

const C2S = require('canvas2svg');

export default {
  name: 'DrawingCanvas',
  props: {
    drawingMode: Boolean,
    drawTool: String,
    width: Number,
    height: Number,
    color: String,
    strokeWidth: Number,
    canvasOffset: Object
  },
  data () {
    return {
      context: null,
      paths: [],
      isDrawing: false
    }
  },
  methods: {
    updatePaths () {
      this.$emit('update:paths', this.paths);
    },
    setupPen (context, path) {
      context.strokeStyle = path.strokeStyle;
      context.lineWidth = path.lineWidth;
      context.lineJoin = "round";
    },
    drawPixel (offsetX, offsetY) {
      const currentPath = this.paths[this.paths.length - 1];
      const newX = offsetX;
      const newY = offsetY;
      currentPath.pixels.push({ x: newX, y: newY });

      const currentPixelIndex = currentPath.pixels.length - 1;

      if (currentPixelIndex == 0) {
        this.context.beginPath();
        this.setupPen(this.context, currentPath);
        this.context.moveTo(
          currentPath.pixels[currentPixelIndex].x,
          currentPath.pixels[currentPixelIndex].y);
        this.context.lineTo(
          currentPath.pixels[currentPixelIndex].x,
          currentPath.pixels[currentPixelIndex].y);
        this.context.stroke();
      } else {
        this.context.lineTo(
          currentPath.pixels[currentPixelIndex].x,
          currentPath.pixels[currentPixelIndex].y);
        this.context.stroke();
      }

      currentPath.smallestX = newX < currentPath.smallestX 
          ? newX 
          : currentPath.smallestX;
      currentPath.largestX = newX > currentPath.largestX 
          ? newX 
          : currentPath.largestX;
      currentPath.smallestY = newY < currentPath.smallestY 
          ? newY 
          : currentPath.smallestY;
      currentPath.largestY = newY > currentPath.largestY 
          ? newY 
          : currentPath.largestY;
    },
    onMouseDown (event) {
      if (!this.drawingMode) return;

      let pathX = event.type == 'touchstart' 
        ? event.touches[0].clientX - (this.canvasOffset.x / 2)
        : event.offsetX;
      let pathY = event.type == 'touchstart' 
        ? event.touches[0].clientY - (this.canvasOffset.y / 2)
        : event.offsetY; 

      this.isDrawing = true;
      this.paths.push(new Path (pathX, pathY, this.strokeWidth, this.color))
      this.drawPixel(pathX, pathY);
    },
    onMouseMove (event) {
      if (!this.isDrawing || !this.drawingMode) return;

      let pathX = event.type == 'touchmove' 
        ? event.touches[0].clientX - (this.canvasOffset.x / 2)
        : event.offsetX;
      let pathY = event.type == 'touchmove' 
        ? event.touches[0].clientY - (this.canvasOffset.y / 2)
        : event.offsetY;

      this.drawPixel(pathX, pathY);
    },
    onMouseUp () {
      if (!this.drawingMode) return;

      this.isDrawing = false;
      this.updatePaths();
      if (this.drawTool != 'group') this.completeDrawing();
    },
    redrawPath (context, smallestX, smallestY, pixels, padding, path) {
      let xOffset = 0 - smallestX + padding;
      let yOffset = 0 - smallestY + padding;
      this.setupPen(context, path);
      pixels.forEach((p, i) => {
        if (i == 0) {
          context.beginPath();
          context.moveTo(p.x + xOffset, p.y + yOffset);
          context.stroke();
        } else if (i !== pixels.length - 1) {
          context.lineTo(p.x + xOffset, p.y + yOffset);
          context.stroke();
        } else {
          context.lineTo(p.x + xOffset, p.y + yOffset);
          context.stroke();
          context.closePath();
        }
      })
    },
    completeDrawing () {
      if (this.paths.length === 0) return;

      let smallestX = this.paths[0].smallestX;
      let smallestY = this.paths[0].smallestY;
      let largestX = this.paths[0].largestX;
      let largestY = this.paths[0].largestY;

      this.paths.forEach(p => {
        smallestX = p.smallestX < smallestX ? p.smallestX : smallestX;
        smallestY = p.smallestY < smallestY ? p.smallestY : smallestY;
        largestX = p.largestX > largestX ? p.largestX : largestX;
        largestY = p.largestY > largestY ? p.largestY : largestY;
      })

      /* resize paths canvas */

      let svgPadding = 1 + this.strokeWidth;
      let svgPathPadding = svgPadding / 2;

      let width = largestX - smallestX + svgPadding;
      let height = largestY - smallestY + svgPadding;

      /* redraw on mock canvas */

      var ctx = new C2S(width, height);

      this.paths.forEach(p => 
        this.redrawPath(ctx, smallestX, smallestY, p.pixels, svgPathPadding, p))

      var myPath = ctx.getSerializedSvg(true);

      this.$emit('draw-path', { 
        svg: myPath, 
        x: smallestX - svgPathPadding, 
        y: smallestY - svgPathPadding, 
        color: this.color });
      this.paths = []; // clear paths
      this.updatePaths();
      this.context.clearRect(0, 0, this.width, this.height); // clear canvas
    }
  },
  mounted () {
    this.context = this.$refs.canvas.getContext('2d');
  },
  beforeDestroy () {
    if (this.paths.length > 0) this.completeDrawing();
  }
}
</script>