import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VSwapComponent } from './v-swap.component';

describe('VSwapComponent', () => {
  let component: VSwapComponent;
  let fixture: ComponentFixture<VSwapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VSwapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VSwapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
