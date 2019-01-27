

import {getInitialState} from './getInitialState';
import {setLoginStatus} from './setLoginStatus';
import {setLibraryStatus} from './setLibraryStatus';
import {setConfigStatus} from './setConfigStatus';
import {setCredentials} from './setCredentials';
import {setNextMedia} from './setNextMedia';
import {setFadedIn} from './setFadedIn';
import {toggleConfigHour} from './toggleConfigHour';


export default function(state = getInitialState(), action) {
    switch (action.type) {
        case 'SET_LOGIN_STATUS':
            return setLoginStatus(state, action.status);
        
        case 'SET_CREDENTIALS':
            return setCredentials(state, action.credentials);
            
        case 'SET_CONFIG_STATUS':
            return setConfigStatus(state, action.status);
            
        case 'SET_LIBRARY_STATUS':
            return setLibraryStatus(state, action.status);
        
        case 'SET_NEXT_MEDIA':
            return setNextMedia(state, action.mediaObject);
            
        case 'SET_FADED_IN':
            return setFadedIn(state);
        
        case 'TOGGLE_CONFIG_HOUR':
            return toggleConfigHour(state, action.day, action.hour);
            
        default:
            return state;
    }

}
