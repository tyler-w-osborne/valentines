import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Valentines2026 } from './valentines-2026';

describe('Valentines2026', () => {
  let component: Valentines2026;
  let fixture: ComponentFixture<Valentines2026>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Valentines2026]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Valentines2026);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
