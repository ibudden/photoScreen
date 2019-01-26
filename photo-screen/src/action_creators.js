
/*
    Action creators are pass through functions - functions that you can use in your components, that trigger reducer functions
 */
export function setLoggingIn() {
    // console.log('action_creators.setLoggingIn');
    return {
        type: 'SET_LOGIN_STATUS',
        status: 'LOGGING_IN'
    };
}
export function setLoginError() {
    // console.log('action_creators.setLoginError');
    return {
        type: 'SET_LOGIN_STATUS',
        status: 'LOGGING_IN'
    };
}
export function setLoginRefreshing() {
    // console.log('action_creators.setLoginRefreshing');
    return {
        type: 'SET_LOGIN_STATUS',
        status: 'REFRESHING'
    };
}
export function setLoggedIn() {
    // console.log('action_creators.setLoggedIn');
    // and then update the app status
    return {
        type: 'SET_LOGIN_STATUS',
        status: 'LOGGED_IN'
    };
}
export function setLoggedOut() {
    // console.log('action_creators.setLoggedOut');
    // 
    return {
        type: 'SET_LOGIN_STATUS',
        status: 'LOGGED_OUT'
    };
}
export function setCredentials(credentials) {
    // console.log('action_creators.setCredentials', credentials);
    return {
        type: 'SET_CREDENTIALS',
        credentials: credentials
    };
}

export function setLibraryPopulating() {
    console.log('action_creators.setLibraryPopulating');
    // 
    window.localStorage.setItem('libraryStatus','POPULATING');
    
    return {
        type: 'SET_LIBRARY_STATUS',
        status: 'POPULATING'
    };
}

export function setLibraryPopulated() {
    console.log('action_creators.setLibraryPopulated');
    // 
    window.localStorage.setItem('libraryStatus','POPULATED');
    
    return {
        type: 'SET_LIBRARY_STATUS',
        status: 'POPULATED'
    };
}

export function setConfigComplete() {
   console.log('action_creators.setConfigComplete');
   return {
       type: 'SET_CONFIG_STATUS',
       status: 'COMPLETE'
   };
}

export function setNextMedia( mediaObject ) {
   // console.log('action_creators.setNextMedia', mediaObject);
   // we calculate a random number by finding the number of rows and using limit
   return {
       type: 'SET_NEXT_MEDIA',
       mediaObject: mediaObject
   };
}

export function setFadedIn() {
   // console.log('action_creators.setFadedIn');
   // we calculate a random number by finding the number of rows and using limit
   return {
       type: 'SET_FADED_IN'
   };
}
