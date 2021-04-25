import { createReducer, on } from '@ngrx/store';
import { addSelection, clearSelection, oneSelection, removeSelection } from '../actions';
import { engineIsLoaded } from './../actions/engine.actions';

export interface State {
  uuidCsSelected: string[];
  prevUuidCsSelected: string[];
  isLoaded: boolean;
}

export const initialState: State = {
  uuidCsSelected: [],
  prevUuidCsSelected: [],
  isLoaded: false
}
let _engineReducer = createReducer(
  initialState,
  on(oneSelection, (state, { uuid: uuid }) => ({ ...state, prevUuidCsSelected: [...state.uuidCsSelected], uuidCsSelected: [uuid] })),
  on(addSelection, (state, { uuid: uuid }) => ({ ...state, uuidCsSelected: [...state.uuidCsSelected, uuid] })),
  on(removeSelection, (state, { uuid: uuid }) => ({ ...state, uuidCsSelected: [uuid] })),
  on(clearSelection, (state) => ({ ...state, prevUuidCsSelected: [...state.uuidCsSelected], uuidCsSelected: [] })),
  on(clearSelection, (state) => ({ ...state, prevUuidCsSelected: [], uuidCsSelected: [] })),
  on(engineIsLoaded, (state) => ({ ...state, isLoaded: true })),
);

export function engineReducer(state, action) {
  return _engineReducer(state, action);
}