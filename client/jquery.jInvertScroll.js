/**
 * This script is a heavily rewritten of the original
 * @param {type} $
 * @returns {undefined}
 */
/**
*	jQuery Plugin for simple vertical scrolling - horizontal movement parallax effect
*	I wrote this plugin for a project we have done.
*
*	License:
*	The MIT License (MIT)
*
*	@version 0.8.1
*

**/
(function ($) {
    'use strict';

    $.jInvertScroll = function(sel, options) {
        var defaults = {
                width: 'auto',		    // The horizontal container width
                height: 'auto',		    // How far the user can scroll down (shorter distance = faster scrolling)
                onScroll: function(percent) {  // Callback fired when the user scrolls down, the percentage of how far the user has scrolled down gets passed as parameter (format: 0.xxxx - 1.0000)
                    // do whatever you like
                }
            }, 
            config = $.extend(defaults, options),
            redraw = function(){},
            init,
            elements = [],
            longest = 0,
            totalHeight,
            winHeight,
            winWidth,
            instance;

        if(typeof sel === 'Object' && sel.length > 0) {
            return;
        }
        /**
         * scroll / resize bind callback, moves elements
         * @param event e
         */
        redraw = function (e) {
            
            // modified : Retrieves each time, not only on rescroll (meteor bug)
            totalHeight = $(document).height();
            winHeight = $(this).height();
            winWidth = $(this).width();
            
            var currY = $(this).scrollTop();
            
            // Current percentual position
            var scrollPercent = (currY / (totalHeight - winHeight)).toFixed(4);
            
            // Call the onScroll callback
            if(typeof config.onScroll === 'function') {
                config.onScroll.call(this, scrollPercent);
            }
            
            // do the position calculation for each element
            $.each(elements, function (i, el) {
                var deltaW = el.height() - winHeight;
                if (deltaW <= 0) {
                    deltaW = el.height();
                }
                var pos = Math.floor(deltaW * scrollPercent) * -1;
                el.css('top', pos);
            });
        }
        
        // Extract all selected elements from dom and save them into an array
        $.each(sel, function(i, val) {
            $(val).each(function(e) {
                elements.push($(this));
                var w = $(this).height();
                if(longest < w) {
                    longest = w;
                }
            });
        });
        
        // Use the longest elements width + height if set to auto
        if(config.width == 'auto') {
            config.width = longest;
        }
        
        if(config.height == 'auto') {
            config.height = longest;
        }
        
        // Set the body to the selected height
        $('body').css('height', config.height+'px');
        
       
        // Listen for the actual scroll event
        $(window).on('scroll resize', redraw);
        
        
        // Force redraw
        redraw();
    };
}(jQuery));
