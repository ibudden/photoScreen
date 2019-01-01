
//import {fromJS, List, Map} from 'immutable';

export const setLibraryStatus = function (state, newStatus) {
    // console.log('reducer.setLibraryStatus', newStatus);
    return state.set('libraryStatus', newStatus);
}
