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
    let tokenParser = new RegExp("csrftoken=(.*);");
    this.csrftoken = tokenParser.exec(document.cookie)[1];

    let vocabList = $(".vocab-card");
    let idList = [];

    vocabList.each(function(index) {
      idList.push($(this).attr("data-vocab-id"));
    });

    let i = 0;
    idList.forEach((value) => {
      setTimeout(() => {
        this.sendPost("/kw/togglevocab/", this.csrftoken, value).done((response) => {
        console.log(response);
      });}, i * 500);
      i++;
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
