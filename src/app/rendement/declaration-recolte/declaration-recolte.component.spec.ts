import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclarationRecolteComponent } from './declaration-recolte.component';

describe('DeclarationRecolteComponent', () => {
  let component: DeclarationRecolteComponent;
  let fixture: ComponentFixture<DeclarationRecolteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeclarationRecolteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclarationRecolteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
