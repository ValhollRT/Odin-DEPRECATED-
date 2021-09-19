import { folderExplorerId, openUploadNewAudio, openUploadNewFont, openUploadNewImage } from './../actions/ui.actions';
import { createReducer, on } from '@ngrx/store';
import { PopupDialogAction } from '../../models/';
import { SidebarPanelAction } from '../../models/menuActions/SidebarPanelAction.model';
import { openAboutOdin, openConsole, openCreateNewMaterial, openLogin, openSceneSettings, openSidebarPanel } from '../actions';

export interface State {
    action: SidebarPanelAction;
    aboutOdin: PopupDialogAction;
    sceneSettings: PopupDialogAction;
    createNewMaterial: PopupDialogAction;
    uploadNewAudio: PopupDialogAction;
    uploadNewImage: PopupDialogAction;
    uploadNewFont: PopupDialogAction;
    console: PopupDialogAction;
    login: PopupDialogAction;
    folderExplorerId: string;
}

export const initialState: State = {
    action: undefined,
    aboutOdin: { open: false },
    sceneSettings: { open: false },
    createNewMaterial: { open: false },
    uploadNewAudio: { open: false },
    uploadNewImage: { open: false },
    uploadNewFont: { open: false },
    console: { open: false },
    login: { open: false },
    folderExplorerId: ""
}

let _uiReducer = createReducer(
    initialState,
    on(openSidebarPanel, (state, { action }) => ({ ...state, action })),
    on(openAboutOdin, (state, { aboutOdin }) => ({ ...state, aboutOdin })),
    on(openSceneSettings, (state, { sceneSettings }) => ({ ...state, sceneSettings })),
    on(openCreateNewMaterial, (state, { createNewMaterial }) => ({ ...state, createNewMaterial })),
    on(openUploadNewAudio, (state, { uploadNewAudio }) => ({ ...state, uploadNewAudio })),
    on(openUploadNewImage, (state, { uploadNewImage }) => ({ ...state, uploadNewImage })),
    on(openUploadNewFont, (state, { uploadNewFont }) => ({ ...state, uploadNewFont })),
    on(openConsole, (state, { console }) => ({ ...state, console })),
    on(openLogin, (state, { login }) => ({ ...state, login })),
    on(folderExplorerId, (state, { folderExplorerId }) => ({ ...state, folderExplorerId }))
);

export function uiReducer(state, action) {
    return _uiReducer(state, action);
}