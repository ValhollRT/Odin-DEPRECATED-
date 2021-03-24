import { createReducer, on } from '@ngrx/store';
import { PopupDialogAction } from '../../models/';
import { SidebarPanelAction } from '../../models/menuActions/SidebarPanelAction.model';
import { openAboutOdin, openConsole, openLogin, openSceneSettings, openSidebarPanel } from '../actions';

export interface State {
    action: SidebarPanelAction;
    aboutOdin: PopupDialogAction;
    sceneSettings: PopupDialogAction;
    console: PopupDialogAction;
    login: PopupDialogAction;
}

export const initialState: State = {
    action: undefined,
    aboutOdin: { open: false },
    sceneSettings: { open: false },
    console: { open: false },
    login: { open: false }
}

let _uiReducer = createReducer(
    initialState,
    on(openSidebarPanel, (state, { action }) => ({ ...state, action })),
    on(openAboutOdin, (state, { aboutOdin }) => ({ ...state, aboutOdin })),
    on(openSceneSettings, (state, { sceneSettings }) => ({ ...state, sceneSettings })),
    on(openConsole, (state, { console }) => ({ ...state, console })),
    on(openLogin, (state, { login }) => ({ ...state, login }))
);

export function uiReducer(state, action) {
    return _uiReducer(state, action);
}