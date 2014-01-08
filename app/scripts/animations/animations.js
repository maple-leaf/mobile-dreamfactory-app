'use strict';


angular.module('lpApp')
    .animation('.test', [function() {
        return {
            enter: function(element, done) {

                console.log(element);
                console.log('fired');
                jQuery(element).animate({
                    opacity: '1'
                }, done);
            },

            leave : function(element, done) { done(); },
            move : function(element, done) { done(); }


        }
    }]);
