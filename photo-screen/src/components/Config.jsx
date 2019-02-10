import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import * as actionCreators from '../action_creators';
import {ConfigButtonContainer} from './ConfigButton';
import '../style/Config.css';

/* 
    Top level component for entire Project
 */
 
 // Wait for final event example during resize 
 // 
var waitForFinalEvent = (function () {
    var timers = {};
    return function (callback, ms, uniqueId) {
        if (!uniqueId) {
            uniqueId = "Don't call this twice without a uniqueId";
        }
        if (timers[uniqueId]) {
            clearTimeout (timers[uniqueId]);
        }
        timers[uniqueId] = setTimeout(callback, ms);
    };
})();


class Config extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            buttonVisible: false
        };
    }
    
    componentDidUpdate() {
        // IF LOGGED IN AND SETUP NOT COMPLETE SHOW - 
        // open the panel when we are logged in but haven't done this yet
        if (this.props.configStatus === 'NOT_SET' && this.props.loginStatus === 'LOGGED_IN' && !this.state.open)
            this.setState({
                open: true, 
                buttonVisible: true
            });
    }
    
    makeDay(day, hours) {
        const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

        return <div className="configDay" key={day}>
            <h3>{dayNames[day]}</h3>
            {hours.map(function (hour, key) {
                return <ConfigButtonContainer key={'k'+key+'-'+day} hour={parseInt(key)} day={day} active={hour} />
            })}
        </div>;
    }
    
    toggleOpen() {
        // OTHERWISE JUST SHOW ON BUTTON PRESS
        const context = this;
        // set an interval to hide the button after a bit
        if (this.state.open) {
            setTimeout(function () {
                context.setState({ buttonVisible: false })
            }, 2000);
        }
        
        this.setState({ open: !this.state.open })
        this.props.setConfigComplete();
        
    }
    
    onMouseMove(e) {
        if (!this.state.open) {
            const context = this;
            waitForFinalEvent(function () {
                context.setState({
                    buttonVisible: true
                });
                
                if (context.buttonCloseInterval)
                    clearTimeout(context.buttonCloseInterval);
                
                context.buttonCloseInterval = setTimeout(function () {
                    context.setState({ buttonVisible: false })
                }, 4000);
            });
        }
    }
    
    render() {
        
        if (this.props.loginStatus !== 'LOGGED_IN')
            return null;
        
        
        const context = this;
        
        const wrapperClass = classNames({
            configWrapper: true,
            visible: this.state.buttonVisible || this.state.open
        })
        
        const configClass = classNames({
            configPanel: true,
            open: this.state.open //
        })
        
        const buttonClass = classNames({
            closeButton: true,
            open: this.state.open
        })
        
        const buttonIcon = this.state.open ? 'close' : 'settings';
        
        return <div className={wrapperClass} onMouseMove={this.onMouseMove.bind(this)}>
            <div className={buttonClass}><button onClick={this.toggleOpen.bind(this)}><i className="material-icons md-24 md-light">{buttonIcon}</i></button></div>
            <div className={configClass}>
                <div>
                    <h2>Which hours would you like the screen to be active?</h2>
                    {this.props.configSetup.map(function(day, dayNum) {
                        return context.makeDay(dayNum, day);
                    })}
                    </div>
                </div>
            </div>;
    }
}
// most data is handed down, but we also need the page that is currently required to be selected
function mapStateToProps(state, props) {
    return state.toJS();
}
// Export the wrapped version
export const ConfigContainer = connect(mapStateToProps,actionCreators)(Config);
