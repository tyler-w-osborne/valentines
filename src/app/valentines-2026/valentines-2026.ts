import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-valentines-2026',
  imports: [],
  templateUrl: './valentines-2026.html',
  styleUrl: './valentines-2026.scss',
})
export class Valentines2026 implements AfterViewInit {
  constructor() {}

  ngAfterViewInit(): void {
    this.valentines_image.src = 'valentines_2026.jpg';
    this.Initialize();
  }

  @HostListener('click', ['$event'])
  create_heart(event: MouseEvent) {
    console.log('Heart Created');
    const rect = this.canvas_ref.nativeElement.getBoundingClientRect();
    const [mouse_x, mouse_y] = [
      event.clientX - rect.left - 50,
      event.clientY - rect.top - 50,
    ];
    if (this.ctx) {
      this.ctx.drawImage(this.heart_image, mouse_x, mouse_y);
    }
  }

  @HostListener('resize')
  resize() {
    console.log('resizing...');
    this.canvas_ref.nativeElement.width =
      this.canvas_ref.nativeElement.clientWidth;
    this.canvas_ref.nativeElement.height =
      this.canvas_ref.nativeElement.clientHeight;
  }

  @ViewChild('heart') heart_ref!: ElementRef<SVGElement>;
  @ViewChild('canvas') canvas_ref!: ElementRef<HTMLCanvasElement>;

  Initialize() {
    this.ctx = this.canvas_ref.nativeElement.getContext('2d');
    this.resize();
    const heart_string = new XMLSerializer().serializeToString(
      this.heart_ref.nativeElement
    );
    this.heart_image.src =
      'data:image/svg+xml;charset=utf8,' + encodeURIComponent(heart_string);

    for (let i = 0; i < this.particle_count; i++) {
      this.particles.push(
        new Particle(
          [
            this.canvas_ref.nativeElement.width,
            this.canvas_ref.nativeElement.height,
          ],
          this.ctx
        )
      );
    }
    this.ctx!.drawImage(this.valentines_image, 0, 0);
    this.animate();
  }

  animate() {
    if (!this.ctx) {
      return;
    }
    this.ctx!.globalAlpha = 0.05;
    this.ctx!.fillStyle = 'rgb(0, 0, 0)';
    this.ctx!.fillRect(
      0,
      0,
      this.canvas_ref.nativeElement.width,
      this.canvas_ref.nativeElement.height
    );
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      this.particles[i].draw();
    }
    requestAnimationFrame(this.animate);
  }

  ctx: CanvasRenderingContext2D | null = null;
  heart_image = new Image();
  valentines_image = new Image();

  particles: Particle[] = [];
  particle_count: number = 5000;
}

class Particle {
  constructor(
    canvas_dimensions: [number, number],
    canvas_context: CanvasRenderingContext2D | null
  ) {
    this.canvas_width = canvas_dimensions[0];
    this.canvas_height = canvas_dimensions[1];
    this.ctx = canvas_context;
    this.x = Math.random() * this.canvas_width;
    this.y = 0;
    this.speed = 0;
    this.velocity = Math.random() * 3.5;
    this.size = Math.random() * 1.5 + 1;
  }
  update() {
    this.y += this.velocity;
    if (this.y >= this.canvas_height) {
      this.y = 0;
      this.x = Math.random() * this.canvas_width;
    }
  }
  draw() {
    if (!this.ctx) {
      return;
    }
    this.ctx.beginPath();
    this.ctx.fillStyle = 'white';
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  canvas_width: number;
  canvas_height: number;
  ctx: CanvasRenderingContext2D | null;
  x: number;
  y: number;
  speed: number;
  velocity: number;
  size: number;
}
