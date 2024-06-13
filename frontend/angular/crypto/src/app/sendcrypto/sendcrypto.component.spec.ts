import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendcryptoComponent } from './sendcrypto.component';

describe('SendcryptoComponent', () => {
  let component: SendcryptoComponent;
  let fixture: ComponentFixture<SendcryptoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendcryptoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendcryptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
