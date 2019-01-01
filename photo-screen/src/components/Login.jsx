import React from 'react';
import {connect} from 'react-redux';
import GoogleLogin from 'react-google-login';
import Loader from 'react-loader-spinner'
import * as actionCreators from '../action_creators';
const axios = require('axios');

const googleConfig = require('../config/client_id');
const scopes = [
    'https://www.googleapis.com/auth/photoslibrary.readonly',
    //'https://www.googleapis.com/auth/drive.appdata',
    //'https://www.googleapis.com/auth/drive.file',
    //'https://www.googleapis.com/auth/drive.metadata.readonly',
    //'https://www.googleapis.com/auth/drive.photos.readonly',
    //'https://www.googleapis.com/auth/drive.readonly'
];

class Login extends React.Component {
    
    componentWillMount() {
        // see if we have some credentials from a previous session
        const credentialsString = window.localStorage.getItem('credentials');
        if (credentialsString !== null) {
            // save them to the reducer
            const creds = JSON.parse(credentialsString);
            this.props.setCredentials(creds);
        }
        // check localStorage for login credentials - and log the user in if they exist
    }
    
    componentDidMount() {
        const context = this;
        //
        setTimeout(function () {
            // if expires_at is still in the future - then log in
            const loginExpiresIn = Math.round((context.props.expires_at - new Date().getTime())/1000);
            if (loginExpiresIn > 60) {
                // and mark the app as logged in
                context.props.setLoggedIn();
            } else {
                // otherwise attempt a refresh
                context.loginRefresh()
            }
        });
        // check to see if we need to refresh our log in token
        setInterval(function () {
            if (context.props.loginStatus === 'LOGGED_IN' && context.props.expires_at) {
                const loginExpiresIn = Math.round((context.props.expires_at - new Date().getTime())/1000);
                //console.log('loginExpiresIn', loginExpiresIn);
                if (loginExpiresIn < 60 && this.props.loginStatus !== 'REFRESHING') {
                    // otherwise attempt a refresh
                    context.loginRefresh()
                }
            }
        },5000);
    }
    
    loginRefresh() {
        console.log('loginRefresh');
        const context = this;
        this.props.setLoginRefreshing();
        
        // attempt to refresh, login, and show logged out if it didn't work
        axios({
            method: 'post',
            url: 'https://www.googleapis.com/oauth2/v4/token',
            data: {
                'refresh_token': context.props.refresh_token,
                'client_id': googleConfig.web.client_id,
                'client_secret': googleConfig.web.client_secret,
                'grant_type': 'refresh_token'
            },
            transformResponse: [function (data) {
                // Do whatever you want to transform the data
                if (data)
                    return JSON.parse(data)
                else
                    return data
            }],
            
        }).catch(function (error) {
            // handle error
            context.props.setLoginError(error);
            // and mark the app as logged out
            context.props.setLoggedOut();
        
        }).then(response => {
            if (response && response.data && response.data.expires_in) {
                // update the access code and expire time
                const updatedCreds = Object.assign({}, context.props);
                //setTime
                const now = new Date();
                updatedCreds.expires_in = response.data.expires_in;
                updatedCreds.expires_at = now.setTime(now.getTime() + (response.data.expires_in*1000));
                updatedCreds.access_token = response.data.access_token;
                // save the credentials to local storage
                window.localStorage.setItem('credentials', JSON.stringify(updatedCreds));
                // save them to the reducer
                context.props.setCredentials(updatedCreds);
                // and mark the app as logged in
                context.props.setLoggedIn();
            }
        });
    }
    
    loginError(codeResponse, details) {
        this.props.setLoginError(details);
    }
    
    loginResponse(codeResponse) {
        const context = this;
        context.props.setLoggingIn();
        
        axios({
            method: 'post',
            url: 'https://www.googleapis.com/oauth2/v4/token',
            data: {
                'code': codeResponse.code,
                'client_id': googleConfig.web.client_id,
                'client_secret': googleConfig.web.client_secret,
                'redirect_uri': googleConfig.web.redirect_uris[0],
                'grant_type': 'authorization_code'
            },
            transformResponse: [function (data) {
                // Do whatever you want to transform the data
                if (data)
                    return JSON.parse(data)
                else
                    return data
            }],
            
        }).catch(function (error) {
            // handle error
            context.props.setLoginError(error);
            // and mark the app as logged out
            context.props.setLoggedOut();
        
        }).then(response => {
            if (response && response.data && response.data.expires_in) {
                // add another parameter for expires at
                const now = new Date();
                //setTime
                response.data.expires_at = now.setTime(now.getTime() + (response.data.expires_in*1000));
                // save the credentials to local storage
                window.localStorage.setItem('credentials', JSON.stringify(response.data));
                // save them to the reducer
                context.props.setCredentials(response.data);
                // and mark the app as logged in
                context.props.setLoggedIn();
            }
        });
        
    }
    
    render () {
        if (this.props.loginStatus === 'LOGGING_IN') {
            return <Loader 
                 type="TailSpin"
                 color="#ccc"
                 height="50"	
                 width="50"
                 />   
                 
        } else if (this.props.loginStatus === 'LOGGED_OUT') {
            
            return <GoogleLogin
                clientId={googleConfig.web.client_id}
                buttonText="Login"
                responseType="code"
                accessType="offline"
                prompt="consent"
                scope={scopes.join(' ')}
                onSuccess={this.loginResponse.bind(this)}
                onFailure={this.loginError.bind(this)}
                />;
                
        //} else if (this.props.loginStatus === 'REFRESHING') {
        //    return <div>Refreshing login</div>;
                
        } else 
            return null;
    }
}

// most data is handed down, but we also need the page that is currently required to be selected
function mapStateToProps(state, props) {
    return state.get('loginCredentials').toJS();
}
// Export the wrapped version
export const LoginContainer = connect(mapStateToProps,actionCreators)(Login);
