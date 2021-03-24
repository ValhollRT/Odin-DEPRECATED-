import { createReducer, on } from '@ngrx/store';
import { addSelection, clearSelection, oneSelection, removeSelection } from '../actions';

export interface State {
  UUIDCsSelected: string[];
  prevUUIDCsSelected: string[];
}

export const initialState: State = {
  UUIDCsSelected: [],
  prevUUIDCsSelected: []
}
let _engineReducer = createReducer(
  initialState,
  on(oneSelection, (state, { UUID }) => {
    return ({ ...state, prevUUIDCsSelected: [...state.UUIDCsSelected], UUIDCsSelected: [UUID] });
  }),
  on(addSelection, (state, { UUID }) => ({ ...state, UUIDCsSelected: [...state.UUIDCsSelected, UUID] })),
  on(removeSelection, (state, { UUID }) => ({ ...state, UUIDCsSelected: [UUID] })),
  on(clearSelection, (state) => ({ ...state, prevUUIDCsSelected: [...state.UUIDCsSelected], UUIDCsSelected: [] })),
);

export function engineReducer(state, action) {
  return _engineReducer(state, action);
}