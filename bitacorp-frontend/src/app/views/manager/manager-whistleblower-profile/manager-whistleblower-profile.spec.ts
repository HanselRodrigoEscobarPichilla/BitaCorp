import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagerWhistleblowerProfile } from './manager-whistleblower-profile';

describe('ManagerWhistleblowerProfile', () => {
  let component: ManagerWhistleblowerProfile;
  let fixture: ComponentFixture<ManagerWhistleblowerProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerWhistleblowerProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerWhistleblowerProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
