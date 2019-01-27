
import {Map} from 'immutable';

/*

    Set up default config

 */
function defaultConfig() {
    const config = {};
    
    ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(function (day) {
        config[day] = [];
        
        for(let t = 0; t < 24; t++)
            if ((t >= 7 && t <= 9) || (t >= 17 && t <= 22))
                config[day].push(true);
                
            else if ((day === 'Saturday' || day === 'Sunday') && (t >= 7 && t <= 22))
                config[day].push(true);
                
            else
                config[day].push(false);
    });
    return Map(config);
}


/*
    Make some initial data to help testing
 */
export const getInitialState = function getInitialState() {
    
    let configSetup = window.localStorage.getItem('configSetup');
    
    if (configSetup)
        configSetup = Map(JSON.parse(configSetup));
    
    let state = Map({ 
        // tells the app how to behave
        loginStatus: 'NOT_SURE_YET',
        loginCredentials: Map(),
        // done config
        configStatus: window.localStorage.getItem('configStatus') || 'COMPLETE', //'NOT_SET',
        configSetup: configSetup || defaultConfig(),
        // tells the background media getting process how to behave
        libraryStatus: window.localStorage.getItem('libraryStatus') || 'EMPTY',
        // currently showing media
        oldMediaItem: null,
        newMediaItem: null
    });
        
    return state;
};
