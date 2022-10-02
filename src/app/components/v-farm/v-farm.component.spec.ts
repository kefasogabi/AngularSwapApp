import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VFarmComponent } from './v-farm.component';

describe('VFarmComponent', () => {
  let component: VFarmComponent;
  let fixture: ComponentFixture<VFarmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VFarmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VFarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
