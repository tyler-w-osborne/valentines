import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-valentines-2026',
  imports: [],
  templateUrl: './valentines-2026.html',
  styleUrl: './valentines-2026.scss',
})
export class Valentines2026 implements AfterViewInit, OnDestroy {
  constructor() {}

  ngAfterViewInit(): void {
    this.photobooth_image.src = '/valentines/2026/photobooth.jpg';
    this.photobooth_image.onload = () => this.Initialize();
    // this.Initialize();
  }

  ngOnDestroy(): void {
    if (this.animationframe_id) {
      cancelAnimationFrame(this.animationframe_id);
    }
  }

  private ngZone = inject(NgZone);

  @HostListener('click', ['$event'])
  create_heart(event: MouseEvent) {
    console.log('Heart Created');
    const rect = this.canvas_ref.nativeElement.getBoundingClientRect();
    const [mouse_x, mouse_y] = [
      event.clientX - rect.left - 50,
      event.clientY - rect.top - 50,
    ];
    this.hearts_map.set([mouse_x, mouse_y], null);
    // if (this.ctx) {
    //   this.ctx.drawImage(this.heart_image, mouse_x, mouse_y);
    // }
  }

  hearts_map = new Map<[number, number], null>();

  @HostListener('resize')
  resize() {
    console.log('resizing...');
    this.canvas_ref.nativeElement.width =
      this.canvas_ref.nativeElement.clientWidth;
    this.canvas_ref.nativeElement.height =
      this.canvas_ref.nativeElement.clientHeight;
    // this.ctx.drawImage(this.photobooth_image, 0, 0);
  }

  @ViewChild('heart_pink') heart_pink_ref!: ElementRef<SVGElement>;
  @ViewChild('heart_red') heart_red_ref!: ElementRef<SVGElement>;
  @ViewChild('canvas') canvas_ref!: ElementRef<HTMLCanvasElement>;

  async Initialize() {
    const context2d = this.canvas_ref.nativeElement.getContext('2d');
    if (context2d) {
      this.ctx = context2d;
    }
    this.resize();
    const heart_pink_string = new XMLSerializer().serializeToString(
      this.heart_pink_ref.nativeElement
    );
    this.pink_heart_image.src =
      'data:image/svg+xml;charset=utf8,' +
      encodeURIComponent(heart_pink_string);
    const heart_red_string = new XMLSerializer().serializeToString(
      this.heart_red_ref.nativeElement
    );
    this.red_heart_image.src =
      'data:image/svg+xml;charset=utf8,' + encodeURIComponent(heart_red_string);
    if (!this.ctx) {
      return;
    }
    await this.load_assets();
    const modifier =
      this.canvas_ref.nativeElement.height / this.photobooth_image.height;
    for (let i = 0; i < this.particle_count; i++) {
      this.particles.push(
        new Particle(
          [
            this.canvas_ref.nativeElement.width,
            this.canvas_ref.nativeElement.height,
          ],
          this.ctx,
          [this.pink_heart_image, this.red_heart_image]
          // [
          //   this.photobooth_image.width * modifier,
          //   this.canvas_ref.nativeElement.height,
          // ]
        )
      );
    }

    const runner = () => {
      this.ctx.clearRect(
        0,
        0,
        this.canvas_ref.nativeElement.width,
        this.canvas_ref.nativeElement.height
      );
      this.ctx.drawImage(
        this.photobooth_image,
        0,
        0,
        this.photobooth_image.width * modifier,
        this.canvas_ref.nativeElement.height
      );
      this.animate();
      this.animationframe_id = requestAnimationFrame(runner);
    };
    this.ngZone.runOutsideAngular(() => {
      runner();
    });
  }

  animationframe_id?: number;

  // asset_map = new Map<[number, number], HTMLImageElement>();
  asset_map: HTMLImageElement[] = [];
  async load_assets() {
    const asset_list: string[] = [];
    for (const asset in asset_list) {
      const _image = new Image();
      _image.src = `/valentines/2026/${asset}`;
      await _image.decode();
      this.asset_map.push(_image);
    }
    console.log('assets loaded...');
  }

  animate() {
    console.log('animating');
    // this.ctx.globalAlpha = 0.05;
    // this.ctx.fillStyle = 'rgb(0, 0, 0)';
    // this.ctx.fillRect(
    //   0,
    //   0,
    //   this.canvas_ref.nativeElement.width,
    //   this.canvas_ref.nativeElement.height
    // );
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      this.particles[i].draw();
    }
    // requestAnimationFrame(() => this.animate);
  }

  private ctx!: CanvasRenderingContext2D;
  pink_heart_image = new Image();
  red_heart_image = new Image();
  photobooth_image = new Image();

  particles: Particle[] = [];
  particle_count: number = 50;
}

class Particle {
  constructor(
    canvas_dimensions: [number, number],
    canvas_context: CanvasRenderingContext2D,
    heart_images: HTMLImageElement[]
    // photobooth_image_size: [number, number]
  ) {
    this.canvas_width = canvas_dimensions[0];
    this.canvas_height = canvas_dimensions[1];
    this.ctx = canvas_context;
    this.size = Math.random() * 1.1 + 1;
    this.x = Math.random() * this.canvas_width;
    this.y = -500;
    this.velocity = Math.random() * 3.5;
    this.heart_images = heart_images;
    // this.photobooth_image_size = photobooth_image_size;
  }
  update() {
    this.y += this.velocity;
    if (this.y >= this.canvas_height) {
      this.size = Math.random() * 1.1 + 1;
      this.x = Math.random() * this.canvas_width;
      this.y = -500;
      this.velocity = Math.random() * 3.5;
    }
  }
  draw() {
    // this.ctx.beginPath();
    // this.ctx.fillStyle = 'white';
    // this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    // this.ctx.fill();
    const selected_heart =
      this.heart_images[
        Math.floor(Math.random() * this.heart_images.length - 1)
      ];
    this.ctx.drawImage(
      selected_heart,
      this.x,
      this.y,
      selected_heart.width * this.size,
      selected_heart.height * this.size
    );
    console.log('particle drawn');
  }

  canvas_width: number;
  canvas_height: number;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  velocity: number;
  size: number;
  heart_images: HTMLImageElement[];
  // photobooth_image_size: [number, number];
}
