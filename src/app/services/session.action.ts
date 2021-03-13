import { createAction, props } from '@ngrx/store';
import { User } from '../models/User';

export const login = createAction('[AUTHENTICATION] LOGIN', props<{ user: User }>());
export const signIn = createAction('[AUTHENTICATION] SIGNIN', props<{ user: User }>());
export const signUp = createAction('[AUTHENTICATION] SIGNUP', props<{ user: User }>());
export const signOut = createAction('[AUTHENTICATION] SIGNOUT');