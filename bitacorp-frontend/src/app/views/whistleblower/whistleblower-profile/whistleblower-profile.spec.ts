import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WhistleblowerProfile } from './whistleblower-profile';

describe('WhistleblowerProfile', () => {
  let component: WhistleblowerProfile;
  let fixture: ComponentFixture<WhistleblowerProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhistleblowerProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(WhistleblowerProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
