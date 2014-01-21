'use strict';

// This is our app router.  Lots of interesting stuff happens here.
// This defines the routes and preloads data for those routes.
// It also helps handle setting headers for requests among other app functions.

// First we define our top level app module and include a few sub modules
// ngAnimate - for animating
// ngRoute - for, obviously, routing
// ngResource - for using the DreamFactory Services platform
// hmTouchEvents - which is an angular Hammer JS module for swipe

var lpApp = angular.module('lpApp', ['ngAnimate', 'ngRoute', 'ngResource', 'hmTouchEvents'])

    // App Version
    .constant('APP_VERSION', '0.8.6')

    // Default name that is used to populate the 'Get Started' page's DSP name field.
    .constant('DEFAULT_DSP_NAME', 'Demo DSP')

    // Default url that is used to populate the 'Get Started' page's DSP url field
    .constant('DEFAULT_DSP_URL', 'https://next.cloud.dreamfactory.com')

    // This is the router.  It takes care of all the links inside the app.
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider

            // The base route is very simple.  It checks to see if you have setup a DSP.  If not
            // It routes to the 'Welcome' page.
            // If you do have a DSP setup it routes you to '/go-to-dsp/:dsp' which sets everything up
            // for the current DSP
            .when('/', {
                resolve: {

                    // We store all our info through a service called 'AppStorageService'.
                    // For more info on this service see 'app/scripts/services/services.js'.
                    hasDSP: ['$location', 'AppStorageService', function($location, AppStorageService){

                        // First we'll grab a reference to the current DSP
                        // If there is no DSP the AppStorage method will return false;
                        var currentDSP = AppStorageService.DSP.CurrentDSP.getCurrentDSPId();

                        // Check if we have a current DSP set
                        if (currentDSP) {

                            // We do so lets redirect right to it
                            $location.replace().url('/go-to-dsp/' + currentDSP)

                        }else {

                            // We don't have a current DSP so we route to the welcome screen
                            // to deal go through the process of adding a DSP
                            $location.replace().url('/welcome')
                        }
                    }]
                }
            })

            // This routes the Welcome page.  It's pretty boring as there isn't much going on.
            // A lot of what happens here is taken care of through the template
            .when('/welcome', {
                templateUrl: 'views/public/welcome.html',
                controller: 'WelcomeCtrl'
            })

            // This routes the Get Started page.  Pretty boring as well.
            .when('/get-started', {
                templateUrl: 'views/public/get-started.html',
                controller: 'GetStartedCtrl'
            })
            // We no longer use the Home route.
            // remove this
            /*
            .when('/home', {
                templateUrl:'views/public/home.html',
                controller: 'HomeCtrl',
                resolve: {
                    getDSPList: ['AppStorageService', '$q', '$location', function(AppStorageService, $q, $location) {

                        var dspList = AppStorageService.DSP.getAll();

                        angular.forEach(dspList, function(obj) {

                            if(!obj['modes']) {
                                obj['modes'] = {
                                    length: 0,
                                    currentMode: 0,
                                    add: function(mode) {
                                        Array.prototype.push.call(this, mode)
                                    },
                                    next: function() {
                                        if (this.currentMode === (this.length-1)) {
                                            this.currentMode = 0;
                                        }
                                        else {
                                            this.currentMode++
                                        }
                                    },

                                    previous: function() {
                                        if (this.currentMode === 0) {
                                            this.currentMode = this.length -1
                                        }
                                        else {
                                            this.currentMode--
                                        }
                                    }

                                };
                                obj.modes.add('Home');
                                obj.modes.add('Settings');
                            }
                        });

                        if (dspList) {
                            return dspList;
                        }
                        else {
                            $location.replace().url('/welcome');
                        }

                        return false;

                    }]
                }
            })
            */

            // This routes to app settings.  Boring again.

            .when('/app-settings', {
                templateUrl: 'views/public/settings/app-settings.html',
                controller: 'AppSettingsCtrl'
            })

            // No longer used
            // remove this
            /*
            .when('/dsp-settings', {
                templateUrl: 'views/public/settings/dsp-settings.html',
                controller: 'DSPListCtrl',

                // This resolves data before the route is completed.  What does this mean?
                // In this case we inject the AppStorageService.  Then we ask it to get
                // all the info about our currently stored DSP.  It does nad we return that
                // for use in the controller.  Now that data is ready for use as soon as the
                // controller loads.
                resolve: {

                    getDSPList:['AppStorageService', function(AppStorageService) {

                        return AppStorageService.DSP.getAll();
                    }]
                }
            })

            */


            .when('/dsp-settings/:dsp', {
                templateUrl: 'views/public/settings/dsp-settings-expand.html',
                controller: 'DSPSettingsCtrl',

                // This resolves data before the route is completed.  What does this mean?
                // In this case we inject the AppStorageService.  Then we ask it to get
                // all the info about our currently stored DSP.  It does and we return that
                // for use in the controller.  Now that data is ready for use as soon as the
                // controller loads.
                resolve: {

                    // For more info on this service see 'app/scripts/services/services.js'.
                    getDSP:['$route', 'AppStorageService', function($route, AppStorageService) {

                        return AppStorageService.DSP.get($route.current.params.dsp);
                    }]
                }
            })
            .when('/connect-to-dsp', {
                templateUrl: 'views/public/connect-to-dsp.html',
                controller: 'ConnectDSPCtrl',
                resolve: {

                    // For more info on this service see 'app/scripts/services/services.js'.
                    getAllDSPs: ['AppStorageService', function(AppStorageService) {

                      return AppStorageService.DSP.getAll();
                    }]
                }
            })
            .when('/go-to-dsp/:dsp', {
                resolve: {
                    getDSPConfig: ['$route', '$q', '$location', 'AppStorageService', 'UserService', 'MessageService', 'LoadingScreenService',
                        function ($route, $q, $location, AppStorageService, UserService, MessageService, LoadingScreenService) {

                            // Get the currently selected DSP info out of our localStorage
                            var dsp = AppStorageService.DSP.get($route.current.params.dsp);

                            /*
                            // Is this the current DSP?
                            if (dsp.url === AppStorageService.URL.get().currentURL) {

                                // It is so just take us to launchpad for this DSP
                                $location.replace().url('/launchpad');

                                // Stop executing
                                return false;
                            }
                            */


                            // This is a different DSP.
                            // Do we need to be authorized to access?
                            if (!dsp.config.allow_guest_user) {

                                // Yes we do.  No guest users allowed
                                // Render login page
                                $location.replace().url('/login/' + dsp.id);

                                // Stop Executing
                                return false;
                            }


                            // This function is called below.
                            // It will retrieve our session which will contain
                            // what apps we have access to.
                            // Use deferred because we have to operate on that data when
                            // it comes back.  No fire and forget here.
                            function _goDSP () {

                                var defer = $q.defer();

                                UserService.session().get(
                                    function (response) {
                                        defer.resolve(response);
                                    },
                                    function (response) {
                                        defer.reject(response)
                                    }
                                );

                                return defer.promise;
                            }

                            // We allow guests or are already logged in.  Let's get the user information
                            // and setup the dsp for access.
                            // First, we set the url for the DSP we will make a call to
                            UserService.currentDSPUrl = dsp.url;

                            // Start the loading screen
                            LoadingScreenService.start("Loading");

                            // Then grab our session and store some info
                            // about what we're doing in the browser sessionStorage
                            _goDSP().then(function (result) {

                                    // Store some info about our user
                                    // We store the session id to use in our http header.
                                    // We also store a boolean called 'authenticated' that we use
                                    // to show/hide UI elements
                                    AppStorageService.User.save(result);

                                    // We save our current working URL just in case we need to
                                    // know about where we're looking
                                    AppStorageService.URL.save(dsp);

                                    // We store the result from our async call(which was deferred)
                                    // in a variable called 'user' as it contains 'User' information.
                                    // See description of _goDSP function above
                                    dsp['user'] = result;

                                    // This requires the dsp.user property we just assigned to sort, group,
                                    // and store our apps for display.
                                    AppStorageService.Apps.save(dsp);

                                    // We also save the current DSP Config so we can reference it quickly
                                    AppStorageService.Config.save(dsp);


                                    // Stop loading screen.  The program is done working.
                                    LoadingScreenService.stop();

                                    // Last but not least...let's go see what we've loaded in launchpad
                                    $location.url('/launchpad');

                                    // Stop Executing
                                    return false;
                                },
                                function(reason) {


                                    // Stop loading screen.  The program is done working.
                                    LoadingScreenService.stop();

                                    // There was an error
                                    // Alert the user
                                    throw {message: 'Unable to login: ' + MessageService.getFirstMessage(reason)}
                                });

                        }]
                }
            })
            .when('/login', {
                resolve: {
                    getDSPId: ['$location', 'AppStorageService',
                        function($location, AppStorageService) {
                            $location.replace().url('/login/' + AppStorageService.DSP.CurrentDSP.getCurrentDSPId());

                    }]
                }
            })
            .when('/login/:dsp', {
                templateUrl: 'views/public/login.html',
                controller: 'LoginCtrl',
                resolve: {
                    getDSPConfig: ['$route', '$location', 'AppStorageService',
                        function($route, $location, AppStorageService) {
                            var dsp = AppStorageService.DSP.get($route.current.params.dsp);

                            if (!dsp) {
                                $location.replace().url('/');
                                return;
                            }

                            return dsp;
                    }]
                }
            })
            .when('/logout', {
                resolve: {
                    logout:['$location', '$rootScope', '$http', 'UserService', 'StorageService',
                        function($location, $rootScope, $http, UserService, StorageService) {


                            StorageService.sessionStorage.clear();
                            UserService.session().delete();
                            $http.defaults.headers.common['X-DreamFactory-Session-Token'] = '';
                            UserService.reset();
                            $rootScope.authenticated = false;
                            $rootScope.guestUser = false;
                            $location.path('/');
                    }]
                }
            })
            .when('/launchpad', {
                templateUrl: 'views/launchpad.html',
                controller: 'LaunchPadCtrl',
                resolve: {
                    getGroups: ['AppStorageService', function(AppStorageService) {

                        return AppStorageService.Apps.get();

                    }],

                    getDSPInfo: ['AppStorageService', function(AppStorageService) {

                        return AppStorageService.Config.get();
                    }]
                }
            })
            .when('/launchpad/:groupId',{
                templateUrl: 'views/launchpad.html',
                controller: 'LaunchPadGroupCtrl',
                resolve: {
                    getApps: ['$route', 'AppStorageService', function($route, AppStorageService) {

                        return AppStorageService.Apps.getAppsFromGroup($route.current.params.groupId);

                    }],

                    getDSPInfo: ['AppStorageService', function(AppStorageService) {

                        return AppStorageService.Config.get();
                    }]

                }
            })
            .when('/app-detail/:groupId/:appId', {
                templateUrl: 'views/app-detail.html',
                controller: 'AppDetailCtrl',
                resolve: {
                    getAppInfo: ['$route', 'AppStorageService', function($route, AppStorageService) {

                        return  AppStorageService.Apps.getSingleApp($route.current.params.groupId, $route.current.params.appId);

                    }]
                }
            })
            .when('/profile', {
                templateUrl: 'views/profile.html',
                controller: 'ProfileCtrl',
                resolve: {
                    userInfo:['UserService', '$q', function(UserService, $q) {

                        var defer = $q.defer();

                        UserService.profile().get(
                            function(response) {
                                defer.resolve(response);
                            },
                            function(response) {
                                defer.reject(response);
                            }
                        );

                        return defer.promise;
                    }],

                    userApps: ['UserService', '$q', function(UserService, $q) {

                        var defer = $q.defer(),
                            apps = [];

                        function getAppsFromGroups(response) {
                            angular.forEach(response.app_groups, function(group, index){
                                angular.forEach(group.apps, function(app, i) {
                                    apps.push(app);
                                });
                            });
                        }

                        function getAppsFromNoGroup(response) {
                            angular.forEach(response.no_group_apps, function(group, index){
                                angular.forEach(group.apps, function(app, i) {
                                    apps.push(app);
                                });
                            });
                        }

                        UserService.session().get(
                            function(response) {
                                getAppsFromGroups(response);
                                getAppsFromNoGroup(response);
                                defer.resolve(apps);
                            },
                            function(response) {
                                defer.reject(response);
                            }
                        );

                        return defer.promise;
                    }]
                }
            })
            .when('/about-app', {
                templateUrl: 'views/public/about-app.html',
                controller: 'AboutAppCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }])
    .config(['$httpProvider', function($httpProvider) {

        $httpProvider.defaults.headers.common['X-DreamFactory-Application-Name'] = 'launchpad';

        /*
        var interceptor = function($rootScope, $location, $q) {

            var success = function(response) {

                return response;
            };

            var error = function(response) {

                if (response.status == 401) {

                    console.log(response)
                }

                return $q.reject(response);
            };

            return function(promise) {

                return promise.then(success, error);
            }

        }
        */
    }])
    .config(['$provide', function ($provide) {
        $provide.decorator('$exceptionHandler', ['$delegate', '$injector', function ($delegate, $injector) {
            return function (exception, cause) {

                $injector.invoke(['NotificationService', function (NotificationService) {

                    NotificationService.alertDialog(exception.message);
                }]);

                return $delegate(exception, cause);
            }
        }]);
    }])

    .run(['$route', '$rootScope', '$location', '$http', 'UserService', 'AppStorageService', 'EventHandler', 'NotificationService',
        function ($route, $rootScope, $location, $http, UserService, AppStorageService, EventHandler, NotificationService) {

        $rootScope.$on('$routeChangeStart', function(scope, next, current) {


            var protectedRoutes = [
                '/launchpad/:groupId',
                '/launchpad',
                '/profile'
            ];

            var confirmFunc = function() {
                navigator.app.exitApp();
            }

            // Here we build the object that we will pass to the NotificationService
            var confirm = {

                // We add a custom message to display to the user
                message: 'Quit DreamFactory?',

                // The call back we wish to be executed if the user confirms.
                // We built this previously
                confirmCallback: confirmFunc,

                // and we add a custom Title for the confirm box
                title: 'Confirm'
            };

            var exitApp = function() {
                NotificationService.confirmDialog(confirm)
            };

            var path = next.$$route.originalPath;

            if (path === '/launchpad') {
                EventHandler.addEvent(document, 'backbutton', exitApp);
            }
            else {
                EventHandler.removeEvent(document, 'backbutton', exitApp);
            }

            $rootScope.$broadcast('numPanels', 0);

            angular.forEach(protectedRoutes, function(v, i) {
                if (path === v) {

                    if (AppStorageService.User.get().sessionId) {
                        $http.defaults.headers.common['X-DreamFactory-Session-Token'] = AppStorageService.User.get().sessionId;
                    }

                $rootScope.authenticated = AppStorageService.User.get().authenticated;
                $rootScope.guestUser = AppStorageService.User.get().guestUser;

                    UserService.currentDSPUrl = AppStorageService.URL.get().currentURL;
                    UserService.session().get(
                        function(response) {
                            $location.url();
                        },
                        function(response) {

                            $location.url('/');
                        }
                    )
                }
            })
        })
    }]);
