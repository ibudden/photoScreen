
import {Map} from 'immutable';

export const setNextMedia = function (state, mediaObject) {
    //console.log('reducer.setNextMedia', mediaObject);
    const newState = state.set('oldMediaItem', state.get('newMediaItem'));
    return newState.set('newMediaItem', Map(mediaObject));
}
