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
      let cardList = [];

      vocabList.each(function(index) {
        cardList.push($(this));
      });

      this.taskIds = [];

      this.cardList = cardList;

      this.createControls();

      console.log(this.csrftoken);
    }

    createControls() {
      this.lockButton = $('<button>Lock</button>');
      this.unlockButton = $('<button>Unlock</button>');
      $('.vocab-section').prepend(this.lockButton);
      $('.vocab-section').prepend(this.unlockButton);

      this.lockButton.on("click", (e) => {
        this.taskIds.forEach((id) => {
          clearTimeout(id);
        });
        this.taskIds = [];

        this.changeLockedStateTo(true);
      });

      this.unlockButton.on("click", (e) => {
        this.taskIds.forEach((id) => {
          clearTimeout(id);
        });
        this.taskIds = [];

        this.changeLockedStateTo(false);
      });
    }

    sendLockRequest(url, token, reviewId, element, delay) {
      let taskId = setTimeout(() => {
        $.post(url, {review_id: reviewId, csrfmiddlewaretoken: token}).done((response) => {
          if (element.attr("class") == "vocab-card ") {
            element.attr("class", "vocab-card -locked -unlockable ");
            element.find(".-lockstatus").attr("class", "icon i-unlock -lockstatus toggleLock");
          }
          else {
            element.attr("class", "vocab-card ");
            element.find(".-lockstatus").attr("class", "icon i-unlocked -lockstatus toggleLock");
          }
        });}, delay);

        this.taskIds.push(taskId);
    }

    changeLockedStateTo(locked = false) {
      let i = 0;
      this.cardList.forEach((element) => {
        if (locked && element.attr("class") == "vocab-card ") {
          this.sendLockRequest("/kw/togglevocab/",
                this.csrftoken, element.attr("data-vocab-id"), element, i * 500);
          i++;
        } else if (!locked && element.attr("class") != "vocab-card ") {
          this.sendLockRequest("/kw/togglevocab/",
                this.csrftoken, element.attr("data-vocab-id"), element, i * 500);
          i++;
        }
      });
    }
  }

  let clicker = new Locker();

  /* jshint ignore:start */
  ]]></>).toString();
  var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
  eval(c.code);
  /* jshint ignore:end */
