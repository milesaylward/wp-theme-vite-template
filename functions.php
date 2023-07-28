<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

require_once get_theme_file_path('/inc/hmr.php');
$manifest = json_decode(file_get_contents('manifest.json'));

function enqueue_scripts_styles() {
	wp_enqueue_style('theme-style', get_stylesheet_directory_uri() . '/style.css', array(), null);
	if (isViteHMRAvailable()) {
		$handle = 'index';
		loadJSScriptAsESModule($handle);
		wp_enqueue_script($handle, getViteDevServerAddress() . '/ts/index.ts', array('jquery'), null);
		wp_enqueue_style('style', getViteDevServerAddress() . '/scss/styles/style.scss', null);		
	} else {
		$indexJS = 'index';
		$indexCSS = 'style.css';
		wp_enqueue_script($indexJS, get_stylesheet_directory_uri() . $GLOBALS['manifest']->$indexJS, array('jquery'), null);
		wp_enqueue_style($indexCSS, get_stylesheet_directory_uri() . $GLOBALS['manifest']->$indexCSS, array(), null);
	}
}

add_action('wp_enqueue_scripts', 'enqueue_scripts_styles', 20);