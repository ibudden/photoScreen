
//import {fromJS, List, Map} from 'immutable';

export const setConfigStatus = function (state, newStatus) {
    console.log('reducer.setConfigStatus', newStatus);
    
    return state.set('setConfigStatus', newStatus);
    
}
