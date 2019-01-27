
import {Map,List} from 'immutable';

/*

    Set up default config

 */
function defaultConfig() {
    const config = [];
    let dayConf = [];
    for (let day = 0; day < 7; day++) {
        dayConf = [];
        for(let t = 0; t < 24; t++) {
            if ((t >= 7 && t <= 9) || (t >= 17 && t <= 22))
                dayConf.push(true);
                
            else if ((day === 0 || day === 6) && (t >= 7 && t <= 22))
                dayConf.push(true);
                
            else
                dayConf.push(false);
        }
        config.push(List(dayConf));
    }
    return List(config);
}


/*
    Make some initial data to help testing
 */
export const getInitialState = function getInitialState() {
    
    let configSetup = window.localStorage.getItem('configSetup');
    
    if (configSetup)
        configSetup = List(JSON.parse(configSetup));
    
    let state = Map({ 
        // tells the app how to behave
        loginStatus: 'NOT_SURE_YET',
        loginCredentials: Map(),
        // done config
        configStatus: window.localStorage.getItem('configStatus') || 'NOT_SET', //'',
        configSetup: configSetup || defaultConfig(),
        // tells the background media getting process how to behave
        libraryStatus: window.localStorage.getItem('libraryStatus') || 'EMPTY',
        // currently showing media
        oldMediaItem: null,
        newMediaItem: null,
        // should the screen be playing? Controlled by the Config controller
        screenIsActive: true
    });
        
    return state;
};
