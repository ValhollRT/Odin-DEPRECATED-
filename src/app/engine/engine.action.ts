import { createAction, props } from '@ngrx/store';

export const oneSelection = createAction('[ENGINE] ONE_SELECTION', props<{ UUID: string }>());
export const addSelection = createAction('[ENGINE] ADD_SELECTION', props<{ UUID: string }>());
export const removeSelection = createAction('[ENGINE] REMOVE_SELECTION', props<{ UUID: string }>());
export const clearSelection = createAction('[ENGINE] CLEAR_SELECTION');