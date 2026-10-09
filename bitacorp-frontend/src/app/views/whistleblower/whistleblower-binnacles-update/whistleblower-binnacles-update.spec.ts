import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WhistleblowerBinnaclesUpdate } from './whistleblower-binnacles-update';

describe('WhistleblowerBinnaclesUpdate', () => {
  let component: WhistleblowerBinnaclesUpdate;
  let fixture: ComponentFixture<WhistleblowerBinnaclesUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhistleblowerBinnaclesUpdate],
    }).compileComponents();

    fixture = TestBed.createComponent(WhistleblowerBinnaclesUpdate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
