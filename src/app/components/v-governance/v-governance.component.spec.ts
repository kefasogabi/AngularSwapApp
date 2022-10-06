import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VGovernanceComponent } from './v-governance.component';

describe('VGovernanceComponent', () => {
  let component: VGovernanceComponent;
  let fixture: ComponentFixture<VGovernanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VGovernanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VGovernanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
