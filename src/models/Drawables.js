class Drawable {
  constructor (lineWidth, strokeStyle) {
    this.lineWidth = lineWidth;
    this.strokeStyle = strokeStyle;
    
    this.svgPadding = 1 + this.lineWidth;
    this.svgPathPadding = this.svgPadding / 2;
  }

  setupPen (ctx) {
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.lineJoin = "round";
  }
}

export class Path extends Drawable {
  constructor (initialX, initialY, strokeWidth, color) {
    super(strokeWidth, color);

    this.pixels = [];
    this.smallestX = initialX;
    this.largestX = initialX;
    this.smallestY = initialY;
    this.largestY = initialY;
  }

  draw (ctx, x, y) {
    if (
      this.pixels.length > 0 &&
      this.pixels[this.pixels.length - 1].x === x &&
      this.pixels[this.pixels.length - 1].y === y) return;
    
    this.pixels.push({ x: x, y: y });

    const currentPixelIndex = this.pixels.length - 1;

    if (currentPixelIndex == 0) {
      ctx.beginPath();
      super.setupPen(ctx);
      ctx.moveTo(
        this.pixels[currentPixelIndex].x,
        this.pixels[currentPixelIndex].y);
      ctx.lineTo(
        this.pixels[currentPixelIndex].x,
        this.pixels[currentPixelIndex].y);
      ctx.stroke();
    } else {
      ctx.lineTo(
        this.pixels[currentPixelIndex].x,
        this.pixels[currentPixelIndex].y);
      ctx.stroke();
    }

    this.smallestX = x < this.smallestX 
        ? x 
        : this.smallestX;
    this.largestX = x > this.largestX 
        ? x 
        : this.largestX;
    this.smallestY = y < this.smallestY 
        ? y 
        : this.smallestY;
    this.largestY = y > this.largestY 
        ? y 
        : this.largestY;
  }

  createMock (ctx, smallestX, smallestY) {
    let xOffset = 0 - smallestX + this.svgPathPadding;
    let yOffset = 0 - smallestY + this.svgPathPadding;
    this.setupPen(ctx);
    this.pixels.forEach((p, i) => {
      if (i == 0) {
        ctx.beginPath();
        ctx.moveTo(p.x + xOffset, p.y + yOffset);
        ctx.stroke();
      } else if (i !== this.pixels.length - 1) {
        ctx.lineTo(p.x + xOffset, p.y + yOffset);
        ctx.stroke();
      } else {
        ctx.lineTo(p.x + xOffset, p.y + yOffset);
        ctx.stroke();
        ctx.closePath();
      }
    })
  }
}

export class Line extends Drawable {
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

  createMock (ctx, endX, endY) {
    let xOffset = 0 + this.svgPathPadding;
    let yOffset = 0 + this.svgPathPadding;
    const line = new Line (xOffset, yOffset, this.lineWidth, this.strokeStyle);
  
    line.draw(ctx, endX, endY);
    line.finish(ctx);
  }
}

export class Rectangle extends Drawable {
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

  createMock (ctx) {
    let xOffset = 0 + this.svgPathPadding;
    let yOffset = 0 + this.svgPathPadding;

    const rect = new Rectangle (xOffset, yOffset, this.lineWidth, this.strokeStyle);
    rect.draw(ctx, this.width + this.svgPathPadding, this.height + this.svgPathPadding)
    rect.finish(ctx);
  }
}

export class Circle extends Drawable {
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

  createMock (ctx, x, y) {
    let xOffset = 0 + this.svgPathPadding;
    let yOffset = 0 + this.svgPathPadding;

    const ellipse = new Circle (xOffset, yOffset, this.lineWidth, this.strokeStyle);

    ellipse.draw(ctx, x, y);
    ellipse.finish(ctx);
  }
}