'use strict';


angular.module('lpApp')
    .controller('NavCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {

        $scope.goBack = function () {
            if (($rootScope.appLocation === 'Launchpad') || ($rootScope.appLocation === 'Welcome')) {
                return false;
            }

            history.back();
        }
    }])
    .controller('WelcomeCtrl', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {

        // Set App Location
        $rootScope.appLocation = 'Welcome';

        // PUBLIC API
        $scope.getStarted = function () {

            $scope.$broadcast('get-started');
        };

        // MESSAGES
        $scope.$on('get-started', function (e) {

            $location.replace().url('/get-started');
        });
    }])
    .controller('GetStartedCtrl', ['$scope', '$rootScope', 'prefillDemoDSP',
        function ($scope, $rootScope, prefillDemoDSP) {

            // Set App Location
            $rootScope.appLocation = 'Get Started';

            $scope.demoDSP = prefillDemoDSP;


        }])
    .controller('HomeCtrl', ['$scope', '$rootScope', '$location', '$timeout', 'getDSPList', 'NotificationService', 'AppStrings',
        function ($scope, $rootScope, $location, $timeout, getDSPList, NotificationService, AppStrings) {

            // Set App Location
            $rootScope.appLocation = 'Home';

            $scope.pageText = AppStrings.getHomeStrings;

            $scope.dsps = getDSPList;


            // PUBLIC API
            $scope.singleTap = function (dsp) {

                $scope.$broadcast('tap:single', dsp);
            };

            $scope.hold = function (dsp) {

                $scope.$broadcast('tap:hold', dsp);
            };


            // PRIVATE API
            // Multitap mode

            $scope._changeModeForward = function (dsp) {

                dsp.modes.next();
            };
            $scope._changeModeBackward = function (dsp) {

                dsp.modes.previous();
            };
            $scope._routeDSP = function (dsp) {
                switch (dsp.modes.currentMode) {

                    case 0:
                        $location.url('/go-to-dsp/' + dsp.id);
                        break;

                    case 1:
                        $location.url('/dsp-settings/' + dsp.id);
                        break;

                    default:
                        break;

                }

                return true;
            };


            // Single Tap/Hold mode
            $scope._launchDSP = function (dsp) {

                $location.url('/go-to-dsp/' + dsp.id);
            };

            $scope._launchDSPSettings = function (dsp) {

                $location.url('/dsp-settings/' + dsp.id);
            };


            // MESSAGES
            $scope.$on('tap:single', function (e, dsp) {

                $scope._launchDSP(dsp);
            });

            $scope.$on('tap:hold', function (e, dsp) {

                $scope._launchDSPSettings(dsp);
            });


        }])
    .controller('LoginCtrl', ['$scope', '$rootScope', '$location', '$q', 'ObjectService', 'AppStorageService', 'getDSPConfig', 'UserService', 'MessageService', 'AppStrings', 'LoadingScreenService',
        function ($scope, $rootScope, $location, $q, ObjectService, AppStorageService, getDSPConfig, UserService, MessageService, AppStrings, LoadingScreenService) {

            // Set App Location
            $rootScope.appLocation = 'Login';

            $scope.overridePageStrings = {
                title: 'Sign In: ' + getDSPConfig.name
            }

            // Set Page Text
            $scope.pageText = ObjectService.extend(AppStrings.getLoginStrings, $scope.overridePageStrings);
            $scope.buttonsText = AppStrings.getButtonStrings;


            $scope.currentDSP = getDSPConfig;
            $scope.user = {};


            // PUBIC API
            $scope.userLogin = function (user) {

                $scope.$broadcast('user:userLogin', user);
            };


            // PRIVATE API

            $scope._userLogin = function (user) {

                var defer = $q.defer();

                UserService.session().save(user,
                    function (response) {
                        defer.resolve(response);
                    },
                    function (response) {
                        defer.reject(response);
                    }
                );

                return defer.promise;
            };


            // MESSAGES

            $scope.$on('user:userLogin', function (e, user) {

                // Start loading screen
                LoadingScreenService.start('Logging in...');

                UserService.currentDSPUrl = $scope.currentDSP.url;
                $scope._userLogin(user).then(
                    function (result) {

                        LoadingScreenService.stop();

                        AppStorageService.User.save(result);
                        AppStorageService.URL.save($scope.currentDSP);
                        $scope.currentDSP['user'] = result;
                        AppStorageService.Apps.save($scope.currentDSP);
                        AppStorageService.Config.save($scope.currentDSP);

                        $location.replace().url('/launchpad');
                    },
                    function (reason) {
                        LoadingScreenService.stop();
                        throw {message: 'Unable to login: ' + MessageService.getFirstMessage(reason)}
                    });
            });
        }])
    .controller('AppSettingsCtrl', ['$scope', '$rootScope', '$location', 'AppStrings', 'ObjectService', 'AppStorageService', 'NotificationService', 'StorageService',
        function ($scope, $rootScope, $location, AppStrings, ObjectService, AppStorageService, NotificationService, StorageService) {

            // Set Location Bar
            $rootScope.appLocation = "App Settings";

            $scope.overridePageStrings = {
                sections: {
                    currentDSPSettings: {
                        title: 'Setup a DreamFactory Services Platform',
                        button: {
                            text: 'Current DSP Settings'
                        }
                    },
                    changeDSP: {
                        title: 'Change DreamFactory Services Platform',
                        button: {
                            text: 'Change DSP'
                        }
                    },
                    resetApp: {
                        title: 'Reset Application',
                        button: {
                            text: 'Reset App'
                        }
                    },
                    aboutApp: {
                        title: 'About DreamFactory',
                        button: {
                            text: 'About DreamFactory App'
                        }
                    }
                }
            };

            $scope.pageText = ObjectService.extend(AppStrings.getAppSettingsStrings, $scope.overridePageStrings);

            // PUBLIC API
            $scope.currentDSPSettings = function () {

                $scope.$broadcast('dsp:currentSettings');
            };

            $scope.changeDSP = function () {

                $scope.$broadcast('dsp:change');
            };

            $scope.resetApp = function () {

                $scope.$broadcast('app:reset');
            };

            $scope.aboutApp = function() {

                $scope.$broadcast('app:about');
            }


            // PRIVATE API
            $scope._currentDSPSettings = function () {

                var dspId = AppStorageService.DSP.CurrentDSP.getCurrentDSPId();

                if (!dspId) {
                    throw {message: 'Current DSP not set.'}
                    return;
                }

                $location.url('/dsp-settings/' + dspId);
            };

            $scope._changeDSP = function () {

                $location.url('/connect-to-dsp');
            };

            // MESSAGES
            $scope.$on('dsp:currentSettings', function (e) {

                $scope._currentDSPSettings();
            });

            $scope.$on('dsp:change', function (e) {

                $scope._changeDSP();
            });

            $scope.$on('app:reset', function (e) {


                var confirmFunc = function () {

                    StorageService.sessionStorage.clear();
                    StorageService.localStorage.clear();
                    $location.replace().url('/logout');
                };

                // Here we build the object that we will pass to the NotificationService
                var confirm = {

                    // We add a custom message to display to the user
                    message: 'You are about to reset the application.  All local data will be erased.',

                    // The call back we wish to be executed if the user confirms.
                    // We built this previously
                    confirmCallback: confirmFunc,

                    // and we add a custom Title for the confirm box
                    title: 'Reset Application'
                };


                // Execute the NotificationService and let the user decide what to do.
                // If they cancel...nothing happens.
                // If they confirm...the DSP is deleted and we move on.
                NotificationService.confirmDialog(confirm);

            });

            $scope.$on('app:about', function(e) {

                $location.url('/about-app');
            })

        }])
    .controller('ConnectDSPCtrl', ['$scope', '$rootScope', 'ObjectService', 'AppStrings', 'getAllDSPs',
        function ($scope, $rootScope, ObjectService, AppStrings, getAllDSPs) {

            // Set App Location
            $rootScope.appLocation = 'Connect To DSP';

            $scope.overridePageStrings = {};

            $scope.pageText = ObjectService.extend(AppStrings.getConnectDSPStrings, $scope.overridePageStrings);

            $scope.anyDSPs = getAllDSPs ? true : false;


        }])
    .controller('DSPSettingsCtrl', ['$scope', '$q', '$rootScope', '$location', 'getDSP', 'AppStorageService', 'SystemService', 'NotificationService', 'StorageService', 'LoadingScreenService',
        function ($scope, $q, $rootScope, $location, getDSP, AppStorageService, SystemService, NotificationService, StorageService, LoadingScreenService) {

            // Set App Location
            $rootScope.appLocation = 'DSP Settings';

            // Store the current DSP
            $scope.currentDSP = getDSP;

            // Extract the UI settings for the current DSP
            $scope.UISettings = getDSP.UISettings;


            // PUBLIC API
            // Facade for the ui
            // This should be self explanatory
            $scope.saveDSPSettings = function (UISettings) {

                $scope.$broadcast('settings:save', UISettings);
            };

            $scope.updateConfig = function () {

                $scope.$broadcast('settings:updateFromServer', $scope.currentDSP);
            };

            $scope.removeDSP = function () {

                $scope.$broadcast('settings:removeDSP');
            };


            // PRIVATE API

            // We need to get the most current config from the server
            // So we make a call passing in the current dsp so we can
            // use the dsp.url to call the right server
            // Use deferred so we can operate on the data later
            $scope._getConfigFromServer = function (dsp) {

                var defer = $q.defer();

                SystemService.config(dsp.url).get(
                    function (response) {
                        defer.resolve(response);
                    },
                    function (response) {
                        defer.reject(response);
                    }
                );

                return defer.promise;
            };


            // MESSAGES
            // This is where we handle the complex aspects of the ui facade(PUBLIC API)

            // We receive the settings:save message with the UI settings passed in
            $scope.$on('settings:save', function (e, UISettings) {

                // Then we save/update the settings on the local storage
                AppStorageService.DSP.UISettings.save($scope.currentDSP, UISettings);

                // Then we notify the user that the settings have been saved
                NotificationService.alertDialog('Settings saved.');

            });

            // We received the settings:updateFromServer message
            $scope.$on('settings:updateFromServer', function (e, dsp) {

                // Start the loading screen so the user knows the program
                // is working
                LoadingScreenService.start('Updating...');

                // We get the new config from the server and then...
                $scope._getConfigFromServer(dsp).then(
                    function (response) {

                        // Update the current DSP config in localStorage with the new config from the server
                        AppStorageService.DSP.Config.save($scope.currentDSP, response);

                        LoadingScreenService.stop();

                    },
                    function (reason) {

                        LoadingScreenService.stop();
                        // We were unable to connect to the server to get a new config
                        // This will alert the user
                        throw {message: 'Unable to connect to server'}
                    }
                )
            });

            // We received the settings:removeDSP message
            // This requires user confirmation
            $scope.$on('settings:removeDSP', function (e) {

                // Because this requires user confirmation we have to setup a function
                // to be called if the user confirms.  We have to attach that function
                // to an object that is passed to the NotificationService.
                var confirmFunc = function () {

                    //  Check if the DSP was deleted
                    if (AppStorageService.DSP.delete($scope.currentDSP)) {

                        // Remove currentDSPId from local storage
                        AppStorageService.DSP.CurrentDSP.removeCurrentDSPId();

                        // Clear the current sessionStorage
                        StorageService.sessionStorage.clear();

                        // Stop loading screen
                        LoadingScreenService.stop();

                        // Reroute on success because this settings pages' data
                        // no longer exists.
                        $location.replace().url('/');
                    }
                };

                var cancelFunc = function () {

                    LoadingScreenService.stop();
                }

                // Here we build the object that we will pass to the NotificationService
                var confirm = {

                    // We add a custom message to display to the user
                    message: 'You are about to delete ' + $scope.currentDSP.name + '.',

                    // The call back we wish to be executed if the user confirms.
                    // We built this previously
                    confirmCallback: confirmFunc,

                    cancelCallback: cancelFunc,

                    // and we add a custom Title for the confirm box
                    title: 'Delete DSP'
                };

                // Execute the NotificationService and let the user decide what to do.
                // If they cancel...nothing happens.
                // If they confirm...the DSP is deleted and we move on.
                NotificationService.confirmDialog(confirm);


            });
        }])
    .controller('GetDSPCtrl', ['$scope', '$q', '$rootScope', '$location', 'SystemService', 'AppStorageService', 'AppStrings', 'LoadingScreenService',
        function ($scope, $q, $rootScope, $location, SystemService, AppStorageService, AppStrings, LoadingScreenService) {

            // Access text for the page
            $scope.pageText = AppStrings.getDSPStrings;

            // Access buttons text for page
            $scope.buttonsText = AppStrings.getButtonStrings;

            // Initialize and empty object to hold our DSP info
            $scope.dsp = $scope.demoDSP || {};


            // PUBLIC API
            // Facade for the ui.  Corresponds to ng-click/ng-submit functions
            // This should be self explanatory
            $scope.getDSP = function (dsp) {
                $scope.$broadcast('dsp:get', dsp);
            };


            // PRIVATE API

            // We need the DSP config so we pass in the dsp
            // that we want to contact and use the dsp.url
            // which we entered in the form
            // Use deferred because we want to operate on this
            // after we get it.
            $scope._getDSP = function (dsp) {

                var defer = $q.defer();

                SystemService.config(dsp.url).get(
                    function (response) {
                        defer.resolve(response)
                    },
                    function (reason) {
                        defer.reject(dsp);
                    });

                return defer.promise;
            };


            // MESSAGES

            // We received the dsp:get message
            $scope.$on('dsp:get', function (e, dsp) {

                // Start the loading screen so the user knows the program
                // is working
                LoadingScreenService.start('Connecting');

                // We pass in the DSP variable that was built from the UI
                // and passed through the $broadcast
                // Then we attach the result of of our getDSP ajax call to
                // a config property
                $scope._getDSP(dsp).then(
                    function (result) {
                        dsp.config = result;


                        // We save the dsp to localStorage
                        // And we set it to the current DSP
                        AppStorageService.DSP.CurrentDSP.setCurrentDSP(AppStorageService.DSP.save(dsp));

                        // Stop loading screen.  The program is done working.
                        LoadingScreenService.stop();

                        // and redirect back to the root(this will work out redirecting to /launchpad)
                        if ($rootScope.authenticated === true) {
                            $location.replace().url('/logout');
                            return;
                        }

                        $location.replace().url('/');

                    },
                    function (reason) {

                        // Stop loading screen.  The program is done working.
                        LoadingScreenService.stop();

                        // We were unable to connect to the DSP so we alert the user
                        throw {message: 'Unable to connect ' + dsp.name + ' at ' + dsp.url}
                    });
            })
        }])
    .controller('SelectPreviousDSPCtrl', ['$scope', '$location', '$rootScope', '$q', 'SystemService', 'AppStrings', 'StorageService', 'AppStorageService', 'LoadingScreenService',
        function ($scope, $location, $rootScope, $q, SystemService, AppStrings, StorageService, AppStorageService, LoadingScreenService) {

            $scope.pageText = AppStrings.getPreviousSelectedDSPStrings;
            $scope.buttonsText = AppStrings.getButtonStrings;


            // PUBLIC API

            $scope.setPreviousDSP = function () {

                $scope.$broadcast('dsp:setPrevious', $scope.tempCurrentDSP);
            };


            // PRIVATE API
            $scope._createDSPList = function () {

                var DSPList = [];

                angular.forEach(AppStorageService.DSP.getAll(), function (obj) {

                    DSPList.push({
                        name: obj.name,
                        id: obj.id
                    })

                });

                return DSPList;
            };

            $scope._currentDSP = function () {
                var currentDSPIndex = null;

                angular.forEach($scope.dsps, function (v, i) {
                    if (v.id == AppStorageService.DSP.CurrentDSP.getCurrentDSPId()) {
                        currentDSPIndex = i;
                    }
                });

                return currentDSPIndex;
            };

            // We need the DSP config so we pass in the dsp
            // that we want to contact and use the dsp.url
            // which we entered in the form
            // Use deferred because we want to operate on this
            // after we get it.
            $scope._getDSP = function (dsp) {

                var defer = $q.defer();

                SystemService.config(dsp.url).get(
                    function (response) {
                        defer.resolve(response)
                    },
                    function (reason) {
                        defer.reject(dsp);
                    });

                return defer.promise;
            };


            // MESSAGES
            $scope.$on('dsp:setPrevious', function (e, dsp) {

                var dsp = AppStorageService.DSP.get(dsp.id);

                // Start the loading screen so the user knows the program
                // is working
                LoadingScreenService.start('Connecting');

                // We pass in the DSP variable that was built from the UI
                // and passed through the $broadcast
                // Then we attach the result of of our getDSP ajax call to
                // a config property
                $scope._getDSP(dsp).then(
                    function (result) {
                        dsp.config = result;
                        //console.log(result);


                        // We save the dsp to localStorage
                        // And we set it to the current DSP
                        AppStorageService.DSP.CurrentDSP.setCurrentDSP(dsp);


                        // Stop loading screen.  The program is done working.
                        LoadingScreenService.stop();

                        // and redirect back to the root(this will work out redirecting to /launchpad)
                        if ($rootScope.authenticated === true) {
                            $location.replace().url('/logout');
                            return;
                        }
                        $location.replace().url('/');

                    },
                    function (reason) {

                        // Stop loading screen.  The program is done working.
                        LoadingScreenService.stop();

                        // We were unable to connect to the DSP so we alert the user
                        throw {message: 'Unable to connect ' + dsp.name + ' at ' + dsp.url}
                    });
            });

            // Initialization

            $scope.dsps = $scope._createDSPList();
            $scope.tempCurrentDSP = $scope.dsps[$scope._currentDSP()];
        }])
    .controller('AboutAppCtrl', ['$scope', 'AppStrings', 'APP_VERSION',
        function ($scope, AppStrings, APP_VERSION) {
            $scope.pageText = AppStrings.getAboutAppStrings;

            $scope.appVersion = APP_VERSION;
        }]);



