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
        $title = $('<div id="title"></div>'),
        $content = $('<div id="content"></div>'),
        $actions = $('<div id="actions"></div>'),
        buildTitle,
        buildContent,
        buildActions,
        buildActionButton,
        init,
        closeButton;

    buildTitle = function( title ) {
        if( !title ) {
            $title.hide();
            return;
        }
        
        $title.html( title );
    };

    buildContent = function( content ) {
    	content = content || "Ooops."
    	$content.empty().append( content );
    };

    buildActions = function( actions ) {
    	$actions.empty();

    	//if no actions, add close
    	if( !actions ) {

            $actions.append( buildActionButton( closeButton ) );

    	} else {
			
			var i = 0,
    			l = actions.length;

    		for( ; i < l; i++ ) {
    			$actions.append( buildActionButton( actions[ i ] ) );
    		}

    	}
    };

	buildActionButton = function( obj ) {
		
		if( !obj ) {
			return;
		}

		return $( '<a />', obj );
	};

    closeButton = {
    	text: 'close',
    	class: 'primary close',
    	href: '#close'
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
              
        //build the title
        buildTitle( settings.title );
        
        //build the content
        buildContent( settings.content );

        //build the actions
        buildActions( settings.actions );

        $modal.css( {
            width: settings.width || 'auto', 
            height: settings.height || 'auto'
        } );

        dialog.center();

        $( w ).bind( 'resize.modal', dialog.center );

        $modal.fadeIn( 'fast', 'swing' );
        $overlay.show();
    };

    // Close the modal
    dialog.close = function () {
    	$modal.hide();
        $overlay.hide();
        $content.empty();
        $title.empty();
        $actions.empty();
        $( w ).unbind('resize.modal');
    };

    init = function() {
    	$main.append( $title, $content, $actions );
    	$modal.append( $main );
    	$modal.hide();
    };
    
    $(function() {
        $( 'body' ).append( $overlay, $modal );
        $( '#modal' ).delegate( '.close', 'click', dialog.close );
    });

    if( ! w.dialog) {
        w.dialog = dialog;	
    }

    init();
} )( window.jQuery, window );