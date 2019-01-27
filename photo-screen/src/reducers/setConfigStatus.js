
//import {fromJS, List, Map} from 'immutable';

export const setConfigStatus = function (state, newStatus) {
    //console.log('reducer.setConfigStatus', newStatus);
    window.localStorage.setItem('configStatus', newStatus);
    
    return state.set('configStatus', newStatus);
}
