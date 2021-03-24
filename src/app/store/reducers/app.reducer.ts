import { ActionReducerMap } from "@ngrx/store";
import * as engine from './engine.reducer';
import * as session from './session.reducer';
import * as ui from './ui.reducer';

export interface AppState {
    engine: engine.State;
    session: session.State;
    ui: ui.State;
}

export const appReducers: ActionReducerMap<AppState> = {
    engine: engine.engineReducer,
    session: session.sessionReducer,
    ui: ui.uiReducer
}