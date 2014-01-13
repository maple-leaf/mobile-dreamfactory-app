'use strict';

angular.module('lpApp')
    .directive('pageHeader', [function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                title: '=title',
                group: '=group',
                description: '=description'
            },
            template:'<div class="pageText"><h2>{{title}}<small>{{group}}</small></h2><p>{{description}}</p></div>'
        }
    }])
    .directive('profileBtns', [function() {
        return {
            restrict: 'E',
            scope: '@',
            replace: true,
            templateUrl: 'views/utility/buttons/profile-buttons.html',
            link: function(scope, element, attrs) {

                var height = $(window).outerHeight(),
                    btnHeight = element.outerHeight();

                element.css({
                    position: 'absolute',
                    top: height - (btnHeight + 150)
                })

            }

        }
    }])
    .directive('dspSettingsBtns', [function() {
        return {
            restrict: 'E',
            scope: '@',
            replace: true,
            templateUrl: 'views/utility/buttons/dsp-settings-buttons.html',
            link: function(scope, element, attrs) {

                var height = $(window).outerHeight(),
                    btnHeight = element.outerHeight();

                element.css({
                    position: 'absolute',
                    top: height - (btnHeight + 150)
                })

            }

        }
    }])
    .directive('appDetailBtns', [function() {
        return {
            restrict: 'E',
            scope: '@',
            replace: true,
            templateUrl: 'views/utility/buttons/app-detail-buttons.html',
            link: function(scope, element, attrs) {

                var height = $(window).outerHeight(),
                    btnHeight = element.outerHeight();

                element.css({
                    position: 'absolute',
                    top: height - (btnHeight + 150)
                })

            }

        }
    }])
    .directive('swiper', ['$rootScope', function($rootScope) {
        return {
            restrict: 'E',
            scope: '@',
            link: function(scope, element) {

                $rootScope.panelSwipe = 'left';
                scope.currentPanel = 0;

                /*
                $rootScope.$on('$routeChangeStart', function(scope, next, current) {
                    scope.currentPanel = 0;
                });
                */




                scope.swipeLeft = function() {

                    $rootScope.panelSwipe = 'left';

                    if (scope.currentPanel === scope.panelsObj.panels.length - 1) {
                        return;
                    }

                    scope.currentPanel++
                };

                scope.swipeRight = function() {

                    $rootScope.panelSwipe = 'right';

                    if (scope.currentPanel === 0) {
                        return;
                    }

                    scope.currentPanel--
                };
            }
        }





    }]);


