import React from 'react';
import {connect} from 'react-redux';
//import Loader from 'react-loader-spinner'
import * as actionCreators from '../action_creators';
const axios = require('axios');

class Background extends React.Component {
    
    
    async getLibraryItems(nextPageToken) {
        
        //console.log('getLibraryItems');
        const context = this;
        
        const promise = new Promise(function(resolve, reject) {   
            setTimeout(function () {
                const params = {
                    //fields: 'mediaItems.id',
                    pageSize: 100,
                    filters: {
                        mediaTypeFilter: {
                            mediaTypes: [
                                "ALL_MEDIA"// "ALL_MEDIA", "VIDEO","PHOTO"
                            ]
                        }
                    }
                };
                if (nextPageToken)
                    params.pageToken = nextPageToken;
                    
                return axios({
                    method: 'post',
                    url: 'https://photoslibrary.googleapis.com/v1/mediaItems:search',
                    headers: { 
                        Authorization: `Bearer ${context.props.loginCredentials.access_token}` 
                    },
                    contentType: 'application/json',
                    data: params,
                    transformResponse: [function (data) {
                        // Do whatever you want to transform the data
                        if (data)
                            return JSON.parse(data)
                        else
                            return data
                    }],
                    
                }).catch(function (error) {
                    reject(error);
                
                }).then(response => {
                    if (response && response.data && response.data.mediaItems) {
                        
                        for (let m = 0; m < response.data.mediaItems.length; m++)
                            context.props.addMedia( response.data.mediaItems[m].id, response.data.mediaItems[m].mediaMetadata.video ? 'video' : 'image');
                        
                        // run the same function again
                        // 
                        // reject('Temp');
                        resolve ( response.data.nextPageToken );
                        
                    } else {
                        reject('No media returned');
                    }
                });
            },2500)
        });
        
        return promise;
    }
    /*
    
        This method goes through the entire library until the end,
        
    
     */
    async populateLibrary(pageToken) {
        //console.log('populateLibrary');
        this.props.setLibraryPopulating();
        // if we've started populating - let's not start again
        this.startedPopulating = true;
        console.log(pageToken ? 'RESUME' : 'BEGIN','populateLibrary', pageToken ? pageToken.slice(-10) : null);
        
        let nextPageToken = pageToken || 'first';
        while (nextPageToken !== undefined) {
            // @todo needs then and catch here
            nextPageToken = await this.getLibraryItems( nextPageToken !== 'first' ? nextPageToken : null);
            // save in case we lose our progress
            console.log('nextPageToken', typeof nextPageToken, nextPageToken ? nextPageToken.slice(-10) : null);
            window.localStorage.setItem('libraryNextPageToken', nextPageToken);
            
            // in case we lost the browser and we are half way through - we might need to restore this
        }
        // and when we're done - we won't need to redo
        if (nextPageToken === undefined)
            this.props.setLibraryPopulated();
            
        return true;
    }
    
    topUpLibrary() {
        
        
    }
    
    //componentWillMount() {
    //}
    
    //componentDidMount() {
    //    console.log('componentDidMount', window.localStorage.getItem('libraryStatus'), window.localStorage.getItem('libraryNextPageToken'))
        // we hadn't got to the end of the populating - so we need to resume    
    //}
    componentDidUpdate () {
        // we're empty - so we need to start adding
        if (this.props.loginStatus === 'LOGGED_IN') {
            if (this.props.libraryStatus === 'EMPTY') {
                this.populateLibrary();
            
            } else if (!this.startedPopulating && this.props.libraryStatus === 'POPULATING' && window.localStorage.getItem('libraryNextPageToken') !== null) {
                this.populateLibrary(window.localStorage.getItem('libraryNextPageToken'));
    
            }
            
        }
    }
    render () {
        return null;
    }
}

// most data is handed down, but we also need the page that is currently required to be selected
function mapStateToProps(state, props) {
    return state.toJS();
}
// Export the wrapped version
export const BackgroundContainer = connect(mapStateToProps,actionCreators)(Background);
