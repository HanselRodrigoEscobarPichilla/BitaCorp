import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagerProfile } from './manager-profile';

describe('ManagerProfile', () => {
  let component: ManagerProfile;
  let fixture: ComponentFixture<ManagerProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
