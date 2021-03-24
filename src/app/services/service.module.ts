import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppService, CanvasHelperService, EngineService, LogService, SessionService, WindowRefService } from './index.service';


@NgModule({
    imports: [CommonModule],
    exports: [],
    declarations: [],
    providers: [
        WindowRefService,
        EngineService,
        LogService,
        AppService,
        CanvasHelperService,
        SessionService
    ],
})
export class ServiceModule { }
