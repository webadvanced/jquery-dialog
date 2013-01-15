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
        closeButton,
        confirmEvent,
        defaultsFromEl,
        elCheck,
        opendialogEvent,
        imageRegex = /\.(jpg|gif|png|jpeg|bpm)/i;

    buildTitle = function( title ) {
        if( !title ) {
            $title.hide();
            return;
        }
        
        $title.html( title );
    };

    buildContent = function( content ) {
        content = content || "Ooops.";
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

        var btn = $( '<a />', obj );
        if( obj.callback ) {
            var ctx = ( obj.ctx ) ? obj.ctx : this;
            btn.click(function() {
                obj.callback.apply( ctx, arguments );
            });
        }

        return btn;
    };

    confirmEvent = function( evt ) {
        evt.preventDefault();
        var $el = $( this ),
            obj = { el: this };

        dialog.confirm( defaultsFromEl( $el, obj ) );
    };

    opendialogEvent = function( evt ) {
        evt.preventDefault();
        var $el = $( this ),
            obj = { el: this },
            contentKey = $el.attr( 'href' );

        //set options from el
        defaultsFromEl( $el, obj );

        //check if ajax or inline and get content
        if( contentKey.charAt( 0 ) === '#') {

            obj.content = $( contentKey ).html();
            dialog.open( obj );

        } else if ( imageRegex.test( contentKey )) {

            obj.content = $( '<img />', { src: contentKey } );
            dialog.open( obj );

        } else {
            
            $.get( contentKey, function( content ) {
                obj.content = content;
                dialog.open( obj );
            } );
            
        }
    };

    closeButton = {
        'text': 'close',
        'class': 'primary close',
        'href': '#close'
    };

    defaultsFromEl = function( $el, obj ) {
       obj = obj || {};

       elCheck( $el, 'title', obj );
       elCheck( $el, 'width', obj );
       elCheck( $el, 'height', obj );
       elCheck( $el, 'content', obj );
       elCheck( $el, 'processtext', obj );
       elCheck( $el, 'canceltext', obj );
       elCheck( $el, 'processcallback', obj );
       elCheck( $el, 'cancelcallback', obj );

       obj.action = $el.attr( 'href' );

       return obj;
    };

    elCheck = function( $el, data, obj ) {
        if( $el.data( data ) ) {
               obj[data] = $el.data( data );
        }    
    };

    dialog.confirm = function( settings ) {
        var defaults = {
            content: 'Are you sure about that?',
            title: 'please confirm'
        },
        options = {},
        actions = [],
        cancelBtn = {},
        processBtn = {};
        
        $.extend( options, defaults, settings );
        
        //buttons
        
        cancelBtn.text = options.canceltext || 'cancel';
        cancelBtn.href = '#close';
        cancelBtn[ 'class' ] = options[ 'class' ] || 'close';
        cancelBtn.callback = w[ options.cancelcallback ] || undefined;
        cancelBtn.ctx = options.el || undefined;
        actions.push( cancelBtn );

        processBtn.text = options.processtext || 'confirm';
        processBtn.href = options.action || '#';
        processBtn[ 'class' ] = ( options[ 'class' ] || 'danger' );
        processBtn.callback = w[ options.processcallback ] || dialog.closeAndContinue;
        processBtn.ctx = options.el || undefined;
        actions.push( processBtn );

        options.actions = actions;

        dialog.open( options );
    };

    // Center the modal in the viewport
    dialog.center = function() {
        var top, left;

        top = Math.max( $( w ).height() - $modal.outerHeight(), 0 ) / 2;
        left = Math.max( $( w ).width() - $modal.outerWidth(), 0 ) / 2;

        $modal.css({
            top:top + $( w ).scrollTop(), 
            left:left + $( w ).scrollLeft()
        });
    };

    // Open the modal
    dialog.open = function( settings ) {
              
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

        $( w ).bind( 'resize.modal', dialog.center );
        
		dialog.center();
        
		$overlay.show();
		$modal.fadeIn( 'fast', 'swing' );
    };

    // Close the modal
    dialog.close = function( evt ) {
        if( evt ) evt.preventDefault();
        $modal.hide();
        $overlay.hide();
        $content.empty();
        $title.empty();
        $actions.empty();
        $( w ).unbind('resize.modal');
    };
	
	dialog.closeAndContinue = function() {
	    dialog.close();
	};

    init = function() {
        $main.append( $title, $content, $actions );
        $modal.append( $main );
        $modal.hide();
    };
    
    $(function() {
        $( 'body' ).append( $overlay, $modal );
        $( '#modal' ).delegate( '.close', 'click', dialog.close );
        $( '.confirm' ).live( 'click', confirmEvent );
        $( '.dialog' ).live( 'click', opendialogEvent );
    });

    if( ! w.dialog ) {
        w.dialog = dialog;    
    }

    init();
} )( window.jQuery, window );