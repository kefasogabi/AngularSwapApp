import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnairaComponent } from './enaira.component';

describe('EnairaComponent', () => {
  let component: EnairaComponent;
  let fixture: ComponentFixture<EnairaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnairaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnairaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
