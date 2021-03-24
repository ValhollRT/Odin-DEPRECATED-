import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppService, CanvasService, EngineService, LogService, SessionService, WindowRefService } from './index.service';


@NgModule({
    imports: [CommonModule],
    exports: [],
    declarations: [],
    providers: [
        WindowRefService,
        EngineService,
        LogService,
        AppService,
        CanvasService,
        SessionService
    ],
})
export class ServiceModule { }
