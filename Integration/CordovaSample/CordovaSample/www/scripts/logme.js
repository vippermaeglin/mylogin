/**
 * OpenFB is a micro-library that lets you integrate your JavaScript application with Facebook.
 * OpenFB works for both BROWSER-BASED apps and CORDOVA/PHONEGAP apps.
 * This library has no dependency: You don't need (and shouldn't use) the Facebook SDK with this library. Whe running in
 * Cordova, you also don't need the Facebook Cordova plugin. There is also no dependency on jQuery.
 * OpenFB allows you to login to Facebook and execute any Facebook Graph API request.
 * @author Christophe Coenraets @ccoenraets
 * @version 0.5
 */
var LogME = (function () {

    var loginURL = 'http://logmein.azurewebsites.net/connect/authorize',

        logoutURL = 'http://logmein.azurewebsites.net/connect/endsession',

    // By default we store fbtoken in sessionStorage. This can be overridden in init()
        tokenStore = window.sessionStorage,

    // The Facebook App Id. Required. Set using init().
        fbAppId,

        context = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/")),

        baseURL = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + context,

    // Default OAuth redirect URL. Can be overriden in init()
        oauthRedirectURL = baseURL + '/oauthcallback.html',

    // Default Cordova OAuth redirect URL. Can be overriden in init()
        cordovaOAuthRedirectURL = baseURL + '/oauthcallback.html',

    // Default Logout redirect URL. Can be overriden in init()
        logoutRedirectURL = baseURL + '/logoutcallback.html',

    // Because the OAuth login spans multiple processes, we need to keep the login callback function as a variable
    // inside the module instead of keeping it local within the login function.
        loginCallback,

    // Indicates if the app is running inside Cordova
        runningInCordova,

    // Used in the exit event handler to identify if the login has already been processed elsewhere (in the oauthCallback function)
        loginProcessed;

    // MAKE SURE YOU INCLUDE <script src="cordova.js"></script> IN YOUR index.html, OTHERWISE runningInCordova will always by false.
    // You don't need to (and should not) add the actual cordova.js file to your file system: it will be added automatically
    // by the Cordova build process
    document.addEventListener("deviceready", function () {
        runningInCordova = true;
    }, false);

    /**
     * Initialize the OpenFB module. You must use this function and initialize the module with an appId before you can
     * use any other function.
     * @param params - init paramters
     *  appId: (Required) The id of the Facebook app,
     *  tokenStore: (optional) The store used to save the Facebook token. If not provided, we use sessionStorage.
     *  loginURL: (optional) The OAuth login URL. Defaults to https://www.facebook.com/dialog/oauth.
     *  logoutURL: (optional) The logout URL. Defaults to https://www.facebook.com/logout.php.
     *  oauthRedirectURL: (optional) The OAuth redirect URL. Defaults to [baseURL]/oauthcallback.html.
     *  cordovaOAuthRedirectURL: (optional) The OAuth redirect URL. Defaults to https://www.facebook.com/connect/login_success.html.
     *  logoutRedirectURL: (optional) The logout redirect URL. Defaults to [baseURL]/logoutcallback.html.
     *  accessToken: (optional) An already authenticated access token.
     */
    function init(params) {

        if (params.appId) {
            fbAppId = params.appId;
        } else {
            throw 'appId parameter not set in init()';
        }

        if (params.tokenStore) {
            tokenStore = params.tokenStore;
        }

        if (params.accessToken) {
            tokenStore.fbAccessToken = params.accessToken;
        }

        loginURL = params.loginURL || loginURL;
        logoutURL = params.logoutURL || logoutURL;
        oauthRedirectURL = params.oauthRedirectURL || oauthRedirectURL;
        cordovaOAuthRedirectURL = params.cordovaOAuthRedirectURL || cordovaOAuthRedirectURL;
        logoutRedirectURL = params.logoutRedirectURL || logoutRedirectURL;

    }

    /**
     * Checks if the user has logged in with openFB and currently has a session api token.
     * @param callback the function that receives the loginstatus
     */
    function getLoginStatus(callback) {
        var token = tokenStore.fbAccessToken,
            loginStatus = {};
        if (token) {
            loginStatus.status = 'connected';
            loginStatus.authResponse = {accessToken: token};
        } else {
            loginStatus.status = 'unknown';
        }
        if (callback) callback(loginStatus);
    }

    /**
     * Login to Facebook using OAuth. If running in a Browser, the OAuth workflow happens in a a popup window.
     * If running in Cordova container, it happens using the In-App Browser. Don't forget to install the In-App Browser
     * plugin in your Cordova project: cordova plugins add org.apache.cordova.inappbrowser.
     *
     * @param callback - Callback function to invoke when the login process succeeds
     * @param options - options.scope: The set of Facebook permissions requested
     * @returns {*}
     */
    function login(callback, options) {

        var loginWindow,
            startTime,
            scope = 'openid',
            redirectURL = runningInCordova ? cordovaOAuthRedirectURL : oauthRedirectURL;

        if (!fbAppId) {
            return callback({status: 'unknown', error: 'LogMe App Id not set.'});
        }

        // Inappbrowser load start handler: Used when running in Cordova only
        function loginWindow_loadStartHandler(event) {
            var url = event.url;
            if (url.indexOf("access_token=") > 0 || url.indexOf("error=") > 0) {
                // When we get the access token fast, the login window (inappbrowser) is still opening with animation
                // in the Cordova app, and trying to close it while it's animating generates an exception. Wait a little...
                var timeout = 600 - (new Date().getTime() - startTime);
                setTimeout(function () {
                    loginWindow.close();
                }, timeout > 0 ? timeout : 0);
                oauthCallback(url);
            }
        }

        // Inappbrowser exit handler: Used when running in Cordova only
        function loginWindow_exitHandler() {
            console.log('exit and remove listeners');
            // Handle the situation where the user closes the login window manually before completing the login process
            if (loginCallback && !loginProcessed) loginCallback({status: 'user_cancelled'});
            loginWindow.removeEventListener('loadstop', loginWindow_loadStopHandler);
            loginWindow.removeEventListener('exit', loginWindow_exitHandler);
            loginWindow = null;
            console.log('done removing listeners');
        }

        if (options && options.scope) {
            scope = options.scope;
        }

        loginCallback = callback;
        loginProcessed = false;

        startTime = new Date().getTime();

        //Got state & nonce from OIDC Sample
        var state = (Date.now() + Math.random()) * Math.random();
        state = state.toString().replace(".", "");
        var nonce = (Date.now() + Math.random()) * Math.random();
        nonce = nonce.toString().replace(".", "");
        var responseType = "code id_token";
        var clientSecret = "JetDev2016!";

        loginWindow = window.open(loginURL + '?client_id=' + encodeURIComponent(fbAppId) + '&redirect_uri=' + encodeURIComponent(redirectURL) + '&client_secret=' + encodeURIComponent(clientSecret) +
            '&response_type=' + encodeURIComponent(responseType) + '&scope=' + encodeURIComponent(scope) + '&state=' + encodeURIComponent(state) + '&nonce=' + encodeURIComponent(nonce), '_blank', 'location=no,clearcache=yes');

        // If the app is running in Cordova, listen to URL changes in the InAppBrowser until we get a URL with an access_token or an error
        if (runningInCordova) {
            loginWindow.addEventListener('loadstart', loginWindow_loadStartHandler);
            loginWindow.addEventListener('exit', loginWindow_exitHandler);
        }
        // Note: if the app is running in the browser the loginWindow dialog will call back by invoking the
        // oauthCallback() function. See oauthcallback.html for details.

    }

    /**
     * Called either by oauthcallback.html (when the app is running the browser) or by the loginWindow loadstart event
     * handler defined in the login() function (when the app is running in the Cordova/PhoneGap container).
     * @param url - The oautchRedictURL called by Facebook with the access_token in the querystring at the ned of the
     * OAuth workflow.
     */
    function oauthCallback(url) {
        // Parse the OAuth data received from Facebook
        var queryString,
            obj;

        loginProcessed = true;
        if (url.indexOf("code=") > 0) {
            queryString = url.substr(url.indexOf('#') + 1);
            obj = parseQueryString(queryString);
            tokenStore.fbCode = obj['code'];
            //alert("code=" + tokenStore.fbCode);
        }
        
        if (url.indexOf("id_token=") > 0) {
            queryString = url.substr(url.indexOf('#') + 1);
            obj = parseQueryString(queryString);
            tokenStore.fbIdToken = obj['id_token'];
            if (loginCallback) loginCallback({status: 'connected', authResponse: {idToken: obj['id_token']}});
        } else if (url.indexOf("error=") > 0) {
            queryString = url.substring(url.indexOf('?') + 1, url.indexOf('#'));
            obj = parseQueryString(queryString);
            if (loginCallback) loginCallback({status: 'not_authorized', error: obj.error});
        } else {
            if (loginCallback) loginCallback({status: 'not_authorized'});
        }
    }

    /**
     * Logout from Facebook, and remove the token.
     * IMPORTANT: For the Facebook logout to work, the logoutRedirectURL must be on the domain specified in "Site URL" in your Facebook App Settings
     *
     */
    function logout(callback) {
        var logoutWindow,
            token = tokenStore.fbIdToken;

        /* Remove token. Will fail silently if does not exist */
        tokenStore.removeItem('fbtoken');

        if (token) {
            logoutWindow = window.open(logoutURL + '?id_token_hint=' + token + '&post_logout_redirect_uri=' + logoutRedirectURL, '_blank', 'location=no,clearcache=yes');
            if (runningInCordova) {
                setTimeout(function() {
                    logoutWindow.close();
                }, 700);
            }
        }

        if (callback) {
            callback();
        }

    }

    /**
     * Lets you make any Facebook Graph API request.
     * @param obj - Request configuration object. Can include:
     *  method:  HTTP method: GET, POST, etc. Optional - Default is 'GET'
     *  path:    path in the Facebook graph: /me, /me.friends, etc. - Required
     *  params:  queryString parameters as a map - Optional
     *  success: callback function when operation succeeds - Optional
     *  error:   callback function when operation fails - Optional
     */
    function api(obj) {

        var method = obj.method || 'GET',
            params = obj.params || {},
            xhr = new XMLHttpRequest(),
            url;

        var code = tokenStore.fbCode;

        //Get token with access code:
        var urlToken = "http://logmein.azurewebsites.net/connect/token";
        var redirectURL = runningInCordova ? cordovaOAuthRedirectURL : oauthRedirectURL;
        var state = (Date.now() + Math.random()) * Math.random();
        state = state.toString().replace(".", "");
        var clientId = "jetdev";
        var clientSecret = "JetDev2016!";
        var params = 'grant_type=authorization_code&client_id=' + encodeURIComponent(clientId) + '&code=' + encodeURIComponent(code) + '&client_secret=' + encodeURIComponent(clientSecret) + '&redirect_uri=' + encodeURIComponent(redirectURL) + '&state=' + encodeURIComponent(state);
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onload = function () {
            // do something to response
            if (xmlHttp.responseText.indexOf("access_token") > 0) {
                if (obj.success) obj.success(JSON.parse(xmlHttp.responseText));
                tokenStore.fbAccessToken = JSON.parse(xmlHttp.responseText)['access_token'];
                //alert("access_token=" + tokenStore.fbAccessToken);


                var accessToken = tokenStore.fbAccessToken;
                params['access_token'] = accessToken;

                url = "http://logmeapi.azurewebsites.net/identity";

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            //alert(xhr.responseText);
                            if (obj.success) obj.success(JSON.parse(xhr.responseText));
                        } else {
                            var error = xhr.responseText ? JSON.parse(xhr.responseText).error : { message: 'An error has occurred' };
                            if (obj.error) obj.error(error);
                        }
                    }
                };
    
                xhr.open("GET", url, true);
                xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
                xhr.send();
                return;
            }
        };
        xmlHttp.open("POST", urlToken, true);
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.send(params);

    }

    /**
     * Helper function to de-authorize the app
     * @param success
     * @param error
     * @returns {*}
     */
    function revokePermissions(success, error) {
        return api({method: 'DELETE',
            path: '/me/permissions',
            success: function () {
                success();
            },
            error: error});
    }

    function parseQueryString(queryString) {
        var qs = decodeURIComponent(queryString),
            obj = {},
            params = qs.split('&');
        params.forEach(function (param) {
            var splitter = param.split('=');
            obj[splitter[0]] = splitter[1];
        });
        return obj;
    }

    function toQueryString(obj) {
        var parts = [];
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
            }
        }
        return parts.join("&");
    }

    // The public API
    return {
        init: init,
        login: login,
        logout: logout,
        revokePermissions: revokePermissions,
        api: api,
        oauthCallback: oauthCallback,
        getLoginStatus: getLoginStatus
    }

}());
