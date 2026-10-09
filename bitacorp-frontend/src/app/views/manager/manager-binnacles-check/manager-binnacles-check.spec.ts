import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagerBinnaclesCheck } from './manager-binnacles-check';

describe('ManagerBinnaclesCheck', () => {
  let component: ManagerBinnaclesCheck;
  let fixture: ComponentFixture<ManagerBinnaclesCheck>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerBinnaclesCheck],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerBinnaclesCheck);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
