// ==UserScript==
// @name         Kaniwani clicker
// @namespace    org.dimwits
// @version      1.0
// @description  Clicks it
// @match        https://kaniwani.com/*
// @author       Eekone
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// ==/UserScript==


(function() {
  const INTERVAL = 200;

  class Locker {
    constructor() {
      let tokenParser = new RegExp("csrftoken=([A-z0-9]+);");
      this.csrftoken = tokenParser.exec(document.cookie)[1];

      let vocabList = $(".vocab-card");
      let cardList = [];

      vocabList.each(function(index) {
        cardList.push($(this));
      });

      this.taskIds = [];

      this.cardList = cardList;

      this.createControls();
    }

    createControls() {
      this.lockButton = $(`<button class="btn btn-primary pure-button pure-button-primary"
      style="margin-left: 10px;">
      Lock
      </button>`);
      this.unlockButton = $(`<button class="btn btn-primary pure-button pure-button-primary"
      style="margin-left: 10px;">
      Unlock
      </button>`);
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
                this.csrftoken, element.attr("data-vocab-id"), element, i * INTERVAL);
          i++;
        } else if (!locked && element.attr("class") != "vocab-card ") {
          this.sendLockRequest("/kw/togglevocab/",
                this.csrftoken, element.attr("data-vocab-id"), element, i * INTERVAL);
          i++;
        }
      });
    }
  }

  let clicker = new Locker();
})();
  /* jshint ignore:end */
