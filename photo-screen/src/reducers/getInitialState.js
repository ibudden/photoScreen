
import {Map} from 'immutable';

/*
    Make some initial data to help testing
 */
export const getInitialState = function getInitialState() {
 
    let state = Map({ 
        // tells the app how to behave
        loginStatus: 'NOT_SURE_YET',
        loginCredentials: Map(),
        // done config
        configStatus: window.localStorage.getItem('configStatus') || 'COMPLETE', //'NOT_SET',
        // tells the background media getting process how to behave
        libraryStatus: window.localStorage.getItem('libraryStatus') || 'EMPTY',
        // currently showing media
        oldMediaItem: null,
        newMediaItem: null
    });
        
    return state;
};
