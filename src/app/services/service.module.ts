import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppService, EngineService, LogService, SessionService, WindowRefService } from './index.service';


@NgModule({
    imports: [CommonModule],
    exports: [],
    declarations: [],
    providers: [
        WindowRefService,
        AppService,
        LogService,
        SessionService,
        EngineService
    ],
})
export class ServiceModule { }
