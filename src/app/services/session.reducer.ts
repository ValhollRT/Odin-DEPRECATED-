import { createReducer, on } from '@ngrx/store';
import { User } from '../models/User';
import { login, signIn, signUp, signOut } from './session.action';

export interface State {
    user: User;
}

export const initialState: State = {
    user: undefined
}

let _sessionReducer = createReducer(
    initialState,
    on(login, (state, { user }) => ({ ...state, user }))
);

export function sessionReducer(state, action) {
    return _sessionReducer(state, action);
}