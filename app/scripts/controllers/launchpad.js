'use strict';


angular.module('lpApp')
    .controller('LaunchPadCtrl', ['$scope', '$rootScope', '$location', '$timeout', 'getGroups', 'getDSPInfo', 'AppLaunchService', 'AppStrings', 'ObjectService', 'UIScrollService',
        function ($scope, $rootScope, $location, $timeout, getGroups, getDSPInfo, AppLaunchService, AppStrings, ObjectService, UIScrollService) {


            // Set App Location
            $rootScope.appLocation = 'Launchpad';

            $scope.overridePageStrings = {
                title: getDSPInfo.name,
                description: ''
            };

            $scope.pageText = ObjectService.extend(AppStrings.getLaunchPadStrings, $scope.overridePageStrings);

            $scope.panelsObj = UIScrollService.divyUpApps(getGroups);


                // PUBLIC API

            $scope.singleTapGroup = function (group) {

                group.id ? $scope.$broadcast('tap:single:group', group) : false;
            };

            $scope.singleTapApp = function (app) {

                app.id ? $scope.$broadcast('tap:single:app', app) : false;
            };

            $scope.holdApp = function(app) {

                app.id ? $scope.$broadcast('hold:app', app) : false;
            };


            // PRIVATE API

            $scope._launchApp = function (app) {

                AppLaunchService.launchApp(app);
            };

            $scope._launchGroup = function (group) {

                $location.url('/launchpad/' + group.id)
            };

            $scope._launchAppDetail = function(group, app) {

                $location.url('/app-detail/'+ group.id + '/' + app.id);
            };


            // MESSAGES

            $scope.$on('tap:single:group', function (e, group) {

                $scope._launchGroup(group);
            });

            $scope.$on('tap:single:app', function (e, app) {

                $scope._launchApp(app);
            });

            $scope.$on('hold:app', function(e, app) {

                var group = {
                    id: 'ungrouped'
                };

                $scope._launchAppDetail(group, app);
            });

            $scope.$on('swipe:down', function(e) {
                console.log(getDSPInfo);

                $location.replace().url('/go-to-dsp/' + getDSPInfo.id);
            })


        }])
    .controller('LaunchPadGroupCtrl', ['$scope', '$rootScope', '$location', 'getApps', 'getDSPInfo', 'AppLaunchService', 'AppStrings', 'ObjectService', 'UIScrollService',
        function ($scope, $rootScope, $location, getApps, getDSPInfo, AppLaunchService, AppStrings, ObjectService, UIScrollService) {

            // Set App Location
            $rootScope.appLocation = 'LaunchPad Group';



            $scope.overridePageStrings = {
                title: getDSPInfo.name + ': ',
                group: getApps.name,
                description: ''
            };


            $scope.pageText = ObjectService.extend(AppStrings.getLaunchPadGroupStrings, $scope.overridePageStrings);


            // Variables
            $scope.panelsObj = UIScrollService.divyUpApps(getApps);

            $scope.group = getApps;


            // PUBLIC API
            $scope.singleTap = function (app) {

                $scope.$broadcast('tap:single', app);
            };

            $scope.holdApp = function(app) {

                $scope.$broadcast('hold:app', app);
            };



            // PRIVATE API

            $scope._launchApp = function (app) {

                AppLaunchService.launchApp(app);
            };

            $scope._launchAppDetail = function(group, app) {

                $location.url('/app-detail/'+ group.id + '/' + app.id);
            };


            // MESSAGES
            $scope.$on('tap:single', function (e, app) {

                $scope._launchApp(app);
            });


            $scope.$on('hold:app', function(e, app) {

                $scope._launchAppDetail($scope.group, app);
            });
        }])
    .controller('AppDetailCtrl', ['$scope', '$rootScope', '$location', 'getAppInfo', 'AppLaunchService', 'AppStrings', 'ObjectService',
        function ($scope, $rootScope, $location, getAppInfo, AppLaunchService, AppStrings, ObjectService) {

            // Set App Location
            $rootScope.appLocation = 'App Detail';

            $scope.overridePageStrings = {
                title: 'App Info: ' + getAppInfo.name,
                description: '',
                info: getAppInfo
            };

            $scope.app = getAppInfo;

            $scope.pageText = ObjectService.extend(AppStrings.getAppInfoStrings, $scope.overridePageStrings);


            $scope.moreInfoData = false;

            // PUBLIC API

            $scope.launchApp = function() {

                $scope.$broadcast('app:launch');
            };

            $scope.moreDetail = function() {

                $scope.$broadcast('app:moreDetail');
            };


            // PRIVATE API
            $scope._moreDetail = function() {

                if ($scope.moreInfoData === false) {
                    $scope.moreInfoData = true;
                }
                else {
                    $scope.moreInfoData = false
                }
            };


            // MESSAGES

            $scope.$on('app:launch', function(e) {


                AppLaunchService.launchApp($scope.app);
            });


            $scope.$on('app:moreDetail', function(e) {

                $scope._moreDetail();
            });
        }]);
