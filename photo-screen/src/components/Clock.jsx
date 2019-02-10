import React from 'react';
import {connect} from 'react-redux';
import * as actionCreators from '../action_creators';
import '../style/Clock.css';

/* 
    Top level component for entire Project
 */
class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {date: new Date()};
    }
    
    componentDidMount() {
        const context = this;
        setInterval(function () {
            
            const now = new Date();
            context.setState({ date: now });
            
            // and now work out if the screen should be active
            // 
            // 
            // We need the day and the hour
            // and toggle the screen
            // console.log(context.props.configSetup[now.getDay()][now.getHours()]);
            const screenIsActive = context.props.configSetup[now.getDay()][now.getHours()];
            if (screenIsActive !== context.props.screenIsActive)
                context.props.setScreenActive( screenIsActive );
            
            // @TODO reload every midnight - to get up to date code...
            
            
        }, 5000);
    }
    
    render() {
        if (!this.props.screenIsActive)
            return null;
            
        return <div className="clock">{ (this.state.date.getHours()<10?'0':'') + this.state.date.getHours() + ":" + (this.state.date.getMinutes()<10?'0':'') + this.state.date.getMinutes()}</div>;
    }
}

// most data is handed down, but we also need the page that is currently required to be selected
function mapStateToProps(state, props) {
    return state.toJS();
}
// Export the wrapped version
export const ClockContainer = connect(mapStateToProps,actionCreators)(Clock);
