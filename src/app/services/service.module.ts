import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowService } from './window.service';
import { EngineService } from '../engine/engine.service';
import { LogService } from './log.service';
import { AppService } from './app.service';
import { CanvasHelperService } from './canvas-helper.service';
import { SessionService } from './session.service';

@NgModule({
    imports: [CommonModule],
    exports: [],
    declarations: [],
    providers: [
        WindowService,
        EngineService,
        LogService,
        AppService,
        CanvasHelperService,
        SessionService
    ],
})
export class ServiceModule { }
