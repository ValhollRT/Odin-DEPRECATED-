import { createAction, props } from '@ngrx/store';
import { PopupDialogAction } from '../../models/actions/PopupDialogAction';
import { SidebarPanelAction } from '../../models/actions/SidebarPanelAction';

export const openSidebarPanel = createAction('[UI] Open sidebar panel', props<{ action: SidebarPanelAction }>());
export const openAboutOdin = createAction("[UI] Open About Odin", props<{ aboutOdin: PopupDialogAction }>());
export const openSceneSettings = createAction("[UI] Open Scene Settings", props<{ sceneSettings: PopupDialogAction }>());
export const openConsole = createAction("[UI] Open Console", props<{ console: PopupDialogAction }>());
export const openLogin = createAction("[UI] Open Login", props<{ login: PopupDialogAction }>());