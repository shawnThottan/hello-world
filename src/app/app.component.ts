import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title =  'hello-world';
  canvas: any;
  ctx: any;
  pos: any;
  clear = false;

  constructor(private router: ActivatedRoute) {
    this.router.queryParams.subscribe(params => {
      this.clear = params.clear === 'true' ? true : false;

      // retrieves the image from localstorage
      const dataURL = localStorage.getItem('draw');
      if (dataURL) {
        const img = new Image();
        img.src = dataURL;
        img.onload = () => {
          if (!this.clear) {
            this.ctx.drawImage(img, 0, 0);
          } else {
            localStorage.removeItem('draw');
          }
        };
      }
    });
  }

  ngOnInit() {
    // set canvas id to variable
    this.canvas = document.getElementById('draw') as any;

    // resizes the canvas
    this.ctx = this.canvas.getContext('2d');
    window.addEventListener('resize', this.resize);
    this.resize();

    // add event listeners to trigger on different mouse events
    document.addEventListener('mousemove', this.draw);
    document.addEventListener('touchmove', this.draw);

    document.addEventListener('mousedown', this.setPosition);
    document.addEventListener('touchstart', this.setPosition);

    document.addEventListener('mouseenter', this.setPosition);
    document.addEventListener('touchend', this.setPosition);
  }

  resize = () => {
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
  }

  // new position from mouse events
  setPosition = (e) => {
    if (!this.pos) {
      this.pos = {
        x: 0,
        y: 0,
      };
    }

    this.pos.x = e.clientX || e.touches[0].pageX;
    this.pos.y = e.clientY || e.touches[0].pageY;
  }

  draw = (e) => {
    // if (e.buttons !== 1 && !e.touches[0]) { return; } // if mouse is not clicked, do not go further

    if (!this.pos) {
      this.setPosition(e);
    }

    const color = '#FFA400';

    this.ctx.beginPath(); // begin the drawing path

    // line properties
    this.ctx.lineWidth = 50; // width of line
    this.ctx.lineCap = 'round'; // rounded end cap
    this.ctx.strokeStyle = color; // hex color of line

    // draw line
    this.ctx.moveTo(this.pos.x, this.pos.y); // from position
    this.setPosition(e);
    this.ctx.lineTo(this.pos.x, this.pos.y); // to position

    this.ctx.stroke(); // draw it!

    // saves the image onto the localstorage
    localStorage.setItem('draw', this.canvas.toDataURL());
  }
}
