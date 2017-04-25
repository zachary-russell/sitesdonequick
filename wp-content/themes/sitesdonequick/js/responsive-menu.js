/**
 * Accessibility-ready responsive menu.
 */

( function ( document, $, undefined ) {

	$( 'body' ).addClass( 'mobile desktop' );

	'use strict';

	var mobileFirstSass   = {},
		mainMenuButtonClass = 'menu-toggle',
		subMenuButtonClass  = 'sub-menu-toggle';

	mobileFirstSass.init = function() {
		var toggleButtons = {
			menu : $( '<button />', {
				'class' : mainMenuButtonClass,
				'aria-expanded' : false,
				'aria-pressed' : false,
				'role' : 'button'
				} )
				.append( mobileFirstSass.params.mainMenu ),
			submenu : $( '<button />', {
				'class' : subMenuButtonClass,
				'aria-expanded' : false,
				'aria-pressed' : false,
				'role' : 'button'
				} )
				.append( $( '<span />', {
					'class' : 'screen-reader-text',
					text : mobileFirstSass.params.subMenu
				} ) )
		};
		if ($( '.nav-header' ).length > 0 ) {
			$( '.nav-header' ).before( toggleButtons.menu ); // add the main nav buttons
		} else {
			$( '.nav-primary' ).before( toggleButtons.menu );
		}
		$( 'nav .sub-menu' ).before( toggleButtons.submenu ); // add the submenu nav buttons
		$( '.' + mainMenuButtonClass ).each( _addClassID );
		$( '.' + mainMenuButtonClass ).addClass('dashicons-before dashicons-menu');
		$( '.' + subMenuButtonClass ).addClass('dashicons-before dashicons-arrow-down');
		$( window ).on( 'resize.mobileFirstSass', _doResize ).triggerHandler( 'resize.mobileFirstSass' );
		$( '.' + mainMenuButtonClass ).on( 'click.mobileFirstSass-mainbutton', _mainmenuToggle );
		$( '.' + subMenuButtonClass ).on( 'click.mobileFirstSass-subbutton', _submenuToggle );
	};

	// add nav class and ID to related button
	function _addClassID() {
		var $this = $( this ),
			nav   = $this.next( 'nav' ),
			id    = 'class';
		if ( $( nav ).attr( 'id' ) ) {
			id = 'id';
		}
		$this.attr( 'id', 'mobile-' + $( nav ).attr( id ) );
	}

	// check CSS rule to determine width
	function _combineMenus(){
		if ( ( $( '.desktop button.menu-toggle' ).css( 'visibility' ) == 'visible' ) && $( '.nav-header' ).length > 0 ) { // depends on .mobile nav having position: relative; in style.css
			$( '.nav-primary .menu > li' ).addClass( 'moved-item' ); // tag moved items so we can move them back
			$( '.nav-primary .menu > li' ).prependTo( '.nav-header ul.genesis-nav-menu' );
			$( '.nav-primary' ).hide();
		} else if ( ( $( '.mobile button.menu-toggle' ).css( 'visibility' ) == 'visible' ) && $( '.nav-header' ).length > 0 ) {
			$( '.nav-primary' ).show();
			$( '.nav-header ul.genesis-nav-menu > li.moved-item' ).appendTo( '.nav-primary .menu' );
			$( '.nav-primary .menu > li' ).removeClass( 'moved-item' );
		}
	}

	// Change Skiplinks and Superfish
	function _doResize() {
		var buttons = $( 'button[id^="mobile-"]' ).attr( 'id' );
		if ( typeof buttons === 'undefined' ) {
			return;
		}
		_superfishToggle( buttons );
		_changeSkipLink( buttons );
		_maybeClose( buttons );
	}

	/**
	 * action to happen when the main menu button is clicked
	 */
	function _mainmenuToggle() {
		var $this = $( this );
		_toggleAria( $this, 'aria-pressed' );
		_toggleAria( $this, 'aria-expanded' );
		$this.toggleClass( 'activated' );
		$this.next( 'nav, .sub-menu' ).slideToggle( 'fast' );
		$( '.nav-header' ).toggleClass( 'open-menu' );
		$( '.nav-header ul.genesis-nav-menu' ).toggleClass( 'open-menu' );
		$( '.nav-primary' ).toggleClass( 'open-menu' );
		$( '.nav-primary ul.genesis-nav-menu' ).toggleClass( 'open-menu' );
		$( '.site-header' ).toggleClass( 'open-menu' );
	}

	/**
	 * action for submenu toggles
	 */
	function _submenuToggle() {

		var $this  = $( this ),
			others = $this.closest( '.menu-item' ).siblings();
		_toggleAria( $this, 'aria-pressed' );
		_toggleAria( $this, 'aria-expanded' );
		$this.toggleClass( 'activated' );
		$this.next( '.sub-menu' ).slideToggle( 'fast' );

		others.find( '.' + subMenuButtonClass ).removeClass( 'activated' ).attr( 'aria-pressed', 'false' );
		others.find( '.sub-menu' ).slideUp( 'fast' );

	}

	/**
	 * activate/deactivate superfish
	 */
	function _superfishToggle( buttons ) {
		if ( typeof $( '.js-superfish' ).superfish !== 'function' ) {
			return;
		}
		if ( 'none' === _getDisplayValue( buttons ) ) {
			$( '.js-superfish' ).superfish( {
				'delay': 100,
				'animation': {'opacity': 'show', 'height': 'show'},
				'dropShadows': false
			});
		} else {
			$( '.js-superfish' ).superfish( 'destroy' );
		}
	}

	/**
	 * modify skip links to match mobile buttons
	 */
	function _changeSkipLink( buttons ) {
		var startLink = 'genesis-nav',
			endLink   = 'mobile-genesis-nav';
		if ( 'none' === _getDisplayValue( buttons ) ) {
			startLink = 'mobile-genesis-nav';
			endLink   = 'genesis-nav';
		}
		$( '.genesis-skip-link a[href^="#' + startLink + '"]' ).each( function() {
			var link = $( this ).attr( 'href' );
			link = link.replace( startLink, endLink );
			$( this ).attr( 'href', link );
		});
	}

	function _maybeClose( buttons ) {
		if ( 'none' !== _getDisplayValue( buttons ) ) {
			return;
		}
		$( '.menu-toggle, .sub-menu-toggle' )
			.removeClass( 'activated' )
			.attr( 'aria-expanded', false )
			.attr( 'aria-pressed', false );
		$( 'nav, .sub-menu' )
			.attr( 'style', '' );
	}

	/**
	 * generic function to get the display value of an element
	 * @param  {id} $id ID to check
	 * @return {string}     CSS value of display property
	 */
	function _getDisplayValue( $id ) {
		var element = document.getElementById( $id ),
			style   = window.getComputedStyle( element );
		return style.getPropertyValue( 'display' );
	}

	/**
	 * Toggle aria attributes
	 * @param  {button} $this     passed through
	 * @param  {aria-xx} attribute aria attribute to toggle
	 * @return {bool}           from _ariaReturn
	 */
	function _toggleAria( $this, attribute ) {
		$this.attr( attribute, function( index, value ) {
			return 'false' === value;
		});
	}

	$(document).ready(function () {

		// run test on initial page load
		_combineMenus();

		// run test on resize of the window
		$( window ).resize( _combineMenus );

		mobileFirstSass.params = typeof mobileFirstSassL10n === 'undefined' ? '' : mobileFirstSassL10n;

		if ( typeof mobileFirstSass.params !== 'undefined' ) {
			mobileFirstSass.init();
		}

	});

})( document, jQuery );
