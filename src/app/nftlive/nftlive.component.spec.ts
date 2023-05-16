import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftliveComponent } from './nftlive.component';

describe('NftliveComponent', () => {
  let component: NftliveComponent;
  let fixture: ComponentFixture<NftliveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NftliveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NftliveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
