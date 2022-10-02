import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VStakeComponent } from './v-stake.component';

describe('VStakeComponent', () => {
  let component: VStakeComponent;
  let fixture: ComponentFixture<VStakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VStakeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VStakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
