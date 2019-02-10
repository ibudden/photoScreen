import React from 'react';
import {connect} from 'react-redux';
import {ImageItemContainer} from './ImageItem';
import {VideoItemContainer} from './VideoItem';
//import {ClockContainer} from './Clock';
import * as actionCreators from '../action_creators';
import db from './../db';
import '../style/MediaWrapper.css';
import '../style/MediaItem.css';

const axios = require('axios');
/* 
    Component that represents the entire Project. Contains Chapters, which then contain Pages
 */
class MediaWrapper extends React.Component {
    
    getNextMedia() {
        if (this.props.screenIsActive) {
            const context = this;
            return new Promise(function(resolve, reject) {  
                db.media.count().then(function (numRows) {
                    // only do if we have at least two rows
                    // console.log('Total rows:', numRows);
                    
                    if (numRows > 2) {
                        // otherwise get a random id
                        const offset = Math.floor(Math.random() * Math.floor(numRows));
                        // video 
                        // 'AF1QipM6mklCBzjrAhkbnp_OdVjw6hL1UFGdCPeLF6zJ'
                        // 
                        // 
                        //.where({name: "David", age: 43})
                        db.media.offset(offset).limit(1).first().then(function (mediaItem) {
                        //db.media.offset(offset).limit(1).first().then(function (mediaItem) {
                            console.log('mediaItem',mediaItem.googleId);
                            // now look up the full media info from google
                            return axios({
                                method: 'get',
                                url: 'https://photoslibrary.googleapis.com/v1/mediaItems/'+mediaItem.googleId,
                                headers: { 
                                    Authorization: `Bearer ${context.props.loginCredentials.access_token}` 
                                },
                                contentType: 'application/json',
                                //params: params,
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
                                
                                // otherwise - send it to the reducer
                                if (response && response.data) {
                                    // console.log(response.data);
                                    context.props.setNextMedia(response.data);
                                    // increment the accessCount
                                    //db.media.get(mediaItem.id).modify(function(mI) {
                                    //    mI.accessCount += 1; 
                                    //});
                                    resolve(true);
                                    
                                } else {
                                    reject('Error! No media returned.');
                                    // if it's deleted, then delete the db row and throw an error (or re-call function)
                                    context.getNextMedia();
                                }
                            });
                        });
                    }
                });
            });
        }
    }
    
    componentDidUpdate() {
        // if the screen becomes inactive, it'll need a restart when it comes back on
        if (!this.props.screenIsActive)
            this.initialised = false;
        
        if (this.props.loginStatus === 'LOGGED_IN' &&
            this.props.configStatus !== 'NOT_SET' &&
            this.props.libraryStatus !== 'EMPTY' &&
            this.props.screenIsActive && 
            !this.initialised
        ) {
            this.initialised = true;
            this.getNextMedia();
        }
    }
    
    getMediaItems() {
        const items = [];
            
        if (this.props.oldMediaItem)
            items.push({ 
                type: this.props.oldMediaItem.mediaMetadata.photo ? 'image' : 'video',
                id: this.props.oldMediaItem.id.slice(-10),
                age: 'old'
            });
            
        if (this.props.newMediaItem)
            items.push({ 
                type: this.props.newMediaItem.mediaMetadata.photo ? 'image' : 'video',
                id: this.props.newMediaItem.id.slice(-10),
                age: 'new'
            });
            
        return items;
    }
    
    render() {
        if (!this.props.screenIsActive)
            return null;
        
        const context = this;
        let key = 0;
        return <div className="mediaWrapper">
            {this.getMediaItems().map(function (mediaItemData) {
                if (mediaItemData.type === 'image')
                    return <ImageItemContainer getNextMedia={context.getNextMedia.bind(context)} key={'mediaItem-'+(key++)} {...mediaItemData} />
                else if (mediaItemData.type === 'video')
                    return <VideoItemContainer getNextMedia={context.getNextMedia.bind(context)} key={'mediaItem-'+(key++)} {...mediaItemData} />
                return null;
            })}
        </div>;
    }
};

function mapStateToProps(state) {
    return state.toJS();
}

export const MediaWrapperContainer = connect(mapStateToProps, actionCreators)(MediaWrapper);
