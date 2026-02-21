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
    // this.photobooth_image.src = '/valentines/2026/photobooth.jpg';
    // this.photobooth_image.onload = () => this.Initialize();
    this.Initialize();
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
  async resize() {
    console.log('resizing...');
    this.canvas_ref.nativeElement.width =
      this.canvas_ref.nativeElement.clientWidth;
    this.canvas_ref.nativeElement.height =
      this.canvas_ref.nativeElement.clientHeight;
    // this.ctx.drawImage(this.photobooth_image, 0, 0);
    await this.load_assets();
  }

  @ViewChild('heart_pink') heart_pink_ref!: ElementRef<SVGElement>;
  @ViewChild('heart_red') heart_red_ref!: ElementRef<SVGElement>;
  @ViewChild('heart_cyan') heart_cyan_ref!: ElementRef<SVGElement>;
  @ViewChild('canvas') canvas_ref!: ElementRef<HTMLCanvasElement>;

  async Initialize() {
    const context2d = this.canvas_ref.nativeElement.getContext('2d');
    if (context2d) {
      this.ctx = context2d;
    }
    this.resize();
    // pink
    const heart_pink_string = new XMLSerializer().serializeToString(
      this.heart_pink_ref.nativeElement
    );
    this.pink_heart_image.src =
      'data:image/svg+xml;charset=utf8,' +
      encodeURIComponent(heart_pink_string);
    // red
    const heart_red_string = new XMLSerializer().serializeToString(
      this.heart_red_ref.nativeElement
    );
    this.red_heart_image.src =
      'data:image/svg+xml;charset=utf8,' + encodeURIComponent(heart_red_string);
    // cyan
    const heart_cyan_string = new XMLSerializer().serializeToString(
      this.heart_cyan_ref.nativeElement
    );
    this.cyan_heart_image.src =
      'data:image/svg+xml;charset=utf8,' +
      encodeURIComponent(heart_cyan_string);
    if (!this.ctx) {
      return;
    }
    // const modifier =
    //   this.canvas_ref.nativeElement.height / this.photobooth_image.height;
    for (let i = 0; i < this.particle_count; i++) {
      this.particles.push(
        new Particle(
          [
            this.canvas_ref.nativeElement.width,
            this.canvas_ref.nativeElement.height,
          ],
          this.ctx,
          [this.pink_heart_image, this.red_heart_image, this.cyan_heart_image]
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
      for (let i = 0; i < this.asset_map.size; i++) {
        const value = this.asset_map.get(i)!;
        const width =
          value.image.width *
          (this.canvas_ref.nativeElement.height / value.image.height) *
          value.scale;
        const height = this.canvas_ref.nativeElement.height * value.scale;
        this.ctx.drawImage(
          value.image,
          value.dx === 100
            ? this.canvas_ref.nativeElement.width - width
            : (value.dx / 100) * this.canvas_ref.nativeElement.width,
          value.dy === 100
            ? this.canvas_ref.nativeElement.height - height
            : (value.dy / 100) * this.canvas_ref.nativeElement.height,
          width,
          height
        );
      }
      // // photobooth
      // this.ctx.drawImage(
      //   photobooth,
      //   0,
      //   0,
      //   photobooth.width *
      //     (this.canvas_ref.nativeElement.height / photobooth.height),
      //   this.canvas_ref.nativeElement.height
      // );
      // // zebra_ride
      // // fix width and height later
      // this.ctx.drawImage(
      //   zebra_ride,
      //   this.canvas_ref.nativeElement.width - zebra_ride.width / 5,
      //   0,
      //   zebra_ride.width / 5,
      //   zebra_ride.height / 5
      // );
      // // couple_that_fights
      // // fix width and height later
      // this.ctx.drawImage(
      //   couple_that_fights,
      //   this.canvas_ref.nativeElement.width -
      //     couple_that_fights.width / 5,
      //   zebra_ride.height / 5,
      //   couple_that_fights.width / 5,
      //   couple_that_fights.height / 5
      // );
      this.animate();
      this.animationframe_id = requestAnimationFrame(runner);
    };
    this.ngZone.runOutsideAngular(() => {
      runner();
    });
  }

  animationframe_id?: number;

  // asset_map = new Map<[number, number], HTMLImageElement>();
  asset_map = new Map<
    number,
    {
      image: HTMLImageElement;
      dx: number;
      dy: number;
      scale: number;
    }
  >();
  async load_assets() {
    const asset_list: {
      image: string;
      dx: number;
      dy: number;
      scale: number;
    }[] = [
      { image: 'caught_sleeping.png', dx: 400, dy: 0, scale: 0.4 },
      {
        image: 'couple_that_fights.jpg',
        dx: 70,
        dy: 10,
        scale: 0.5,
      },
      { image: 'happy_tears.jpg', dx: 30, dy: 5, scale: .5 },
      { image: 'photobooth.jpg', dx: 0, dy: 0, scale: 1 }, // done
      { image: 'too_bright.jpg', dx: 15, dy: 65, scale: .3 },
      { image: 'work_my_charms.jpg', dx: 50, dy: 50, scale: .4 },
      {
        image: 'zebra_ride.jpg',
        dx: 100,
        dy: 0,
        scale: 0.35,
      }, // done
      {
        image: 'valentines_theme.jpg',
        dx: 100,
        dy: 100,
        scale: 0.3,
      }, // done
      {
        image: 'mop.jpg',
        dx: 30,
        dy: 100,
        scale: 0.3,
      }, // done
      {
        image: 'funny.png',
        dx: 15,
        dy: 20,
        scale: 0.25,
      }, // done
    ];
    for (let i = 0; i < asset_list.length; i++) {
      const _image = new Image();
      _image.src = `/valentines/2026/${asset_list[i].image}`;
      await _image.decode();
      let value = {
        image: _image,
        dx: asset_list[i].dx,
        dy: asset_list[i].dy,
        scale: asset_list[i].scale,
      };
      this.asset_map.set(i, value);
    }
    console.log('assets loaded...');
  }

  animate() {
    // console.log('animating');
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
  cyan_heart_image = new Image();

  // caught_sleeping_image = new Image();
  // couple_that_fights_image = new Image();
  // happy_tears_image = new Image();
  // photobooth_image = new Image();
  // too_bright_image = new Image();
  // work_my_charms_image = new Image();
  // zebra_ride_image = new Image();

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
    this.y = Math.floor(Math.random() * (-500 - -750 + 1)) + -750;
    this.velocity = Math.random() * 3.5;
    this.selected_heart =
      heart_images[Math.floor(Math.random() * heart_images.length)];
    // this.photobooth_image_size = photobooth_image_size;
  }
  update() {
    this.y += this.velocity;
    if (this.y >= this.canvas_height) {
      this.size = Math.random() * 1.1 + 1;
      this.x = Math.random() * this.canvas_width;
      this.y = Math.floor(Math.random() * (-500 - -750 + 1)) + -750;
      this.velocity = Math.random() * 2.5 + 1;
    }
  }
  draw() {
    // this.ctx.beginPath();
    // this.ctx.fillStyle = 'white';
    // this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    // this.ctx.fill();
    this.ctx.drawImage(
      this.selected_heart,
      this.x,
      this.y,
      this.selected_heart.width * this.size,
      this.selected_heart.height * this.size
    );
    // console.log('particle drawn');
  }

  canvas_width: number;
  canvas_height: number;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  velocity: number;
  size: number;
  selected_heart: HTMLImageElement;
  // photobooth_image_size: [number, number];
}

class Manual_Heart {
  constructor(
    canvas_dimensions: [number, number],
    canvas_context: CanvasRenderingContext2D
  ) {
    this.canvas_width = canvas_dimensions[0];
    this.canvas_height = canvas_dimensions[1];
    this.ctx = canvas_context;
  }
  update() {
    this.y -= 10;
    if (this.y >= this.canvas_height) {
      this.x = Math.random() * this.canvas_width;
      this.y = Math.floor(Math.random() * (-500 - -750 + 1)) + -750;
    }
  }
  draw() {
    // this.ctx.beginPath();
    // this.ctx.fillStyle = 'white';
    // this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    // this.ctx.fill();
    this.ctx.drawImage(
      this.selected_heart,
      this.x,
      this.y,
      this.selected_heart.width * this.size,
      this.selected_heart.height * this.size
    );
  }

  canvas_width: number;
  canvas_height: number;
  ctx: CanvasRenderingContext2D;
}
