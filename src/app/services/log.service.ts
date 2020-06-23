import { Injectable } from '@angular/core';
import { LogLevel } from '../models/logModels/logLevel';

@Injectable()
export class LogService {

  level: LogLevel = LogLevel.All;
  logWithDate: boolean = true;

  constructor() {
    console.log("LogService");
  }

  public log(msg: any) {
    console.log(new Date() + ": "
      + JSON.stringify(msg));
  }

  private shouldLog(level: LogLevel): boolean {
    let ret: boolean = false;
    if ((level >= this.level &&
      level !== LogLevel.Off) ||
      this.level === LogLevel.All) {
      ret = true;
    }
    return ret;
  }

  private formatParams(params: any[]): string {
    let ret: string = params.join(",");
    // Is there at least one object in the array?
    if (params.some(p => typeof p == "object")) {
      ret = "";
      // Build comma-delimited string
      for (let item of params) {
        ret += JSON.stringify(item) + ",";
      }
    }
    return ret;
  }

}