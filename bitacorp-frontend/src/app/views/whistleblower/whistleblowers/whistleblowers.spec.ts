import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Whistleblowers } from './whistleblowers';

describe('Whistleblowers', () => {
  let component: Whistleblowers;
  let fixture: ComponentFixture<Whistleblowers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Whistleblowers],
    }).compileComponents();

    fixture = TestBed.createComponent(Whistleblowers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
