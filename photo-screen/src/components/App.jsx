import React from 'react';
import {connect} from 'react-redux';
import {LoginContainer} from './Login';
import {ConfigContainer} from './Config';
import {ClockContainer} from './Clock';
import {BackgroundContainer} from './Background';
import {MediaWrapperContainer} from './MediaWrapper';
import '../style/App.css';

class App extends React.Component {
    render() {
        return <div>
            <LoginContainer />
            <ConfigContainer />
            <ClockContainer />
            <BackgroundContainer />
            <MediaWrapperContainer />
        </div>;
    }
}

function mapStateToProps(state) {
    return state.toJS();
}

export const AppContainer = connect(mapStateToProps, null)(App);
