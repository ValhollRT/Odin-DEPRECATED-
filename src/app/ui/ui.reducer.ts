import { SidebarPanelAction } from './../models/SidebarPanelAction';
import { createReducer, on } from '@ngrx/store';
import { openSidebarPanel } from './ui.action';

export interface State {
    action: SidebarPanelAction;
}

export const initialState: State = {
    action: undefined
}

let _uiReducer = createReducer(
    initialState,
    on(openSidebarPanel, (state, { action }) => ({ ...state, action }))
);

export function uiReducer(state, action) {
    return _uiReducer(state, action);
}