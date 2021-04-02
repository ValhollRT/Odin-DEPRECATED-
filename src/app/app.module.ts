import { Injector, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { AllAngularMaterialModule } from './all-angular-material.module';
import { AppComponent } from './app.component';
import { PrecisionPipe } from './pipes/precision.pipe';
import { RgbToHexPipe } from './pipes/rgb-to-hex.pipe';
import { RotationPipe } from './pipes/rotation.pipe';
import { ServiceModule } from './services/service.module';
import { AlertComponent } from './shared/alert/alert.component';
import { PopupWindowComponent } from './shared/popup-window/popup-window.component';
import { TabComponent } from './shared/tab/tab.component';
import { TabsComponent } from './shared/tabs/tabs.component';
import { appReducers } from './store/app.reducer';
import { AboutOdinComponent } from './ui/about-odin/about-odin.component';
import { BuilderPanelComponent } from './ui/builder-panel/builder-panel.component';
import { CameraPanelComponent } from './ui/camera-panel/camera-panel.component';
import { ConsoleDebugComponent } from './ui/console-debug/console-debug.component';
import { ContentPanelComponent } from './ui/content-panel/content-panel.component';
import { ExplorerPanelComponent, folderDatabase } from './ui/explorer-panel/explorer-panel.component';
import { LightPanelComponent } from './ui/light-panel/light-panel.component';
import { LoginComponent } from './ui/login/login.component';
import { MaterialPanelComponent } from './ui/material-panel/material-panel.component';
import { PlugsPanelComponent } from './ui/plugs-panel/plugs-panel.component';
import { SceneSettingsComponent } from './ui/scene-settings/scene-settings.component';
import { SidebarPropertiesComponent } from './ui/sidebar-properties/sidebar-properties.component';
import { TabsPlugsPanelComponent } from './ui/tabs-plugs-panel/tabs-plugs-panel.component';
import { TextPanelComponent } from './ui/text-panel/text-panel.component';
import { ToolMenuComponent } from './ui/tool-menu/tool-menu.component';
import { TransformMenuComponent } from './ui/transform-menu/transform-menu.component';
import { TreeNodeComponent } from './ui/tree-node/tree-node.component';
import { ViewportComponent } from './ui/viewport/viewport.component';

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
    LightPanelComponent,
    BuilderPanelComponent,
    PopupWindowComponent,
    TextPanelComponent,
    SceneSettingsComponent,
    LoginComponent,
    AlertComponent,
    CameraPanelComponent,
    TabComponent,
    TabsComponent,
    ExplorerPanelComponent,
    TabsPlugsPanelComponent,
    PlugsPanelComponent
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
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule
  ],
  providers: [folderDatabase],
  bootstrap: [AppComponent]
})

export class AppModule {
  /**
     * https://stackoverflow.com/questions/39101865/angular-2-inject-dependency-outside-constructor
     * Allows for retrieving singletons using `AppModule.injector.get(MyService)`
     * This is good to prevent injecting the service as constructor parameter.
     */
  static injector: Injector;
  constructor(injector: Injector) {
    AppModule.injector = injector;
  }
}
