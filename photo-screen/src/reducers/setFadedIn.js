
export const setFadedIn = function (state) {
    //console.log('reducer.setFadedIn');
    return state.setIn(['newMediaItem','fadedIn'], true);
}
