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

const C2S = require('canvas2svg');

export default {
  name: 'DrawingCanvas',
  props: {
    drawingMode: Boolean,
    width: Number,
    height: Number,
    color: String,
    strokeWidth: Number
  },
  data () {
    return {
      context: null,
      paths: [],
      isDrawing: false
    }
  },
  methods: {
    setupPen (context) {
      context.strokeStyle = this.color;
      context.lineWidth = this.strokeWidth;
      context.lineJoin = "round";
    },
    drawPixel (event) {
      const currentPath = this.paths[this.paths.length - 1];
      const x = currentPath.pixels.length > 0 
                  ? currentPath.pixels[currentPath.pixels.length - 1].x
                  : event.offsetX;
      const y = currentPath.pixels.length > 0 
                  ? currentPath.pixels[currentPath.pixels.length - 1].y
                  : event.offsetY;
      const newX = event.offsetX;
      const newY = event.offsetY;
      

      currentPath.pixels.push({ x: newX, y: newY });

      const currentPixelIndex = currentPath.pixels.length - 1;


      if (currentPixelIndex == 0) {
        this.context.beginPath();
        this.setupPen(this.context);
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

      this.isDrawing = true;
      this.paths.push(new Path (event.offsetX, event.offsetY))
      this.drawPixel(event);
    },
    onMouseMove (event) {
      if (!this.isDrawing || !this.drawingMode) return;

      this.drawPixel(event);
    },
    onMouseUp () {
      if (!this.drawingMode) return;

      this.isDrawing = false;
      this.resizeCanvas();
    },
    redrawPath (context, smallestX, smallestY, pixels, padding) {
      let xOffset = 0 - smallestX + padding;
      let yOffset = 0 - smallestY + padding;
      this.setupPen(context);
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
    resizeCanvas () {
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
      
      let svgPadding = 1 + this.strokeWidth;
      let svgPathPadding = svgPadding / 2;

      let width = largestX - smallestX + svgPadding;
      let height = largestY - smallestY + svgPadding;

      var ctx = new C2S(width, height);

      this.paths.forEach(p => this.redrawPath(ctx, smallestX, smallestY, p.pixels, svgPathPadding))

      var myPath = ctx.getSerializedSvg(true);

      this.$emit('draw-path', { svg: myPath, x: smallestX - svgPathPadding, y: smallestY - svgPathPadding, color: this.color });
      this.paths = []; // clear paths
      this.context.clearRect(0, 0, this.width, this.height); // clear canvas
    }
  },
  mounted () {
    this.context = this.$refs.canvas.getContext('2d');
  }
}
</script>