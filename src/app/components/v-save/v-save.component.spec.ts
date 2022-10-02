import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VSaveComponent } from './v-save.component';

describe('VSaveComponent', () => {
  let component: VSaveComponent;
  let fixture: ComponentFixture<VSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VSaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
