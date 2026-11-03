import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingTransfersComponent } from './saving-transfers.component';

describe('SavingTransfersComponent', () => {
  let component: SavingTransfersComponent;
  let fixture: ComponentFixture<SavingTransfersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingTransfersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
