import { createAction, props } from '@ngrx/store';
import { SidebarPanelAction } from '../models/SidebarPanelAction';

export const openSidebarPanel = createAction('[UI] Open sidebar panel', props<{ action: SidebarPanelAction }>());