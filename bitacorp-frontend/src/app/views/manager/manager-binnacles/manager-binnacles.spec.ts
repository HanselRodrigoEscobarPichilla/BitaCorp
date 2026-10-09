import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagerBinnacles } from './manager-binnacles';

describe('ManagerBinnacles', () => {
  let component: ManagerBinnacles;
  let fixture: ComponentFixture<ManagerBinnacles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerBinnacles],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerBinnacles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
