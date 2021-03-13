import { ActionReducerMap } from "@ngrx/store";
import * as engine from './engine/engine.reducer'
import * as session from './services/session.reducer'

export interface AppState {
    engine: engine.State;
    session: session.State;
}

export const appReducers: ActionReducerMap<AppState> = {
    engine: engine.engineReducer,
    session: session.sessionReducer
}