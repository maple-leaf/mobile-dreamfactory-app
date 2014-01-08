'use strict';


angular.module('lpApp')
    .animation('.test', function() {
        return {

            enter: function(element, done) {

                jQuery(element).css({
                    background: 'rgba(0,0,0,0)'
                });


                jQuery(element).animate({
                    background: 'rgba(0,0,0,1)'
                }, done);
            },

            leave : function(element, done) { done(); },
            move : function(element, done) { done(); }


        }
    });
