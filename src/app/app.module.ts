import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolMenuComponent } from './ui/tool-menu/tool-menu.component';
import { ViewportComponent } from './ui/viewport/viewport.component';
import { TreeNodeComponent } from './ui/tree-node/tree-node.component';
import { TransformMenuComponent } from './ui/transform-menu/transform-menu.component';
import { ConsoleDebugComponent } from './ui/console-debug/console-debug.component';
import { ContentPanelComponent } from './ui/content-panel/content-panel.component';
import { AboutOdinComponent } from './ui/about-odin/about-odin.component';
import { SidebarPropertiesComponent } from './ui/sidebar-properties/sidebar-properties.component';
import { MaterialPanelComponent } from './ui/material-panel/material-panel.component';
import { LightPanelComponent } from './ui/light-panel/light-panel.component';

//Service
import { ServiceModule } from './services/service.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

//Pipes
import { RotationPipe } from './pipes/rotation.pipe';
import { RgbToHexPipe } from './pipes/rgb-to-hex.pipe';
import { PrecisionPipe } from './pipes/precision.pipe';

//Material
import { AllAngularMaterialModule } from './all-angular-material.module';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    ToolMenuComponent,
    ViewportComponent,
    ConsoleDebugComponent,
    AboutOdinComponent,
    TransformMenuComponent,
    RotationPipe,
    RgbToHexPipe,
    PrecisionPipe,
    TreeNodeComponent,
    ContentPanelComponent,
    SidebarPropertiesComponent,
    MaterialPanelComponent,
    LightPanelComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    ServiceModule,
    NoopAnimationsModule,
    AllAngularMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
