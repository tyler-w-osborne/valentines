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
import { FormsModule } from '@angular/forms';
import JSZip from 'jszip';

@Component({
  selector: 'app-valentines-2026',
  imports: [FormsModule],
  templateUrl: './valentines-2026.html',
  styleUrl: './valentines-2026.scss',
})
export class Valentines2026 implements AfterViewInit, OnDestroy {
  constructor() {}

  ngAfterViewInit(): void {
    // this.photobooth_image.src = '/valentines/2026/photobooth.jpg';
    // this.photobooth_image.onload = () => this.Initialize();
    this.happy_valentines_day_hailee.load();
    this.bubble_in_sound.load();
    this.pop_sound.load();
    this.Initialize();
  }

  ngOnDestroy(): void {
    if (this.animationframe_id) {
      cancelAnimationFrame(this.animationframe_id);
    }
  }

  private ngZone = inject(NgZone);

  @HostListener('pointerdown', ['$event'])
  create_heart(event: PointerEvent) {
    // console.log('Heart Created');
    if (!this.is_my_valentine) {
      return;
    }
    const rect = this.canvas_ref.nativeElement.getBoundingClientRect();
    let [mouse_x, mouse_y] = [
      event.clientX - rect.left - 50,
      event.clientY - rect.top - 50,
    ];
    this.bubble_in_sound.play().catch((error) => {
      console.error(
        'Playback failed. Browsers usually require a user click first:',
        error
      );
    });
    this.hearts_map.set(JSON.stringify([mouse_x, mouse_y]), null);
    if (this.auto_remove_placed_hearts) {
      setTimeout(() => {
        this.pop_sound.play().catch((error) => {
          console.error(
            'Playback failed. Browsers usually require a user click first:',
            error
          );
        });
        this.hearts_map.delete(JSON.stringify([mouse_x, mouse_y]));
      }, 2000);
    }
    // if (this.ctx) {
    //   this.ctx.drawImage(this.heart_image, mouse_x, mouse_y);
    // }
  }

  @HostListener('contextmenu', ['$event'])
  stop_right_click_menu(event: MouseEvent) {
    event.preventDefault();
  }

  bubble_in_sound = new Audio('valentines/2026/bubble_in.mp3');
  pop_sound = new Audio('valentines/2026/pop.mp3');
  happy_valentines_day_hailee = new Audio(
    'valentines/2026/happy_valentines_day_hailee.m4a'
  );

  hearts_map = new Map<string, null>();

  @HostListener('window:resize')
  async resize() {
    this.canvas_ref.nativeElement.width =
      this.canvas_ref.nativeElement.clientWidth;
    this.canvas_ref.nativeElement.height =
      this.canvas_ref.nativeElement.clientHeight;
    if (this.particles.length > 0) {
      this.particles.forEach((p) => {
        p.canvas_width = this.canvas_ref.nativeElement.width;
        p.canvas_height = this.canvas_ref.nativeElement.height;
      });
    }
    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = true;
    }
    // this.ctx.drawImage(this.photobooth_image, 0, 0);
  }

  @ViewChild('heart_pink') heart_pink_ref!: ElementRef<SVGElement>;
  @ViewChild('heart_red') heart_red_ref!: ElementRef<SVGElement>;
  @ViewChild('heart_cyan') heart_cyan_ref!: ElementRef<SVGElement>;
  @ViewChild('canvas') canvas_ref!: ElementRef<HTMLCanvasElement>;

  // controls
  is_my_valentine = false;
  color_cycle = false;
  white_black: 'white' | 'black' = 'black';
  set_white_black() {
    this.color_cycle = false;
    if (this.white_black === 'white') {
      this.white_black = 'black';
      this.ctx.fillStyle = `hsl(0, 100%, 0%)`;
      return;
    }
    this.white_black = 'white';
    this.ctx.fillStyle = `hsl(0, 100%, 100%)`;
  }
  auto_remove_placed_hearts = true;
  async export_images() {
    const zip = new JSZip();
    const folder = zip.folder('');

    let urls = [
      'caught_sleeping.png',
      'couple_that_fights.jpg',
      'happy_tears.jpg',
      'photobooth.jpg',
      'too_bright.jpg',
      'work_my_charms.jpg',
      'zebra_ride.jpg',
      'valentines_theme.jpg',
      'mop.jpg',
      'funny.png',
    ];
    // Create an array of fetch promises
    const downloadPromises = urls.map(async (imageName) => {
      const url = `valentines/2026/${imageName}`;
      const response = await fetch(url);
      const blob = await response.blob();

      // Extract filename from URL (e.g., "assets/cat.jpg" -> "cat.jpg")
      const fileName = url.substring(url.lastIndexOf('/') + 1);

      // Add file to the zip folder
      folder?.file(fileName, blob);
    });

    // Wait for all images to be fetched and added
    await Promise.all(downloadPromises);

    // Generate the zip file and trigger download
    const content = await zip.generateAsync({ type: 'blob' });
    // 2. Create a temporary anchor element
    const url = window.URL.createObjectURL(content);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'valentines_2026_images.zip'; // The name the file will save as

    // 3. Trigger the download and cleanup
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
  export_collage() {
    this.canvas_ref.nativeElement.toBlob((blob) => {
      if (!blob) {
        console.error('Canvas is empty or invalid');
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = 'valentines_2026_collage';

      // 3. Trigger and cleanup
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  async Initialize() {
    await this.load_assets();

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
        )
      );
    }
  }

  start_runner() {
    this.is_my_valentine = true;
    this.happy_valentines_day_hailee.play();
    let background_color = 0; // 0-360 for hsl hue
    const runner = () => {
      this.ctx.clearRect(
        0,
        0,
        this.canvas_ref.nativeElement.width,
        this.canvas_ref.nativeElement.height
      );
      if (this.color_cycle) {
        this.ctx.fillStyle = `hsl(${background_color}, 100%, 50%)`;
        // console.log(this.ctx.fillStyle);
        // this.canvas_ref.nativeElement.style.backgroundColor = `hsl(${background_color}, 100%, 50%)`;
        background_color++;
        if (background_color > 720) {
          background_color = 0;
        }
      }
      this.ctx.fillRect(
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
      for (const instance of this.hearts_map) {
        const coords: [number, number] = JSON.parse(instance[0]);
        this.ctx.drawImage(this.red_heart_image, coords[0], coords[1]);
        this.ctx.drawImage(
          this.pink_heart_image,
          coords[0] + 25,
          coords[1] - 35
        );
        this.ctx.drawImage(this.cyan_heart_image, coords[0], coords[1] - 70);
      }
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
      { image: 'happy_tears.jpg', dx: 30, dy: 5, scale: 0.5 },
      { image: 'photobooth.jpg', dx: 0, dy: 0, scale: 1 }, // done
      { image: 'too_bright.jpg', dx: 15, dy: 65, scale: 0.3 },
      { image: 'work_my_charms.jpg', dx: 50, dy: 50, scale: 0.4 },
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
      _image.src = `valentines/2026/${asset_list[i].image}`;
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
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      this.particles[i].draw();
    }
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
  x: number;
  y: number;
  velocity: number;
  size: number;
  selected_heart: HTMLImageElement;
}
