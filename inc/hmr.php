<?php
/**
 * Change the conditional to fit your needs.
 */
function getViteDevServerAddress() {
  if (str_contains($_SERVER['HTTP_HOST'], 'local')) {
    return 'http://localhost:1337';
  }
  return '';
}

function isViteHMRAvailable() {
    return !empty(getViteDevServerAddress());
}

function loadJSScriptAsESModule($script_handle) {
  add_filter(
    'script_loader_tag', function ($tag, $handle, $src) use ($script_handle) {
      if ($script_handle === $handle ) {
        return sprintf(
          '<script type="module" src="%s"></script>',
          esc_url($src)
        );
      }
      return $tag;
    }, 10, 3
  );
}

if (!isViteHMRAvailable()) {
    return;
}

add_filter('stylesheet_uri', function () { return getViteDevServerAddress().'/sass/styles/style.scss'; } );

const VITE_HMR_CLIENT_HANDLE = 'vite-client';
function loadScript() {
  wp_enqueue_script(VITE_HMR_CLIENT_HANDLE, getViteDevServerAddress().'/@vite/client', array(), null);
  loadJSScriptAsESModule(VITE_HMR_CLIENT_HANDLE);
}
add_action('wp_enqueue_scripts', 'loadScript');