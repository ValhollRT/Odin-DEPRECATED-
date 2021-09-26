import { createReducer, on } from '@ngrx/store';
import { ClipboardTreeNode } from 'src/app/models/clipboard.model';
import { UiTreeNode } from 'src/app/models/uiTreeNode';
import { copyToClipboardTreeNode } from './../actions/clipboard.actions';

export interface State {
  clipboardTreeNode: ClipboardTreeNode;
}

export const initialState: State = {
  clipboardTreeNode: {
    type: UiTreeNode.NOOP,
    data: {},
  },
};

let _clipboardReducer = createReducer(
  initialState,
  on(
    copyToClipboardTreeNode,
    (state, { clipboardTreeNode: clipboardTreeNode }) => ({
      ...state,
      clipboardTreeNode: clipboardTreeNode,
    })
  )
);

export function clipboardReducer(state, action) {
  return _clipboardReducer(state, action);
}
