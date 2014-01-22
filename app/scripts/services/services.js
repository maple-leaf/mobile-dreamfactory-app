'use strict';


angular.module('lpApp')
    .factory('ObjectService', [function() {
        return {
            hasProperty: function(obj) {
                for(var key in obj) {
                    if(obj.hasOwnProperty(key))
                        return true;
                }
                return false;
            },

            extend: function(destination, source) {
                for (var property in source) {
                    if (source.hasOwnProperty(property)) {
                        destination[property] = source[property];
                    }
                }
                return destination;
            }

        }
    }])
    .factory('UrlService', [function() {

        return {

            makeSlug: function(string) {

                return string.toLowerCase().split(' ').join('-');
            }
        }
    }])
    .factory('AppStrings', [function() {

        return {

            getButtonStrings: {
                submit: {
                    value: 'Submit',
                    text: 'Submit'
                }
            },

            getWelcomeStrings: {
                title: 'Welcome to DreamFactory'
            },

            getHomeStrings: {
                title: 'Home',
                description: 'Available DSPs.'
            },

            getAppSettingsStrings: {
                title: 'App Settings',
                description: 'Administration for this application.'
            },

            getConnectDSPStrings: {
                title: 'Connect to a new DSP',
                description: 'Add a new DreamFactory Services Platform.'
            },

            getDSPStrings: {
                title: 'Connect',
                description: 'Enter a name and url for the DSP you wish to connect to.  The name can be anything you want to reference this DSP.',
                form: {
                    dspName: {
                        label: 'Name',
                        placeholder: 'Enter DSP Name'
                    },
                    dspURL: {
                        label: 'URL',
                        placeholder: 'Enter DSP Url'
                    }
                }
            },

            getLoginStrings: {
                title: "Sign In",
                description: "Sign in to this DSP.",
                form: {
                    email: {
                        label: 'Email',
                        placeholder: 'Enter Email'
                    },
                    password: {
                        label: 'Password',
                        placeholder: 'Enter Password'
                    }

                }
            },

            getLaunchPadStrings: {
                title: 'DSP Home',
                description: 'App Groups and ungrouped apps.'
            },

            getLaunchPadGroupStrings: {
                title: 'Group',
                description: 'App Group'
            },

            getAppInfoStrings: {
                title: 'App Info',
                description: 'Default App Info'
            },

            getPreviousSelectedDSPStrings: {
                title: 'Connect to a previous DSP\'s',
                description: 'Select a DreamFactory Services Platforms you have previously connected to.'
            },

            getProfileStrings: {
                title: 'Profile',
                description: 'Edit user profile'
            },

            getAboutAppStrings: {
                title: 'About',
                description: 'This app displays and launches applications using the DreamFactory Services Platform.'
            },

            getCopyrightStrings: {
                title: 'Copyright',
                description: "Copyright Strings"
            }

        }
    }])
    .factory('StringService', [function() {

        return {

            makeExcerpt: function(string, limit) {

                var excerpt = string.split(' ', limit).join(' ');

                if (string.split(' ').length >= limit) {
                    return excerpt + '...';
                }

                return string;

            },

            makeSlug: function(string) {

              return string.toLowerCase().split(' ').join('-');

            },


            areIdentical: function(stringA, stringB) {

                stringA = stringA || '';
                stringB = stringB || '';


                function _sameLength(stringA, stringB) {
                    return  stringA.length == stringB.length;
                }

                function _sameLetters(stringA, stringB) {

                    var l = Math.min(stringA.length, stringB.length);

                    for (var i =0; i<l; i++) {
                        if (stringA.charAt(i) !== stringB.charAt(i)) {
                            return false;
                        }
                    }
                    return true;
                }

                if (_sameLength(stringA, stringB) && _sameLetters(stringA, stringB)) {
                    return true;
                }

                return false;
            },

            getOriginFromString: function(string) {

                 return string.split('/', 3).join('/');

            }
        }
    }])
    .factory('MessageService', [function() {

        return {

            getFirstMessage: function(response) {

                if (response.data) {
                    return response.data.error[0].message;

                }
                else {
                    return 'There was an Error.  Please contact your system administrator'
                }
            },

            getAllMessages: function(data) {

            }
        }
    }])
    .factory('AppStorageService', ['StorageService', 'StringService', 'ObjectService', function(StorageService, StringService, ObjectService) {

        return {
            DSP: {

                save: function(dsp) {

                    var DSPList = StorageService.localStorage.get('DSPList') || {},
                        counter = DSPList.counter || 0;

                    counter++;
                    DSPList.counter = counter;
                    dsp.id = DSPList.counter;
                    dsp.slug = StringService.makeSlug(dsp.name);
                    DSPList.platforms = DSPList.platforms || {};
                    DSPList.platforms[dsp.id] = dsp;
                    DSPList.platforms[dsp.id].User = {};

                    if (StorageService.localStorage.save('DSPList', DSPList)) {
                        return dsp;
                    }

                    throw {message: 'Unable to save DSP ' + dsp.name}

                },

                get: function(dspId) {

                    var DSPList = StorageService.localStorage.get('DSPList');

                    if (!DSPList.platforms) return false;

                    if(DSPList.platforms[dspId]){
                        return DSPList.platforms[dspId]
                    }

                    throw {message: 'Unable to find DSP' + dspId}

                },

                update: function() {},

                delete: function(dsp) {

                    var DSPList = StorageService.localStorage.get('DSPList');

                    if(DSPList.platforms[dsp.id]){
                        delete DSPList.platforms[dsp.id];
                        StorageService.localStorage.save('DSPList', DSPList);
                        return true;
                    }

                    throw {message: 'Unable to delete DSP' + dsp.name + ' with id of ' + dsp.id}

                },

                getAll: function() {

                    var DSPList = StorageService.localStorage.get('DSPList');

                    if (ObjectService.hasProperty(DSPList.platforms)) {
                        return DSPList.platforms;
                    }

                    return false
                },

                Config: {
                    save: function(dsp, config) {
                        var DSPList = StorageService.localStorage.get('DSPList');

                        if (DSPList.platforms[dsp.id]) {
                            DSPList.platforms[dsp.id].config = config;
                            StorageService.localStorage.save('DSPList', DSPList);
                            return true;
                        }

                        throw {message: 'Unable to save ' + dsp.name + ' settings'}
                    }
                },

                User: {
                    save: function(dsp) {
                        var DSPList = StorageService.localStorage.get('DSPList');

                        console.log(dsp);

                        if (DSPList.platforms[dsp.id]) {

                            DSPList.platforms[dsp.id].User = {email: dsp.email};
                            console.log(DSPList.platforms[dsp.id].User);

                            StorageService.localStorage.save('DSPList', DSPList);
                            return true;
                        }

                        throw {message:'Unable to save ' + dsp.name + ' User settings'}

                    },

                    get: function(dspId) {

                        var DSPList = StorageService.localStorage.get('DSPList');

                        if (!DSPList.platforms) return false;

                        if(DSPList.platforms[dspId]){
                            return DSPList.platforms[dspId].User;
                        }

                        throw {message: 'Unable to find DSP' + dspId}


                    }
                },

                /*
                UISettings: {

                    save: function(dsp, settings) {

                        var DSPList = StorageService.localStorage.get('DSPList');

                        if (DSPList.platforms[dsp.id]) {
                            DSPList.platforms[dsp.id].UISettings = settings;
                            StorageService.localStorage.save('DSPList', DSPList);
                            return true;
                        }

                        throw {message:'Unable to save ' + dsp.name + ' UI settings'}
                    }
                },
                */

                /*
                UserSettings: {

                    save: function(dsp, settings) {
                        var DSPList = StorageService.localStorage.get('DSPList');

                        if (DSPList.platforms[dsp.id]) {
                            DSPList.platforms[dsp.id].UserSettings = settings;
                            StorageService.localStorage.save('DSPList', DSPList);
                            return true;
                        }

                        throw {message:'Unable to save ' + dsp.name + ' User settings'}

                    }
                },
                */

                CurrentDSP: {

                    setCurrentDSP: function(dsp) {

                        var currentDSPId = dsp.id;

                        if (StorageService.localStorage.save('currentDSPId', currentDSPId)) {

                            return true;
                        }

                        throw {message:'Unable to set current DSP Id'}
                    },

                    getCurrentDSPId: function() {
                        var currentDSPId = StorageService.localStorage.get('currentDSPId');

                        return currentDSPId ? currentDSPId : false;
                    },

                    removeCurrentDSPId: function() {

                        StorageService.localStorage.remove('currentDSPId');
                    }
                }
            },

            User: {
                save: function(user) {

                    var User = StorageService.sessionStorage.get('User') || {};

                    User.sessionId = user.session_id;
                    User.displayName = user.display_name;
                    if (User.sessionId.length > 0) {
                        User.guestUser = false;
                        User.authenticated = true;
                    } else {
                        User.guestUser = true;
                        User.authenticated = false;
                    }

                    if (StorageService.sessionStorage.save('User', User)) {
                        return true;
                    }

                    throw {message:'Unable to set User ' + user.displayName}
                },

                get: function() {

                    return StorageService.sessionStorage.get('User');
                }
            },

            URL: {
                save: function(dsp) {

                    var URL = StorageService.sessionStorage.get('URL') || {};

                    URL.currentURL = dsp.url;

                    if (StorageService.sessionStorage.save('URL', URL)) {
                        return true;
                    }

                    throw {message:'Unable to save ' + dsp.name + ' settings'}
                },

                get: function() {

                    return StorageService.sessionStorage.get('URL');
                }
            },

            Apps: {

                save: function(dsp) {
                    var Apps = StorageService.sessionStorage.get('Apps') || {};

                    Apps.appGroups = dsp.user.app_groups;
                    // UnGrouped.name = dsp.UISettings.unGroupedApps.name || 'UnGrouped Apps';
                    // UnGrouped.id = dsp.UISettings.unGroupedApps.id || 0;
                    // UnGrouped.description = dsp.UISettings.unGroupedApps.description || 'Apps not assigned to a group.';
                    // UnGrouped = dsp.user.no_group_apps;
                    Apps['Ungrouped'] = dsp.user.no_group_apps;


                    if (StorageService.sessionStorage.save('Apps', Apps)) {
                        return true;
                    }

                    throw {message:'Unable to save Apps to session.'}
                },

                get: function() {

                    return StorageService.sessionStorage.get('Apps');
                },


                getAppsFromGroup: function(groupId) {

                    var Groups = StorageService.sessionStorage.get('Apps'),
                        Apps = [];

                    angular.forEach(Groups.appGroups, function(obj) {
                        if (obj.id == groupId) {
                            Apps = obj;
                        }
                    });
                    return Apps;
                },

                getSingleApp: function(groupId, appId) {

                    var allApps = this.get(),
                        apps = groupId === 'ungrouped' ? allApps.Ungrouped : this.getAppsFromGroup(groupId).apps,
                        app = {};

                    angular.forEach(apps, function(obj) {
                        if (obj.id == appId) {
                            app = obj;
                        }
                    });

                    if (app) {
                        return app;
                    }

                    throw {message: 'Unable to find app detail for '}
                }

            },

            Config: {
                save: function(dsp) {

                    if (StorageService.sessionStorage.save('Config', dsp)) {
                        return true;
                    }

                    throw {message:'Unable to save Config to session.'}
                },

                get: function() {
                    return StorageService.sessionStorage.get('Config');
                }
            }

        }
    }])
    .factory('StorageService', [function() {
        return {
            localStorage: {

                    //Public API
                    save: function(name, value) {

                        if (typeof value !== 'string' ) {

                            value = angular.toJson(value);
                        }

                        localStorage.setItem(name, value);

                        return true;
                    },

                    get: function(name) {

                        var value = localStorage.getItem(name);

                        if (!value) {
                            return false;
                        }

                        try {
                            value = angular.fromJson(value);
                            return value;
                        }
                        catch(e) {
                            return value;
                        }
                    },

                    getObject: function(name) {

                        return JSON.parse(localStorage.getItem(name));
                    },

                    remove: function(name) {

                        return localStorage.removeItem(name) ? true : false;
                    },

                    clear: function() {

                        localStorage.clear();
                    },

                    getAll: function() {

                        var localData = {};

                        angular.forEach(localStorage, function(v, i) {

                            localData[i] = v;
                        });

                        return localData;
                    }
            },

            sessionStorage: {

                //Public API
                save: function(name, value) {

                    if (typeof value !== 'string' ) {

                        value = angular.toJson(value);
                    }

                    sessionStorage.setItem(name, value);

                    return true;
                },

                get: function(name) {

                    var value = sessionStorage.getItem(name);

                    if (!value) {
                        return false;
                    }

                    try {
                        value = angular.fromJson(value);
                        return value;
                    }
                    catch(e) {
                        return value;
                    }
                },

                getObject: function(name) {

                    return JSON.parse(sessionStorage.getItem(name));
                },

                delete: function(name) {

                    sessionStorage.removeItem(name);
                },

                clear: function() {

                    sessionStorage.clear();
                },

                howMany: function() {

                    return sessionStorage.length();
                },

                getAll: function() {

                    var sessionData = {};

                    angular.forEach(sessionStorage, function(v, i) {

                        sessionData[i] = v;
                    });

                    return sessionData;
                }
            }
        }
    }])
    .factory('AppLaunchService', [function() {


        var windows = {};


        return {

            //Public API


            launchApp: function(app) {

                if (window.open(app.launch_url, app.name, 'location=no,toolbar=yes')) {
                    return true;
                };

                throw {message:'Unable to launch ' + app.name}

            },

            reopenApp: function(app) {

                if (windows[app.id].show()) {
                   return true;
                }

                throw {message:'Unable to ReOpen ' + app.name}

            },

            closeApp: function(appId) {


            },


            hideApp: function(appId) {


            },

            hideAppContainer: function(id) {


            }

        }

    }])
    .factory('UserService', ['$resource', '$q', 'AppStorageService', function($resource) {

        return {

            currentDSPUrl: '',

            session: function() {

                return $resource(this.currentDSPUrl + '/rest/user/session');
            },

            profile: function() {

                return $resource(this.currentDSPUrl + '/rest/user/profile');
            },

            password: function() {

                return $resource(this.currentDSPUrl + '/rest/user/password');
            },

            register: function() {

                return $resource(this.currentDSPUrl + '/rest/user/password');
            },

            reset: function() {

                this.currentDSPUrl = null;
            }
        }
    }])
    .factory('SystemService', ['$resource', function($resource) {
        return {
            config: function(dsp) {
                return $resource(dsp + '/rest/system/config')
            }
        }
    }])
    .factory('NotificationService', ['CordovaReady', '$rootScope', 'ObjectService', function(CordovaReady, $rootScope, ObjectService) {

        return {

            alertDialog: CordovaReady(function(message, alertCallback, title, buttonLabel) {
                navigator.notification.alert(
                    message,
                    function() {
                        if(alertCallback) {
                            $rootScope.$apply(function() {
                                alertCallback.call();
                            })
                        }
                    },
                    title,
                    buttonLabel
                );
            }),

            confirmDialog: CordovaReady(function(options) {

                function defaultConfirmCallback() {
                    return true;
                }

                function defaultCancelCallback() {
                    return false;
                }

                var defaults = {
                    message: 'Are you sure you want to do this?',
                    confirmCallback: defaultConfirmCallback,
                    cancelCallback: defaultCancelCallback,
                    title: 'Confirm',
                    buttonLabels: ['OK', 'Cancel']
                };

                options = ObjectService.extend(defaults, options);

                navigator.notification.confirm(
                    options.message,
                    function (buttonIndex) {
                        if(buttonIndex === 0) {
                            $rootScope.$apply(function() {
                                options.cancelCallback.call();
                            })
                        }
                        if(buttonIndex === 1) {
                            $rootScope.$apply(function () {
                                options.confirmCallback.call();
                            })
                        }
                    },
                    options.title,
                    options.buttonLabels
                );
            })
        }
    }])
    .factory('LoadingScreenService', [function() {

        var body = angular.element('body'),
            mask = '<div id="mask"></div>',
            loading = '<div style="display: inline-block; text-align: center; margin: auto" id="loading"><p><i class="fa fa-cog fa-spin fa-3x"></p></i></div>';


        return {

            start: function(message) {

                var loadingText = message || 'Loading...',
                    width = $(window).outerWidth(),
                    height = $(window).outerHeight();


                body.append(mask);
                body.append(loading);
                angular.element('#loading').append('<p>' + loadingText + '</p>');

                var loadingIconWidth = $('#loading').width(),
                    loadingIconHeight = $('#loading').height();


                angular.element('#mask').css({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: '99998',
                    background: '#000',
                    opacity:.85
                });

                angular.element('#loading').css({
                    zIndex: '99999',
                    position: 'absolute',
                    top: (height - loadingIconHeight) / 2,
                    left: (width - loadingIconWidth) / 2,
                    opacity:.8
                })
            },

            stop: function() {
                angular.element('#loading').remove();
                angular.element('#mask').remove();

            }
        }
    }])
    .factory('CordovaReady', [function() {
        return function (fn) {

            var queue = [];

            var impl = function () {
                queue.push(Array.prototype.slice.call(arguments));
            };

            document.addEventListener('deviceready', function () {
                queue.forEach(function (args) {
                    fn.apply(this, args);
                });
                impl = fn;
            }, false);

            return function () {
                return impl.apply(this, arguments);
            };
        };
    }])
    .factory('UIScrollService', [function() {
        return {


            tileWidth: 110,
            tileHeight: 110,
            numTilesAcross: 3,

            setTileSize: function() {

                if (this.getWindowWidth() <= 320) {
                    this.tileWidth = 85;
                    this.tileWidth = 85;
                }
            },

            getWindowHeight: function() {

                 var height = $(window).outerHeight() - 150;
                // alert(height);
                return height;
            },


            getWindowWidth: function() {

                return $('.tiles-container').outerWidth();
            },

            getGCD: function(x, y) {
                while (y != 0) {
                    var z = x % y;
                    x = y;
                    y = z;
                }
                return x;
            },

            getNumTilesHorizontal: function() {
                return Math.floor(this.getWindowWidth() / this.tileWidth);
            },

            getNumTilesVertical: function() {

                return Math.floor(this.getWindowHeight() / this.tileHeight);
            },


            determineSquares: function() {

                this.setTileSize();
                return (this.getNumTilesHorizontal() * this.getNumTilesVertical());
            },

            divyUpApps: function(items) {

                var groups = items.appGroups ? items.appGroups : [],
                    apps = items.Ungrouped ? items.Ungrouped : [],
                    groupApps = items.apps ? items.apps : [];


                var offset = this.determineSquares(),
                    numToSplit = Math.ceil((groups.length + apps.length + groupApps.length) / offset),
                    out = [],
                    i = 0,
                    panelsObj;


                while (i < numToSplit) {
                    var panel = {
                        current: i,
                        next: i + 1,
                        apps: [],
                        groups: []
                    };

                    if (groups.length > 0) {
                        panel.groups = groups.splice(0, offset);
                    }

                    if (apps.length > 0) {
                        panel.apps = apps.splice(0, offset);
                    }

                    if (groupApps.length > 0) {
                        panel.apps = groupApps.splice(0, offset);
                    }

                    if ((panel.groups.length + panel.apps.length) != offset) {
                        while ((panel.groups.length + panel.apps.length) < offset) {
                            var dummyObject = {
                                id: false
                            };

                            panel.apps.push(dummyObject);
                        }
                    }

                    out.push(panel);
                    i ++;
                }

                panelsObj = {
                    currentPanel: 0,
                    panels: out
                };
                return panelsObj;

            }
        }
    }])
    .factory('EventHandler', [function() {

        var cache = {},
            guidCounter = 1,
            expando = "data" + (new Date).getTime(),
            nextGuid = 1;

        function _fixEvent(event) {
            return event;
        }


        function _getData(elem) {
            var guid = elem[expando];

            if (!guid) {
                guid = elem[expando] = guidCounter++;
                cache[guid] = {};
            }

            return cache[guid];
        }

        function _removeData(elem) {
            var guid = elem[expando];
            if (!guid) return;

            delete cache[guid];
            try {
                delete elem[expando];
            }catch (e){
                if (elem.removeAttribute) {
                    elem.removeAttribute(expando);
                }
            }
        }

        function _addEvent(elem, type, fn) {

            var data = _getData(elem);

            if (!data.handlers) data.handlers = {};

            if (!data.handlers[type]) data.handlers[type] = [];

            if (!fn.guid) fn.guid = nextGuid++;

            data.handlers[type].push(fn);

            if (!data.dispatcher) {
                data.disabled = false;
                data.dispatcher = function(e) {

                    if (data.disabled) return;
                    e = _fixEvent(e);

                    var handlers = data.handlers[e.type];
                    if (handlers) {
                        for (var n = 0; n < handlers.length; n++) {
                            handlers[n].call(elem, e);
                        }
                    }
                }
            }

            if (data.handlers[type].length == 1) {
                elem.addEventListener(type, data.dispatcher, false);
            }

        }

        function _removeEvent(elem, type, fn) {

            var data = _getData(elem);

            if (!data.handlers) return;

            var removeType = function(t) {
                data.handlers[t] = [];
                tidyUp(elem, t);
            }

            if (!type) {
                for (var t in data.handlers) removeType(t);
                return;
            }

            var handlers = data.handlers[type];

            if (!handlers) return;

            if (!fn) {
                removeType(type);
                return;
            }
        }

        function tidyUp(elem, type) {

            function isEmpty(object) {
                for (var prop in object) {
                    return false;
                }

                return true;
            }

            var data = _getData(elem);

            if (data.handlers[type].length === 0) {

                delete data.handlers[type];

                elem.removeEventListener(type, data.dispatcher, false);
            }

            if (isEmpty(data.handlers)) {
                delete data.handlers;
                delete data.dispatcher;
            }

            if (isEmpty(data)) {
                _removeData(elem);
            }
        }


        return {

            getData: function(elem) {
               return _getData(elem);
            },

            removeData: function(elem) {
                _removeData(elem);
            },

            addEvent: function(elem, type, fn) {
                _addEvent(elem, type, fn);

            },

            removeEvent: function(elem, type, fn) {
                _removeEvent(elem)
            }



        }
    }])

