import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VPegSwapComponent } from './v-peg-swap.component';

describe('VPegSwapComponent', () => {
  let component: VPegSwapComponent;
  let fixture: ComponentFixture<VPegSwapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VPegSwapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VPegSwapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
