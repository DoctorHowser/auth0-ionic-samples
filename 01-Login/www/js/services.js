angular.module('starter.services', [])

.factory('Auth', function($state) {
  var Auth0Cordova = require('@auth0/cordova');
  var auth0 = require('auth0-js');
  var userProfile = {};

  var auth0Config = {
    // needed for auth0
    clientID: '{CLIENT_ID}',

    // needed for auth0cordova
    clientId: '{CLIENT_ID}',
    domain: '{DOMAIN}',
    callbackURL: location.href,
    packageIdentifier: 'io.ionic.starter'
  };

  var webAuth = new auth0.WebAuth(auth0Config);

  function setSession(authResult) {
    var expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    window.localStorage.setItem('access_token', authResult.accessToken);
    window.localStorage.setItem('id_token', authResult.idToken);
    window.localStorage.setItem('expires_at', expiresAt);
  }

  function isAuthenticated() {
    var expiresAt = JSON.parse(window.localStorage.getItem('expires_at'));
    return Date.now() < expiresAt;
  }

  
  function getProfile(cb) {
    var accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access token must exist to fetch profile');
    }

    webAuth.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        userProfile = profile;
      }
      cb(err, profile);
    });
  }

  function login() {
    var client = new Auth0Cordova(auth0Config);

    var options = {
      scope: 'openid profile offline_access'
    };

    client.authorize(options, function(err, authResult) {
      if (err) {
        throw new Error(err);
      }
      if (authResult && authResult.accessToken && authResult.idToken) {
        setSession(authResult);
      }
    });
  }

  function logout() {
    window.localStorage.removeItem('profile');
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('id_token');
    window.localStorage.removeItem('expires_at');
  }

  return {
    login: login,
    logout: logout,
    getProfile: getProfile,
    isAuthenticated: isAuthenticated,
  };
});
