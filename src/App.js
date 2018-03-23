import raf from 'raf';

const ALPHA_VALUE = .2;
const SPRING_TIGHTNESS = .1;
const MAX_SHIFT = 4;
const SHIFT_DURATION = 2000;
const HISTORY_LENGTH = 2000;

export default class App {
  // just a silly canvas draw, want to do something more fun with this
  lastTicks = 0;
  history = [];
  point = { x: 0, y: 0, dx: 0, dy: 0, ddx: 0, ddy: 0 };
  cursor = { x: 0, y: 0 };
  hue = this.randomHue();
  hueShift = this.randomShift();
  shiftLife = SHIFT_DURATION;
 
 constructor (window) {
   this.window = window;
   this.bg = document.getElementById('bg');
   this.aspect = window.innerHeight / window.innerWidth;
   const canvas = this.canvas = document.createElement('canvas');
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
   this.bg.appendChild(this.canvas);
   this.lastTicks = 0;

   const { cursor, point } = this;
   cursor.x = canvas.width / 2;
   cursor.y = canvas.height / 2;
   point.x = cursor.x;
   point.y = cursor.y;

   this.bindListeners();
  }

  bindListeners() {
    const { canvas, cursor, window } = this;
    window.addEventListener('mousemove', (event) => {
      cursor.x = event.pageX;
      cursor.y = event.pageY;
    });

    window.addEventListener('touchmove', (event) => {
      const touch = event.touches[0];
      cursor.x = touch.pageX;
      cursor.y = touch.pageY;
    });

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight; 
      this.drawHistory();
    });
  }

  start () {
    this.render(0);
  }

  render = (ticks) => {
    const { canvas, hue, hueShift, cursor, point } = this;
    const delta = ticks - this.lastTicks;
    this.lastTicks = ticks;

    raf(this.render);
    
    var distx = (cursor.x - point.x) - point.dx;
    var disty = (cursor.y - point.y) - point.dy;
    point.ddx = (distx) * SPRING_TIGHTNESS;
    point.ddy = (disty) * SPRING_TIGHTNESS;
    point.dx += point.ddx;
    point.dy += point.ddy;
    point.x += point.dx;
    point.y += point.dy;

    // if cursor stops or leaves, don't waste cylces adding to shift life or add to history.
    if (Math.abs(point.dx) < 1 && Math.abs(point.dy) < 1) {
      return;
    }

    this.drawLine(hue, point);
    this.history.push({ hue: {...hue}, point: {...point} });
    this.history = this.history.slice(-HISTORY_LENGTH);

    this.hue = this.shiftHue(hue, hueShift);
    this.shiftLife -= delta;
    if (this.shiftLife <= 0) {
      console.log('sl', delta, this.hueShift);
      this.shiftLife = SHIFT_DURATION;
      this.hueShift = this.randomShift();
    }
  }

  drawHistory () {
    this.history.forEach(({ hue, point }) => {
      this.drawLine(hue, point)
    })
  }

  drawLine (hue, point) {
    const { canvas } = this;
    const context = canvas.getContext('2d');
    context.strokeStyle = `hsla(${hue}, 100%, 50%, ${ALPHA_VALUE})`;
    context.lineWidth = Math.max(1, Math.abs(point.dx + point.dy) / 2);
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.lineTo(point.x - point.dx, point.y - point.dy);
    context.stroke();
  }

  randomHue () {
    return Math.round(Math.random() * 360);
  }

  randomShift () {
    return Math.random() * (MAX_SHIFT * 2) - MAX_SHIFT;
  }

  shiftHue (hue, shift) {
    return hue + shift;
  }
}
