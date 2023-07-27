# Wp Theme Vite Template

An example on using Vite to compile Typescript & SCSS to create a custom Wordpress theme.

## Installation
Clone the project into the themes folder of your WP instance. 
```bash
 cd wp-theme-vite-template
```
Suggested Node version > 18.
```bash
cd vite && npm install
```

## Usage
From the vite folder in the theme start the vite server
```bash
npm start
```
This will create the server at http://localhost:1337.   
When php detects that the current server contains the string `local` it will assume that the vite server is running and attempt to load files from the vite server. See the [HMR](./inc/hmr.php) file for how this behavior works.   

All SCSS changes should reflect immediately for TS changes you will have to refresh the page as php does not re-render itself.   

`Entries` in [vite.config.ts](./vite/vite.config.ts) determine what files are built into the themes dist folder create as many entries as needed so you can make your loading modular. Just be sure to update the `enqueue_scripts_styles` function found in [functions.php]('./functions.php').   

# Build
```bash
npm run build
```
This will build your themes TS and SCSS into JS and CSS and place them in a folder at the root of your theme `[THEME_NAME]/dist/js/[HASHED_FILE_NAME]` & `[THEME_NAME]/dist/css/[HASHED_FILE_NAME]`.   

A manifest file ([manifest.json](./manifest.json)) is created for cache busting when you build. When not in HMR mode the [functions.php]('./functions.php') will read the manifest file and use the file names in order to load the correct hashed files. This doesn't just load everything in manifest because you may want different CSS to load for Posts, Pages, and Singles so you have to enqueue styles and scripts as you want them. 

## Callout 
If you're using a tool like WP Local and don't want your source files pushed to WP Engine add the name of your themes vite folder to your `.wpe-push-ignore` file located at the root of the WP Local public folder. 
This will ensure that only built files are deployed to your site. 
> EX for base version:   
  `wp-content/themes/wp-theme-vite-template/vite`
## License

[MIT](https://choosealicense.com/licenses/mit/)