import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguidosPage } from './seguidos.page';

describe('SeguidosPage', () => {
  let component: SeguidosPage;
  let fixture: ComponentFixture<SeguidosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguidosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguidosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
