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

class Drawable {
  constructor (lineWidth, strokeStyle) {
    this.lineWidth = lineWidth;
    this.strokeStyle = strokeStyle;
  }

  setupPen (ctx) {
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.lineJoin = "round";
  }
}

class Line extends Drawable {
  constructor (initialX, initialY, strokeWidth, color) {
    super(strokeWidth, color);

    this.startX = initialX;
    this.startY = initialY;
    this.endX = initialX;
    this.endY = initialY;
  }

  draw (ctx, x, y) {
    this.endX = x;
    this.endY = y;
    ctx.beginPath();
    super.setupPen(ctx);
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);
  }

  finish (ctx) {
    ctx.stroke();
  }
}

class Rectangle extends Drawable {
  constructor (initialX, initialY, strokeWidth, color) {
    super(strokeWidth, color);

    this.startX = initialX;
    this.startY = initialY;
    this.width = 0;
    this.height = 0;
  }

  draw (ctx, x, y) {
    // can't draw backwards rect ?    

    this.width = Math.abs(x - this.startX);
    this.height = Math.abs(y - this.startY);
  }

  finish (ctx) {
    super.setupPen(ctx);
    ctx.strokeRect(this.startX, this.startY, this.width, this.height);
  }
}

class Circle extends Drawable {
  constructor (initialX, initialY, strokeWidth, color) {
    super(strokeWidth, color);

    this.initialX = initialX;
    this.initialY = initialY;
    this.startX = initialX;
    this.startY = initialY;
    this.radiusX = 0;
    this.radiusY = 0;
    this.rotation = 0;
    this.startAngle = 0; // Starting point on circle
    this.endAngle = Math.PI * 2; // End point on circle
  }

  draw (ctx, x, y) {
    const radiusX = (x - this.initialX) / 2;
    const radiusY = (y - this.initialY) / 2;

    this.startX = this.initialX + radiusX;
    this.startY = this.initialY + radiusY;

    this.radiusX = Math.abs(radiusX);
    this.radiusY = Math.abs(radiusY);

    ctx.beginPath();
    super.setupPen(ctx);
    ctx.ellipse(
      this.startX, 
      this.startY, 
      this.radiusX, 
      this.radiusY, 
      this.rotation, 
      this.startAngle, 
      this.endAngle
    );
  }

  finish (ctx) {
    ctx.stroke();
  }
}

// CARE: I have edited canvas2svg to include a PR
// that adds support for the ellipse method.
import C2S from '@/assets/canvas2svg'
// const C2S = require('canvas2svg');

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
      lines: [],
      rects: [],
      ellipses: [],
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

      console.log(this.drawTool)

      switch (this.drawTool) {
        case 'line':
          this.lines.push(new Line (pathX, pathY, this.strokeWidth, this.color))
          break;
        case 'rect':
          this.rects.push(new Rectangle (pathX, pathY, this.strokeWidth, this.color))
          break;
        case 'ellipse':
          this.ellipses.push(new Circle (pathX, pathY, this.strokeWidth, this.color))
          break;
        default:
          this.paths.push(new Path (pathX, pathY, this.strokeWidth, this.color))
          this.drawPixel(pathX, pathY);        
      }
    },
    onMouseMove (event) {
      if (!this.isDrawing || !this.drawingMode) return;

      let pathX = event.type == 'touchmove' 
        ? event.touches[0].clientX - (this.canvasOffset.x / 2)
        : event.offsetX;
      let pathY = event.type == 'touchmove' 
        ? event.touches[0].clientY - (this.canvasOffset.y / 2)
        : event.offsetY;

      switch (this.drawTool) {
        case 'line':
          this.setupPen(this.context, this.lines[this.lines.length - 1])
          this.lines[this.lines.length - 1].draw(this.context, pathX, pathY);
          break;
        case 'rect':
          this.setupPen(this.context, this.rects[this.rects.length - 1])
          this.rects[this.rects.length - 1].draw(this.context, pathX, pathY);
          break;
        case 'ellipse':
          this.setupPen(this.context, this.ellipses[this.ellipses.length - 1])
          this.ellipses[this.ellipses.length - 1].draw(this.context, pathX, pathY);
          break;
        default:
          this.drawPixel(pathX, pathY);        
      }
    },
    onMouseUp () {
      if (!this.drawingMode) return;

      this.isDrawing = false;
      this.updatePaths();
      if (this.lines.length > 0){
        this.lines[this.lines.length - 1].finish(this.context)
        this.completeLineDrawing()
      }
      if (this.rects.length > 0) {
        this.rects[this.rects.length - 1].finish(this.context)
        this.completeRectDrawing()
      }
      if (this.ellipses.length > 0){
        this.ellipses[this.ellipses.length - 1].finish(this.context)
        this.completeEllipseDrawing()
      }
      if (this.drawTool == 'path') this.completeDrawing();
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
    completeRectDrawing () {
      if (this.rects.length === 0) return;

      let svgPadding = 1 + this.rects[0].lineWidth;
      let svgPathPadding = svgPadding / 2;
      let width = this.rects[0].width + svgPadding;
      let height = this.rects[0].height + svgPadding;
      let xOffset = 0 + svgPathPadding;
      let yOffset = 0 + svgPathPadding;

      var ctx = new C2S(width, height);
      const rect = new Rectangle (xOffset, yOffset, this.rects[0].lineWidth, this.rects[0].strokeStyle);
      rect.draw(ctx, this.rects[0].width + svgPathPadding, this.rects[0].height + svgPathPadding)
      rect.finish(ctx);

      var myRect = ctx.getSerializedSvg(true);
      this.$emit('draw-rect', { 
        svg: myRect, 
        x: this.rects[0].startX, 
        y: this.rects[0].startY, 
        color: this.color });
      this.rects = []; // clear paths
      this.context.clearRect(0, 0, this.width, this.height); // clear canvas
    },
    completeEllipseDrawing () {
      if (this.ellipses.length === 0) return;

      let svgPadding = 1 + this.ellipses[0].lineWidth;
      let svgPathPadding = svgPadding / 2;
      let width = this.ellipses[0].radiusX * 2 + svgPadding;
      let height = this.ellipses[0].radiusY * 2 + svgPadding;
      let x = this.ellipses[0].radiusX * 2 + svgPathPadding;
      let y = this.ellipses[0].radiusY * 2 + svgPathPadding;
      let xOffset = 0 + svgPathPadding;
      let yOffset = 0 + svgPathPadding;

      var ctx = new C2S(width, height);
      const ellipse = new Circle (xOffset, yOffset, this.ellipses[0].lineWidth, this.ellipses[0].strokeStyle);

      ellipse.draw(ctx, x, y);
      ellipse.finish(ctx);

      const myEllipse = ctx.getSerializedSvg(true);

      this.$emit('draw-path', { 
        svg: myEllipse, 
        x: this.ellipses[0].startX - this.ellipses[0].radiusX, 
        y: this.ellipses[0].startY - this.ellipses[0].radiusY, 
        color: this.color });
      this.ellipses = []; // clear paths
      this.context.clearRect(0, 0, this.width, this.height); // clear canvas
    },
    completeLineDrawing () {
      if (this.lines.length === 0) return;

      let svgPadding = 1 + this.lines[0].lineWidth;
      let svgPathPadding = svgPadding / 2;
      let width = this.lines[0].endX - this.lines[0].startX + svgPadding;
      let height = this.lines[0].endY - this.lines[0].startY + svgPadding;
      let endX = this.lines[0].endX - this.lines[0].startX + svgPathPadding;
      let endY = this.lines[0].endY - this.lines[0].startY + svgPathPadding;
      let xOffset = 0 + svgPathPadding;
      let yOffset = 0 + svgPathPadding;

      const ctx = new C2S(width, height);
      const line = new Line (xOffset, yOffset, this.lines[0].lineWidth, this.lines[0].strokeStyle);

      line.draw(ctx, endX, endY);
      line.finish(ctx);
      var myLine = ctx.getSerializedSvg(true);
      this.$emit('draw-path', { 
        svg: myLine, 
        x: this.lines[0].startX, 
        y: this.lines[0].startY, 
        color: this.color });
      this.lines = []; // clear paths
      this.context.clearRect(0, 0, this.width, this.height); // clear canvas
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