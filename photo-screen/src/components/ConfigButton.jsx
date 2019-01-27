import React from 'react';
import {connect} from 'react-redux';
import * as actionCreators from '../action_creators';

/* 
    Top level component for entire Project
 */

class ConfigButton extends React.Component {
    
    toggleHour() {
        this.props.toggleConfigHour(this.props.day, this.props.hour)
    }
    
    render() {
        const hourIsActive = this.props.active ? 'active' : '';
        return <button onClick={this.toggleHour.bind(this)} className={hourIsActive}><span>{this.props.hour}</span></button>
    }
}

// Export the wrapped version
export const ConfigButtonContainer = connect(null,actionCreators)(ConfigButton);
