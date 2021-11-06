import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieueComponent } from './categorieue.component';

describe('CategorieueComponent', () => {
  let component: CategorieueComponent;
  let fixture: ComponentFixture<CategorieueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorieueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorieueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
