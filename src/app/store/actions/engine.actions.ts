import { SceneSettings } from './../../models/SceneSettings.model';
import { createAction, props } from '@ngrx/store';

export const oneSelection = createAction('[ENGINE SELECTION] ONE_SELECTION', props<{ uuid: string }>());
export const addSelection = createAction('[ENGINE SELECTION] ADD_SELECTION', props<{ uuid: string }>());
export const removeSelection = createAction('[ENGINE SELECTION] REMOVE_SELECTION', props<{ uuid: string }>());
export const clearSelection = createAction('[ENGINE SELECTION] CLEAR_SELECTION');
export const clearAllSelection = createAction('[ENGINE SELECTION] CLEAR_ALL SELECTION');
export const onePlugSelection = createAction('[ENGINE SELECTION] ONE_PLUG_SELECTION', props<{ plugUuidSelected: string, containerPlugUuidSelected: string }>());
export const clearAllPlugSelection = createAction('[ENGINE SELECTION] CLEAR_ALL_PLUG_SELECTION');
export const engineIsLoaded = createAction(('[ENGINE SELECTION] ENGINE_IS_LOADED'), props<{ isLoaded: boolean }>());
export const setSettings = createAction(('[ENGINE SETTINGS] SET SETTINGS'), props<{ sceneSettings: SceneSettings }>());