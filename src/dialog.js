/*global window: false */

;( function( $, w, undefined ) {
    "use strict";

    //Ensure jQuery is loaded before the plugin
    if( $ === undefined ) {
        throw 'jQuery is required. Please make sure you include a reference to jQuery and that this script is included below it.';
    }

    var dialog = {},
        $overlay = $('<div id="overlay"></div>'),
        $modal = $('<div id="modal"></div>'),
        $main = $('<div id="main"></div>'),
        $title = $('<div id="main"></div>'),
        $content = $('<div id="main"></div>'),
        $actions = $('<div id="main"></div>'),
        buildTitle,
        buildContent,
        buildActions,
        buildActionButton;

    
    buildTitle = function( title, el ) {
        if( !title ) {
            $title.hide();
            return;
        }
        
        $title.html( title );
        
        if( el ) {
            el.append( $title );
        }
    };

    // Center the modal in the viewport
    dialog.center = function () {
        var top, left;

        top = Math.max( $( w ).height() - $modal.outerHeight(), 0 ) / 2;
        left = Math.max( $( w ).width() - $modal.outerWidth(), 0 ) / 2;

        $modal.css({
            top:top + $( w ).scrollTop(), 
            left:left + $( w ).scrollLeft()
        });
    };

    // Open the modal
    dialog.open = function ( settings ) {
        $content.empty().append( settings.content );
        
        //build the title
        buildTitle( settings.title, $main );
        
        $modal.css( {
            width: settings.width || 'auto', 
            height: settings.height || 'auto'
        } );

        dialog.center();

        $( w ).bind( 'resize.modal', dialog.center );

        $modal.show();
        $overlay.show();
    };

    // Close the modal
    dialog.close = function () {
        $modal.hide();
        $overlay.hide();
        $content.empty();
        $title.empty();
        $actions.empty();
        $(w).unbind('resize.modal');
    };

    $(function() {
        $( 'body' ).append( $overlay, $modal );
        $( '#modal #main #actions .close' ).bind( 'click', dialog.close );
    });

    if( ! w.dialog) {
        w.dialog = dialog;	
    }
    
} )( window.jQuery, window );