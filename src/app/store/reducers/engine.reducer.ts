import { createReducer, on } from '@ngrx/store';
import { UiTreeNode } from 'src/app/models/uiTreeNode';
import { addSelection, clearSelection, oneSelection, removeSelection } from '../actions';
import { SceneSettings } from './../../models/SceneSettings.model';
import { clearAllPlugSelection, engineIsLoaded, onePlugSelection, setSettings } from './../actions/engine.actions';

export interface State {
  uuidCsSelected: string[];
  plugUuidSelected: string;
  containerPlugUuidSelected: string;
  prevUuidCsSelected: string[];
  isLoaded: boolean;
  sceneSettings: SceneSettings;
  lastSelectedTypeTreeNode: UiTreeNode;
}

export const initialState: State = {
  uuidCsSelected: [],
  prevUuidCsSelected: [],
  plugUuidSelected : '',
  containerPlugUuidSelected : "",
  isLoaded: false,
  lastSelectedTypeTreeNode: UiTreeNode.NOOP,
  sceneSettings: {
    backgroundColor: "#333335",
    userId: undefined
  } as SceneSettings
}
let _engineReducer = createReducer(
  initialState,
  on(oneSelection, (state, { uuid: uuid }) => ({ ...state, prevUuidCsSelected: [...state.uuidCsSelected], uuidCsSelected: [uuid], lastSelectedTypeTreeNode: UiTreeNode.CONTAINER })),
  on(addSelection, (state, { uuid: uuid }) => ({ ...state, uuidCsSelected: [...state.uuidCsSelected, uuid], lastSelectedTypeTreeNode: UiTreeNode.CONTAINER})),
  on(removeSelection, (state, { uuid: uuid }) => ({ ...state, uuidCsSelected: [uuid], lastSelectedTypeTreeNode: UiTreeNode.CONTAINER })),
  on(clearSelection, (state) => ({ ...state, prevUuidCsSelected: [...state.uuidCsSelected], uuidCsSelected: [], plugUuidSelected: '', containerPlugUuidSelected: '', lastSelectedTypeTreeNode: UiTreeNode.NOOP })),
  on(onePlugSelection, (state, { plugUuidSelected: plugUuidSelected , containerPlugUuidSelected : containerPlugUuidSelected }) => ({  ...state, plugUuidSelected: plugUuidSelected, containerPlugUuidSelected : containerPlugUuidSelected, lastSelectedTypeTreeNode: UiTreeNode.PLUG })),
  on(clearAllPlugSelection, (state) => ({ ...state, plugUuidSelected: '', containerPlugUuidSelected: '', lastSelectedTypeTreeNode: UiTreeNode.NOOP })),
  on(engineIsLoaded, (state) => ({ ...state, isLoaded: true })),
  on(setSettings, (state, { sceneSettings: sceneSettings }) => ({ ...state, sceneSettings: { ...sceneSettings } })),  
);

export function engineReducer(state, action) {
  return _engineReducer(state, action);
}