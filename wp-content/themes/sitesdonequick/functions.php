<?php
// Start the engine
include_once( get_template_directory() . '/lib/init.php' );

// Setup Theme
include_once( get_stylesheet_directory() . '/lib/theme-defaults.php' );

// Set Localization (do not remove)
load_child_theme_textdomain( 'mobile-first-sass', apply_filters( 'child_theme_textdomain', get_stylesheet_directory() . '/languages', 'mobile-first-sass' ) );

// Add Image upload and Color select to WordPress Theme Customizer
require_once( get_stylesheet_directory() . '/lib/customize.php' );

// Include Customizer CSS
include_once( get_stylesheet_directory() . '/lib/output.php' );

// Child theme (do not remove)
define( 'CHILD_THEME_NAME', 'GenesisThe.me Developer Starter' );
define( 'CHILD_THEME_URL', 'https://www.genesisthe.me/' );
define( 'CHILD_THEME_VERSION', '1.0.6' );

// Enqueue scripts and styles
add_action( 'wp_enqueue_scripts', 'mobile_first_sass_scripts_styles' );
function mobile_first_sass_scripts_styles() {

	wp_enqueue_style( 'dashicons' );

	wp_enqueue_script( 'mobile-first-sass-responsive-menu', get_stylesheet_directory_uri() . '/js/min/responsive-menu.min.js', array( 'jquery' ), '1.0.0', true );
	$output = array(
			'mainMenu' 		=> __( 'Menu', 'mobile-first-sass' ),
			'subMenu'  		=> __( 'Menu', 'mobile-first-sass' ),
			'headerMenu'  => __( 'Menu', 'mobile-first-sass' ),
	);
	wp_localize_script( 'mobile-first-sass-responsive-menu', 'mobileFirstSassL10n', $output );

	// Because who wants Superfish?
	// wp_deregister_script( 'superfish' );
	// wp_deregister_script( 'superfish-args' );

	$version = defined( 'CHILD_THEME_VERSION' ) && CHILD_THEME_VERSION ? CHILD_THEME_VERSION : PARENT_THEME_VERSION;
	$handle  = defined( 'CHILD_THEME_NAME' ) && CHILD_THEME_NAME ? sanitize_title_with_dashes( CHILD_THEME_NAME ) : 'child-theme';

	wp_enqueue_style( $handle, get_stylesheet_directory_uri() . '/style.min.css', false, $version);
    wp_enqueue_style( 'fonts', 'https://fonts.googleapis.com/css?family=Montserrat:600|Open+Sans' );

}

// De-register uncompressed stylesheet - minified loaded above
remove_action( 'genesis_meta', 'genesis_load_stylesheet' );

// Add HTML5 markup structure
add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', ) );

// Add Accessibility support
add_theme_support( 'genesis-accessibility', array( '404-page', 'drop-down-menu', 'headings', 'rems', 'search-form', 'skip-links' ) );

// Add viewport meta tag for mobile browsers
add_theme_support( 'genesis-responsive-viewport' );

// Deregister WP 4.2 Emoji support
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
remove_action( 'admin_print_styles', 'print_emoji_styles' );

// Add support for custom header
add_theme_support( 'custom-header', array(
	'width'           => 484,
	'height'          => 76,
	'header-selector' => '.site-title a',
	'header-text'     => false,
	'flex-height'     => true,
) );

// Add support for custom background
add_theme_support( 'custom-background' );

// Add support for after entry widget
add_theme_support( 'genesis-after-entry-widget-area' );

// Register header navigation menu
register_nav_menu( 'header', __( 'Header Menu', 'genesis-header-nav' ) );

// Rename primary and secondary navigation menus
add_theme_support( 'genesis-menus' , array(
		'primary' => __( 'After Header Menu', 'mobile-first-sass' ),
		'secondary' => __( 'Footer Menu', 'mobile-first-sass' ) ) );

// Maybe move the primary navigation to the header (if no widget in header-right)
// add_action( 'genesis_before', 'move_primary_nav_if_no_header_widget' );
// function move_primary_nav_if_no_header_widget() {
// 	if ( is_active_sidebar( 'header-right' ) ) {
// 		return;
// 	}
// 	remove_action( 'genesis_after_header', 'genesis_do_nav' );
// 	add_action( 'genesis_header', 'genesis_do_nav', 13 );
// }

// Display header navigation menu (via @GaryJ Genesis Header Nav plugin)
add_action( 'genesis_header', 'show_menu' );
apply_filters( 'genesis_header_nav_priority', 12 );
function show_menu() {
		$class = 'menu genesis-nav-menu menu-header';
		if ( genesis_superfish_enabled() ) {
			$class .= ' js-superfish';
		}

		genesis_nav_menu(
			array(
				'theme_location' => 'header',
				'menu_class'     => $class,
			)
		);
	}

/**
* Add ID/aria label to secondary navigation.
* @param $attributes
*
* @return mixed
*/
add_filter( 'genesis_attr_nav-header', 'mobile_first_sass_add_nav_header_id' );
function mobile_first_sass_add_nav_header_id( $attributes ) {
	$attributes['id']         = 'menu-header-navigation';
	$attributes['aria-label'] = __( 'Header navigation', 'mobile-first-sass' );
	return $attributes;
}

	add_filter( 'genesis_skip_links_output', 'mobile_first_sass_add_nav_header_skip_link' );
	/**
	 * Add the header navigation menu to the skip links output.
	 * @param $links
	 *
	 * @return array
	 */
	function mobile_first_sass_add_nav_header_skip_link( $links ) {
	    $new_links = $links;
	    array_splice( $new_links, 1 );

	    if ( has_nav_menu( 'header' ) ) {
	        $new_links['menu-header-navigation'] = __( 'Skip to header navigation', 'mobile-first-sass' );
	    }

	    return array_merge( $new_links, $links );
	}

// Reposition the secondary navigation menu to footer, if wanted
remove_action( 'genesis_after_header', 'genesis_do_subnav' );
add_action( 'genesis_footer', 'genesis_do_subnav', 5 );

// Add support for 3-column footer widgets
add_theme_support( 'genesis-footer-widgets', 3 );

// Remove site layouts
genesis_unregister_layout( 'content-sidebar-sidebar' );
genesis_unregister_layout( 'sidebar-sidebar-content' );
genesis_unregister_layout( 'sidebar-content-sidebar' );
genesis_unregister_layout( 'sidebar-content' );

// Remove comment form allowed tags
add_filter( 'comment_form_defaults', 'mobile_first_sass_remove_comment_form_allowed_tags' );
function mobile_first_sass_remove_comment_form_allowed_tags( $defaults ) {

	$defaults['comment_notes_after'] = '';
	return $defaults;

}

// Modify the size of the Gravatar in the author box
add_filter( 'genesis_author_box_gravatar_size', 'mobile_first_sass_author_box_gravatar' );
function mobile_first_sass_author_box_gravatar( $size ) {

	return 90;

}

// Modify the size of the Gravatar in the entry comments
add_filter( 'genesis_comment_list_args', 'mobile_first_sass_comments_gravatar' );
function mobile_first_sass_comments_gravatar( $args ) {

	$args['avatar_size'] = 60;
	return $args;

}

// Register widget areas
// As you wish...
