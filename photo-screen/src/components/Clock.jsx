import React from 'react';
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
        setInterval(
            () => this.setState({ date: new Date() }),
            5000
        );
    }
    
    render() {
        return <div className="clock">{ (this.state.date.getHours()<10?'0':'') + this.state.date.getHours() + ":" + (this.state.date.getMinutes()<10?'0':'') + this.state.date.getMinutes()}</div>;
    }
}

export const ClockContainer = Clock;
