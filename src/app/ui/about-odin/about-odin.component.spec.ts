import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutOdinComponent } from './about-odin.component';

describe('AboutOdinComponent', () => {
  let component: AboutOdinComponent;
  let fixture: ComponentFixture<AboutOdinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutOdinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutOdinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
