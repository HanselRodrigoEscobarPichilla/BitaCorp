import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WhistleblowerBinnacles } from './whistleblower-binnacles';

describe('WhistleblowerBinnacles', () => {
  let component: WhistleblowerBinnacles;
  let fixture: ComponentFixture<WhistleblowerBinnacles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhistleblowerBinnacles],
    }).compileComponents();

    fixture = TestBed.createComponent(WhistleblowerBinnacles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
