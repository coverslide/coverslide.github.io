import raf from 'raf';

const ALPHA_VALUE = .2;
const SPRING_TIGHTNESS = .1;
const MAX_SHIFT = 50;
const SHIFT_DURATION = 60;
const HISTORY_LENGTH = 1000;

export default class App {
  // just a silly canvas draw, want to do something more fun with this
  lastTicks = 0;
  history = [];
  point = { x: 0, y: 0, dx: 0, dy: 0, ddx: 0, ddy: 0 };
  cursor = { x: 0, y: 0 };
  color = this.randomColors();
  colorShift = this.randomShifts();
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
    const { canvas, color, colorShift, cursor, point } = this;
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

    this.drawLine(color, point);
    this.history.push({ color: {...color}, point: {...point} });
    this.history = this.history.slice(-HISTORY_LENGTH);

    this.color = this.shiftColors(color, colorShift);
    this.shiftLife -= delta;
    if (this.shiftLife <= 0) {
      this.shiftLife = SHIFT_DURATION;
      this.colorShift = this.randomShifts();
    }
  }

  drawHistory () {
    this.history.forEach(({ color, point }) => {
      this.drawLine(color, point)
    })
  }

  randomColors () {
    return [
      this.randomColor(),
      this.randomColor(),
      this.randomColor(),
    ];
  }

  drawLine (color, point) {
    const { canvas } = this;
    const context = canvas.getContext('2d');
    context.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${ALPHA_VALUE})`;
    context.lineWidth = Math.abs(point.dx + point.dy) / 2;
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.lineTo(point.x - point.dx, point.y - point.dy);
    context.stroke();
  }

  randomColor () {
    return Math.round(Math.random() * 255);
  }

  randomShifts () {
    return [
      this.randomShift(),
      this.randomShift(),
      this.randomShift(),
    ]
  }

  randomShift () {
    return Math.round(Math.random() * (MAX_SHIFT * 2) - MAX_SHIFT);
  }

  shiftColors (color, shifts) {
    return [
      this.shiftColor(color[0], shifts[0]),
      this.shiftColor(color[1], shifts[1]),
      this.shiftColor(color[2], shifts[2]),
    ]
  }

  shiftColor (color, shift) {
    return Math.max(0, Math.min(255, color + shift));
  }
}
