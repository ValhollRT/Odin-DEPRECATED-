import { Injectable } from '@angular/core';
import { LogLevel } from '../models/logModels/logLevel';
import { Container } from '../engine/common/Container';
import { MeshLog } from '../models/logModels/meshLog';

@Injectable()
export class LogService {

  level: LogLevel = LogLevel.All;
  logWithDate: boolean = true;

  public bufferLogConsole: String[] = [];

  constructor() { }

  getDate(): number {
    return new Date().getTime();
  }
  public log(msg: any) {
    if (msg instanceof Container) msg = new MeshLog(msg.mesh);
    let logMessage = + this.getDate() + ": " + JSON.stringify(msg);
    this.bufferLogConsole.push(logMessage);
    // console.log(logMessage);
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