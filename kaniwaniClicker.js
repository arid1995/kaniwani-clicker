// ==UserScript==
// @name         Kaniwani clicker
// @namespace    org.dimwits
// @version      1.0
// @description  Clicks it
// @match        https://kaniwani.com/*
// @author       Eekone
// @run-at document-end
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// ==/UserScript==


(function() {
  const INTERVAL = 1;

  class Locker {
    constructor(csrftoken, isVocabPage, pageUrl = '/') {
      this.csrftoken = csrftoken;
      this.isVocabPage = isVocabPage;
      let cardList = [];

      if (isVocabPage) {
        let vocabList = $(".vocab-card");
        vocabList.each(function(index) {
          cardList.push($(this));
        });
      } else {
        $.get( pageUrl, (data) => {
          let idParser = new RegExp(`data-vocab-id="([0-9]+)"`, 'g');
          let match;
          for (let i = 1;(match = idParser.exec(data)) !== null; i += INTERVAL) {
            let matchLocal = match;
            setTimeout(() => {
              $.post('/kw/togglevocab/', {review_id: matchLocal[1], csrfmiddlewaretoken: this.csrftoken}).done((response) => {
              });
            }, i);
          }
        });
      }

      this.taskIds = [];

      this.cardList = cardList;

      if (isVocabPage) {
        this.createControls();
      }
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
      $('.section-heading').prepend(this.lockButton);
      $('.section-heading').prepend(this.unlockButton);

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

  class Interface {
    constructor() {
      let tokenParser = new RegExp("csrftoken=([A-z0-9]+)");
      console.log(tokenParser.exec(document.cookie));
      console.log(document.cookie);

      this.csrftoken = tokenParser.exec(document.cookie)[1];

      this.isVocabPage = true;

      //Determining which page are we on
      if (window.location.pathname == '/kw/vocabulary/')
        this.isVocabPage = false;

      //Taking action according to the current page
      if (this.isVocabPage) {
        let clicker = new Locker(this.csrftoken, this.isVocabPage);
      } else {
        this.createControls();
      }
    }

    createControls() {
      let levelCards = document.querySelectorAll('.wrap');

      let index = 1;

      levelCards.forEach((value) => {
        let lockUnlockButton = document.createElement('button');
        lockUnlockButton.setAttribute('class', 'btn btn-primary pure-button-primary icon i-unlocked');
        lockUnlockButton.setAttribute('style', 'left: 70px; bottom: 10px; font-size: 0.5em;');
        lockUnlockButton.setAttribute('vocabId', index);
        let i = index;

        lockUnlockButton.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          new Locker(this.csrftoken, false, `/kw/vocabulary/${i}`);
          return false;
        });
        value.appendChild(lockUnlockButton);
        index++;
      });
    }
  }

  new Interface();
})();
