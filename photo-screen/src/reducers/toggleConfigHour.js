
export const toggleConfigHour = function (state, day, hour) {
    // console.log('toggleConfigHour',day,hour);
    // update the state
    state = state.setIn(['configSetup',day,hour], !state.getIn(['configSetup',day,hour]));
    // and save to localStorage
    window.localStorage.setItem('configSetup', JSON.stringify( state.get('configSetup').toJS() ));
    // and send back
    return state;
};
