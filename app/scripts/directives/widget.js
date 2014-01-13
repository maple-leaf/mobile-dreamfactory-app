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
                    position: 'relative',
                    top: btnHeight + 220
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
                    position: 'relative'
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
    .directive('indicator', ['$rootScope', function($rootScope) {
        return {
            restrict: 'E',
            scope: '@',
            templateUrl: 'views/utility/indicators/dots.html',
            link: function(scope, elem, attrs) {

                scope.totalItems = [];
                scope.currentPanel = 0;


                function setNumItems(numItems) {
                    var i = 0,
                        out = [];

                    while (i < numItems) {
                        var indicatorObj = {
                            id: i
                        };

                        out.push(indicatorObj);
                        i++;
                    }

                    return out;
                }


                scope.$on('numPanels', function(e, numItems) {
                    scope.totalItems = setNumItems(numItems);
                    scope.totalItems.length <= 1 ? scope.totalItems = [] : false;
                });

                scope.$on('panel:up', function(e) {
                    scope.currentPanel++
                });

                scope.$on('panel:down', function(e) {
                    scope.currentPanel--
                });
            }
        }


    }])
    .directive('swiper', ['$rootScope', function($rootScope) {
        return {
            restrict: 'E',
            scope: '@',
            link: function(scope, element) {

                $rootScope.panelSwipe = 'left';
                var numPanels = scope.panelsObj.panels.length;
                scope.currentPanel = 0;

                scope.$emit('numPanels', numPanels);



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

                    scope.$emit('panel:up');
                };

                scope.swipeRight = function() {

                    $rootScope.panelSwipe = 'right';

                    if (scope.currentPanel === 0) {
                        return;
                    }

                    scope.currentPanel--
                    scope.$emit('panel:down');
                };
            }
        }
    }]);


