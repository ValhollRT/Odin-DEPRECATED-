import { Injector, Pipe, PipeTransform } from '@angular/core';
import { RotationPipe } from './rotation.pipe';

@Pipe({ name: 'dynamicPipe' })

export class DynamicPipe implements PipeTransform {

  public constructor(private injector: Injector) { }

  transform(value: any, pipeToken: any, pipeArgs: any[]): any {

    const MAP = { 'rotation': RotationPipe }

    if (pipeToken && MAP.hasOwnProperty(pipeToken)) {
      var pipeClass = MAP[pipeToken];
      var pipe = this.injector.get(pipeClass);
      if (Array.isArray(pipeArgs)) {
        return pipe.transform(value, ...pipeArgs);
      } else {
        return pipe.transform(value, pipeArgs);
      }
    }
    else {
      return value;
    }
  }
}