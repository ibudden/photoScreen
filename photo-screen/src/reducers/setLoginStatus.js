
//import {fromJS, List, Map} from 'immutable';

export const setLoginStatus = function (state, newStatus) {
    // console.log('reducer.setLoginStatus', newStatus);
    return state.set('loginStatus', newStatus);
}
