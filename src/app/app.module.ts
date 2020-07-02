import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ToolMenuComponent } from './ui/tool-menu/tool-menu.component';
import { ViewportComponent } from './ui/viewport/viewport.component';

//Service
import { ServiceModule } from './services/service.module';
import { ConsoleDebugComponent } from './ui/console-debug/console-debug.component';
import { AboutOdinComponent } from './ui/about-odin/about-odin.component';
import { TransformMenuComponent } from './ui/transform-menu/transform-menu.component';
import { RotationPipe } from './pipes/rotation.pipe';


@NgModule({
  declarations: [
    AppComponent,
    ToolMenuComponent,
    ViewportComponent,
    ConsoleDebugComponent,
    AboutOdinComponent,
    TransformMenuComponent,
    RotationPipe,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    ServiceModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
