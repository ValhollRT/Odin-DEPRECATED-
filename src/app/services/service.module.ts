import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowService } from './window.service';
import { EngineService } from './engine.service';
import { LogService } from './log.service';
import { AppService } from './app.service';

@NgModule({
    imports: [CommonModule],
    exports: [],
    declarations: [],
    providers: [
        WindowService,
        EngineService,
        LogService,
        AppService
    ],
})
export class ServiceModule { }
