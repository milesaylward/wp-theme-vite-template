
import HelloWorld from './components/HelloWorld';
// @ts-expect-error
const $ = jQuery;

$(document).ready(() => {
  HelloWorld();
});
