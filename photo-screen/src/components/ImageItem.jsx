import React from 'react';
import {connect} from 'react-redux';
import * as actionCreators from '../action_creators';
import MediaTitle from './MediaTitle';

const classNames = require('classnames');
const timeOnImage = 10000;
/* 
    Component that represents the entire Project. Contains Chapters, which then contain Pages
 */
class ImageItem extends React.Component {
    
    itemBegins () {
        const context = this;
        // fade in
        if (this.props.age === 'new') {
            if (!this.props.mediaData.fadedIn) {
                setTimeout(function () {
                    // fadeIn
                    context.props.setFadedIn();
                },250);
                setTimeout(function () {
                    // getNextMedia
                    context.props.getNextMedia();
                    
                },timeOnImage);
            }
        }
    }
    componentDidUpdate () {
        this.itemBegins();
    }
    componentDidMount() {
        this.itemBegins();   
    }
    
    render() {
        
        // css for image background
        var backgroundStyle = {
            backgroundImage: `url(${this.props.mediaData.baseUrl}=w${window.screen.width}-h${window.screen.height})`
        };
        
        const className = classNames({
            'mediaItem': true,
            'image': true,
            'fadeIn': this.props.mediaData.fadedIn && this.props.age === 'new',
            'old': this.props.age === 'old',
            'new': this.props.age === 'new'
        });

        return <div className={className}>
            <div className="background" style={backgroundStyle} />
            <div className="foreground" style={backgroundStyle} />
            <MediaTitle {...this.props.mediaData} />
        </div>;
    }
};

function mapStateToProps(state, props) {
    const newProps = {};
    for (let p in props)
        newProps[p] = props[p];
    const newState = state.get(props.age + 'MediaItem')
    if (typeof newState === 'object')
        newProps.mediaData = newState.toJS();
    else
        newProps.mediaData = null;
    return newProps;
}

export const ImageItemContainer = connect(mapStateToProps, actionCreators)(ImageItem);
