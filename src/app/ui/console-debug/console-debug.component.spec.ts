import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleDebugComponent } from './console-debug.component';

describe('ConsoleDebugComponent', () => {
  let component: ConsoleDebugComponent;
  let fixture: ComponentFixture<ConsoleDebugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsoleDebugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsoleDebugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
