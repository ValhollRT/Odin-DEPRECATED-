import { createAction, props } from '@ngrx/store';

export const oneSelection = createAction('[ENGINE SELECTION] ONE_SELECTION', props<{ UUID: string }>());
export const addSelection = createAction('[ENGINE SELECTION] ADD_SELECTION', props<{ UUID: string }>());
export const removeSelection = createAction('[ENGINE SELECTION] REMOVE_SELECTION', props<{ UUID: string }>());
export const clearSelection = createAction('[ENGINE SELECTION] CLEAR_SELECTION');