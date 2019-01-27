import React from 'react';
import {connect} from 'react-redux';
import * as actionCreators from '../action_creators';
import {ConfigButtonContainer} from './ConfigButton';
import '../style/Config.css';

/* 
    Top level component for entire Project
 */

class Config extends React.Component {
    
    makeDay(day, hours) {
        return <div className="configDay">
            <h3>{day}</h3>
            {hours.map(function (hour, key) {
                return <ConfigButtonContainer hour={key} day={day} active={hour} />
            })}
        </div>;
    }
    
    renderChoice() {
    
    }
    
    render() {
        
        const context = this;
        return <div className="configWrapper"><div>
            <h2>Which hours would you like the screen to be active?</h2>
            {Object.keys(this.props.configSetup).map(function(day) {
                return context.makeDay(day, context.props.configSetup[day]);
            })}
        </div></div>;
    }
}
// most data is handed down, but we also need the page that is currently required to be selected
function mapStateToProps(state, props) {
    return state.toJS();
}
// Export the wrapped version
export const ConfigContainer = connect(mapStateToProps,actionCreators)(Config);
