import React from 'react';
import {connect} from 'react-redux';
import ReactPlayer from 'react-player'
import * as actionCreators from '../action_creators';
import MediaTitle from './MediaTitle';

const classNames = require('classnames');
/* 
    Component that represents the entire Project. Contains Chapters, which then contain Pages
 */
class VideoItem extends React.Component {
    
    itemBegins () {
        // console.log('itemBegins', this.props.mediaData);
        const context = this;
        // fade in
        if (this.props.age === 'new') {
            if (!this.props.mediaData.fadedIn) {
                setTimeout(function () {
                    // fadeIn
                    context.props.setFadedIn();
                },250);
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
            'video': true,
            'fadeIn': this.props.mediaData.fadedIn && this.props.age === 'new',
            'old': this.props.age === 'old',
            'new': this.props.age === 'new'
        });

        return <div className={className}>
            <div className="background" style={backgroundStyle} />
            <ReactPlayer className="foreground" url={this.props.mediaData.baseUrl+'=dv'} playing autoPlay muted volume={0} onEnded={this.props.getNextMedia} width='100%' height='100%' />
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

export const VideoItemContainer = connect(mapStateToProps, actionCreators)(VideoItem);
