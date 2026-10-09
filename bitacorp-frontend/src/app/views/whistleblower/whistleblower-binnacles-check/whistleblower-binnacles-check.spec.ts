import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WhistleblowerBinnaclesCheck } from './whistleblower-binnacles-check';

describe('WhistleblowerBinnaclesCheck', () => {
  let component: WhistleblowerBinnaclesCheck;
  let fixture: ComponentFixture<WhistleblowerBinnaclesCheck>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhistleblowerBinnaclesCheck],
    }).compileComponents();

    fixture = TestBed.createComponent(WhistleblowerBinnaclesCheck);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
