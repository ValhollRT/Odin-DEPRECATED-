import { PopupDialogAction } from 'src/app/models/actions/PopupDialogAction';
import { SidebarPanelAction } from './../models/actions/SidebarPanelAction';
import { createReducer, on } from '@ngrx/store';
import { openSidebarPanel, openAboutOdin, openSceneSettings, openConsole, openLogin } from './ui.action';

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