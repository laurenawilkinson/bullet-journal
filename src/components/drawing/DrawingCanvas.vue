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
    },
    onMouseDown (event) {
      if (!this.drawingMode) return;

      this.isDrawing = true;
      this.paths.push(new Path (event.offsetX, event.offsetY))
    },
    onMouseMove (event) {
      // need to rewrite to make smooth lines, not just printing pixel by pixel!
      // http://jsfiddle.net/MartinThoma/vSDTW/2/
      // http://paperjs.org/ 
      // https://stackoverflow.com/questions/22891827/how-do-i-hand-draw-on-canvas-with-javascript

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
      this.setupPen(this.context);
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
      this.resizeCanvas();
    },
    createPath (context, smallestX, smallestY, pixels, padding) {
      let xOffset = 0 - smallestX + padding;
      let yOffset = 0 - smallestY + padding;
      this.setupPen(context);
      context.beginPath();
      context.moveTo( pixels[0].x + xOffset, pixels[0].y + yOffset );
      pixels.forEach((p, i) => {
        context.lineTo( p.x + xOffset, p.y +yOffset );
      })
      context.stroke();
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

      let width = largestX - smallestX + svgPadding;
      let height = largestY - smallestY + svgPadding;

      var ctx = new C2S(width, height);

      this.paths.forEach(p => this.createPath(ctx, smallestX, smallestY, p.pixels, svgPadding / 2))

      var myPath = ctx.getSerializedSvg(true);

      this.$emit('draw-path', { svg: myPath, x: smallestX, y: smallestY, color: this.color });
      this.paths = []; // clear paths
      this.context.clearRect(0, 0, this.width, this.height); // clear canvas
    }
  },
  mounted () {
    this.context = this.$refs.canvas.getContext('2d');
  }
}
</script>