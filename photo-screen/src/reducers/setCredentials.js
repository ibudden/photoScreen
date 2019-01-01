
import {Map} from 'immutable';

export const setCredentials = function (state, credentials) {
    // console.log('reducer.setCredentials', credentials);
    return state.set('loginCredentials', new Map(credentials));
}
