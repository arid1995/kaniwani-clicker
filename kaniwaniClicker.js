// ==UserScript==
// @name         Kaniwani clicker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  shows how to use babel compiler
// @author       You
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @match        https://kaniwani.com/*
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
    /* jshint esnext: false */
    /* jshint esversion: 6 */

class Locker {
  constructor() {
    let regexp = new RegExp("csrftoken=(.*);");
    this.csrftoken = regexp.exec(document.cookie)[1];

    this.sendPost("/kw/togglevocab/", this.csrftoken, 4855370).done((response) => {
      console.log(response);
    });
    console.log(this.csrftoken);
  }

  sendPost(url, token, reviewId) {
    return $.post(url, {review_id: reviewId, csrfmiddlewaretoken: token});
  }
}

let clicker = new Locker();

/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */
