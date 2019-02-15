import React from 'react';
import {connect} from 'react-redux';
//import Loader from 'react-loader-spinner'
import * as actionCreators from '../action_creators';
import db from './../db';
const axios = require('axios');

class Background extends React.Component {
    
    addMedia(id, mediaType) {
        return new Promise(function (resolve,reject) {
            // console.log('check',id, mediaType);
            // see if the media exists
            db.media.where({googleId: id}).first(mediaItem => {
                if (mediaItem && mediaItem.googleId) {
                    // console.log('action_creators.addMedia - Already in: '+id.slice(-10));
                    resolve(false);//, mediaItem
                    
                } else {
                    db.media.add({
                        googleId: id, 
                        accessCount: 0,
                        timeAdded: new Date().getTime(),
                        mediaType: mediaType
                    }).then(function () {
                        //console.log('action_creators.addMedia - Added: '+mediaType+' '+id.slice(-10));
                        resolve(true);
                        
                    }).catch(function (e) {
                        reject("Error: " + (e.stack || e));
                    });
                }
                    
            }).catch(e => {
                reject("Error: " + (e.stack || e));
            });
        });
    }
    
    
    async getLibraryItems(nextPageToken) {
        // console.log('getLibraryItems');
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
                        
                        const promises = [];
                        // 
                        for (let m = 0; m < response.data.mediaItems.length; m++)
                            promises.push( context.addMedia( response.data.mediaItems[m].id, response.data.mediaItems[m].mediaMetadata.video ? 'video' : 'image') );
                            
                        Promise.all(promises).then(function(added) {
                            resolve ({ 
                                nextPageToken: response.data.nextPageToken, 
                                numAdded: added.filter(v => v).length 
                            });
                        });
                        
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
        // console.log('populateLibrary');
        this.props.setLibraryPopulating();
        // if we've started populating - let's not start again
        this.startedPopulating = true;
        console.log(pageToken ? 'RESUME' : 'BEGIN','populateLibrary', pageToken ? pageToken.slice(-10) : null);
        
        let mediaAddOutcome = {
            nextPageToken: pageToken || 'first'
        };
        //
        while (mediaAddOutcome.nextPageToken !== undefined) {
            // @todo needs then and catch here
            mediaAddOutcome = await this.getLibraryItems( mediaAddOutcome.nextPageToken !== 'first' ? mediaAddOutcome.nextPageToken : null);
            // save in case we lose our progress
            // console.log('nextPageToken', typeof mediaAddOutcome.nextPageToken, mediaAddOutcome.nextPageToken ? mediaAddOutcome.nextPageToken.slice(-10) : null);
            window.localStorage.setItem('libraryNextPageToken', mediaAddOutcome.nextPageToken);            
            // in case we lost the browser and we are half way through - we might need to restore this
        }
        // and when we're done - we won't need to redo
        if (mediaAddOutcome.nextPageToken === undefined) {
            this.props.setLibraryPopulated();
            // and set the top up process running
            this.topUpLibrary();
        }
            
        return true;
    }
    
    topUpLibrary() {
        // console.log('topUpLibrary')
        const context = this;
        this.toppingUp = true;
        
        setInterval(async function () {
            let mediaAddOutcome = {
                nextPageToken: 'first'
            };
            let emptyAttempts = 2;
            
            while (mediaAddOutcome.nextPageToken !== undefined) {
                // @todo needs then and catch here
                mediaAddOutcome = await context.getLibraryItems( mediaAddOutcome.nextPageToken !== 'first' ? mediaAddOutcome.nextPageToken : null);
                // save in case we lose our progress
                // console.log('nextPageToken', typeof mediaAddOutcome.nextPageToken, mediaAddOutcome.nextPageToken ? mediaAddOutcome.nextPageToken.slice(-10) : null);
                console.log('numAdded', mediaAddOutcome.numAdded);
                
                if (mediaAddOutcome.numAdded === 0)
                    emptyAttempts--;
                    
                //console.log('failedAttempts', emptyAttempts)
                if (emptyAttempts <= 0) {
                    //console.log('break')
                    break;
                }
            }
            
        }, 1000*60*60);
    }
    
    componentDidUpdate () {
        // we're empty - so we need to start adding
        if (this.props.loginStatus === 'LOGGED_IN') {
            //console.log('Background::componentDidUpdate', this.props);
            
            if (!this.startedPopulating) {
                if (this.props.libraryStatus === 'EMPTY' || this.props.libraryStatus === 'POPULATING') {
                    //console.log('Background::EMPTY');
                    this.populateLibrary(window.localStorage.getItem('libraryNextPageToken'));

                } else if (this.props.libraryStatus === 'POPULATED' && !this.toppingUp) {
                    this.topUpLibrary();
                    
                }
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
