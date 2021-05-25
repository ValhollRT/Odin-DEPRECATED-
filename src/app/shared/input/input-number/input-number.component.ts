import { Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss']
})
export class InputNumberComponent implements OnInit {

  @ViewChild('inputNumber') inputNumber: ElementRef;
  @ViewChild('dragZone') dragZone: ElementRef;

  @Input('bind') value: any;
  @Input('param') param: string;
  @Input('min') min: number;
  @Input('max') max: number;
  @Input('step') step: number;
  @Input('resetValue') resetValue: number;
  @Input('label') label: string;
  @Input('pipe') pipe: any;
  @Input('pipeInput') pipeInput: (el: HTMLInputElement, param: string) => number;
  @Input('change') change: () => void;
  @Input('callbackFn') callbackFn: (value: number, oldValue: number, param: string) => void;

  public _curDown = false;
  public _mouseDownX: number = 0;
  public _mouseDownValue: number = 0;
  public lastDistance: number = 0;
  public _reset: number;

  constructor(public ngZone: NgZone) { }

  ngOnInit(): void { }

  ngAfterViewInit() { this.init(); }

  init() {
    /** Local variables */
    let el = this.inputNumber.nativeElement as HTMLInputElement;
    let drag = this.dragZone.nativeElement as HTMLDivElement;

    this._reset = this.resetValue;

    if (this.min == undefined) this.min = -99999;
    if (this.max == undefined) this.max = 99999;
    if (this.step == undefined) this.step = 1;

    /** Events */
    el.onmouseup = this.onMouseUp;
    drag.onmouseup = this.onMouseUp;
    el.onmousedown = this.onMouseDown;
    drag.onmousemove = this.onMouseMove;
    el.onwheel = this.onMouseWheel;
    el.onkeydown = this.onKeyPress;
    el.blur = () => this.onBlur;
    el.onpaste = () => { console.log("onpaste") };
  }

  _roundValue = (v) => {
    var maxDecimals = 3;

    var t = Math.pow(10, maxDecimals);
    return Math.round(v * t) / t;
  }

  onMouseDown = (e) => {
    let el = this.inputNumber.nativeElement as HTMLInputElement;
    this._mouseDownX = e.clientX;
    this._changeStart();
  }

  onMouseUp = (e) => {
    this._changeEnd();
  }

  public eLastClientX: number
  onMouseMove = (e: MouseEvent) => {
    this.ngZone.runOutsideAngular(() => {
      if (this._curDown === true) {
        e.preventDefault();

        let direction = e.clientX > this.eLastClientX ? 1 : -1;
        let distance: number = (e.clientX - this._mouseDownX);

        if (distance == this.lastDistance) return; /** prevent change value  */
        this.eLastClientX = e.clientX;

        this.lastDistance = distance;
        this.setValue(this.getValue() + (direction * this.getStep(e)));
      }
    });
  }

  getStep(e) {
    if (e.shiftKey && e.altKey && e.ctrlKey) {
      return this.step * 0.001;
    } else if (!e.shiftKey && e.altKey && e.ctrlKey) {
      return this.step * 0.01;
    } else if (e.shiftKey && !e.altKey && e.ctrlKey) {
      return this.step * 100;
    } else if (e.shiftKey && !e.altKey && !e.ctrlKey) {
      return this.step * 10;
    } else if (!e.shiftKey && !e.altKey && e.ctrlKey) {
      return this.step * 0.1;
    } else {
      return this.step;
    }
  }

  onMouseWheel = (e) => {
    if (this._curDown === false) {
      e.preventDefault();
      let direction = e.deltaY < 0 ? 1 : -1;
      this.setValue(this.getValue() + (direction * this.getStep(e)));
    }
  }

  getValue(): number {
    return parseFloat(this.inputNumber.nativeElement.value) || 0;
  }

  setValue(amount: number): void {
    this.ngZone.runOutsideAngular(() => {
      let value: number;
      value = Math.max(Math.min(amount, this.max), this.min);
      if (Number.isNaN(value)) return;

      value = this._roundValue(value);
      this.inputNumber.nativeElement.value = value;

      let oldValue = this.value[this.param];
      if (this.pipeInput != undefined) this.value[this.param] = this.pipeInput(this.inputNumber.nativeElement, this.param)
      else this.value[this.param] = value;

      if (this.callbackFn != undefined) this.callbackFn(value, oldValue, this.param);
      return value;
    });
  }


  onBlur = (e) => {
    this._changeEnd();
    this.setValue(this.getValue());
  }

  onKeyPress = (e) => {
    if (e.keyCode === 13) {
      this.setValue(this.getValue());
    }
  }

  _changeStart() {
    this._curDown = true;
  }

  _changeEnd() {
    this._curDown = false;
  }

  setDefaultValue() {
    this.setValue(this._reset)
  }
}