import { ActionReducerMap } from '@ngrx/store';
import * as clipboard from './reducers/clipboard.reducer';
import * as engine from './reducers/engine.reducer';
import * as session from './reducers/session.reducer';
import * as ui from './reducers/ui.reducer';

export interface AppState {
  engine: engine.State;
  session: session.State;
  ui: ui.State;
  clipboard: clipboard.State;
}

export const appReducers: ActionReducerMap<AppState> = {
  engine: engine.engineReducer,
  session: session.sessionReducer,
  ui: ui.uiReducer,
  clipboard: clipboard.clipboardReducer,
};
