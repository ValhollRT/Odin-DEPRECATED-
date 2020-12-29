import { ActionReducerMap } from "@ngrx/store";
import * as engine from './engine/engine.reducer'

export interface AppState {
    engine: engine.State;
}

export const appReducers: ActionReducerMap<AppState> = {
    engine: engine.engineReducer,
}