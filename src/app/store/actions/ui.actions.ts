import { createAction, props } from '@ngrx/store';
import { PopupDialogAction, SidebarPanelAction } from '../../models';

export const openSidebarPanel = createAction('[UI] Open sidebar panel', props<{ action: SidebarPanelAction }>());
export const openAboutOdin = createAction("[UI] Open About Odin", props<{ aboutOdin: PopupDialogAction }>());
export const openSceneSettings = createAction("[UI] Open Scene Settings", props<{ sceneSettings: PopupDialogAction }>());
export const openCreateNewMaterial = createAction("[UI] Open Create new Material", props<{ createNewMaterial: PopupDialogAction }>());
export const openUploadNewAudio = createAction("[UI] Open Upload new Audio", props<{ uploadNewAudio: PopupDialogAction }>());
export const openUploadNewImage = createAction("[UI] Open Upload new Image", props<{ uploadNewImage: PopupDialogAction }>());
export const openUploadNewFont = createAction("[UI] Open Upload new Font", props<{ uploadNewFont: PopupDialogAction }>());
export const openConsole = createAction("[UI] Open Console", props<{ console: PopupDialogAction }>());
export const openLogin = createAction("[UI] Open Login", props<{ login: PopupDialogAction }>());