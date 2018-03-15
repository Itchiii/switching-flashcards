/*jshint esversion: 6 */

/*set own values*/
const CARD_PEN_OFFSET = 10; //displacement of the cards
const CARD_SWITCH_RANGE = '130%';


/* Do not change this */
const CARD_ARRAY = document.querySelectorAll('div[class*="card"]');
let last_element = CARD_ARRAY[CARD_ARRAY.length - 1];


setCardOffset();
function setCardOffset() {
  let offset = 0;
  let order = 1;
  let zIndex = CARD_ARRAY.length;
  for (let index of CARD_ARRAY) {
    index.dataset.offset = offset;
    index.dataset.order = order;
    index.style.zIndex = zIndex;
    index.style.transform = `translate(${offset}px, ${offset}px)`;
    offset = offset + CARD_PEN_OFFSET;
    order++;
    zIndex--;
  }
}

/******************************************************************/
window.addEventListener('wheel', function(e) {

  const COUNT_OF_CARDS = CARD_ARRAY.length;
  let animationObject = {};

  /* return when you scroll during the animation of a card */
  for (let index of CARD_ARRAY) {
    if ((index.dataset.scrolling === 'up') || (index.dataset.transition === 'trans') || (index.dataset.scrolling === 'down')) return;
  }

  for (let index of CARD_ARRAY) {


    if ((parseInt(window.getComputedStyle(index).zIndex) === CARD_ARRAY.length) || (parseInt(index.style.zIndex) === CARD_ARRAY.length)) {

      /*switch the rearmost card */
      if (e.deltaY < 0) { //deltaY < 0 -> scrolling up
        let previousSibling = index.previousElementSibling;

        if (previousSibling === null) {
          previousSibling = last_element;
          previousSibling.dataset.order = 0;
        }
        else previousSibling.dataset.order = 1;

        previousSibling.dataset.offset = 0;
        previousSibling.style.transform = `translate(${previousSibling.dataset.offset}px, ${previousSibling.dataset.offset}px)`;
        previousSibling.dataset.scrolling = 'up';
        previousSibling.style.transform = `translate(0px, -${CARD_SWITCH_RANGE})`;
        previousSibling.style.webkitAnimationPlayState = 'running';
        animationObject = previousSibling;
        index.dataset.order = 2;
        previousSibling.dataset.transition = "trans";

      }

      /*switch the foremost card */
      else if (e.deltaY > 0){
        index.style.transform = `translate(0px, -${CARD_SWITCH_RANGE})`;
        index.dataset.scrolling = 'down';
        animationObject = index;
        index.dataset.transition = "trans";
        index.dataset.order = COUNT_OF_CARDS;
      }
    }
    else {
      if (e.deltaY < 0) index.dataset.order++;
      else if (e.deltaY > 0) index.dataset.order--;
    }
  }

  if (animationObject !== undefined) {
    animationObject.addEventListener('transitionend', function(){
      if (animationObject.dataset.scrolling === 'down') {
        for (let index of CARD_ARRAY) {
          if (index.dataset.scrolling === 'down') {
            index.style.zIndex = 0;
            index.dataset.scrolling = '';
            index.dataset.offset = COUNT_OF_CARDS * CARD_PEN_OFFSET;
            index.style.transform = `translate(${index.dataset.offset}px, ${index.dataset.offset}px)`;

          }
          index.style.zIndex = parseInt(index.style.zIndex) + 1;
          index.dataset.offset = parseInt(index.dataset.offset) - CARD_PEN_OFFSET;
          index.style.transform = `translate(${index.dataset.offset}px, ${index.dataset.offset}px)`;

          //option: once is important, because...
          index.addEventListener('transitionend', () => index.dataset.transition = null, {once: true });
        }
      }

      else if (animationObject.dataset.scrolling === 'up'){
        for (let index of CARD_ARRAY) {
          index.dataset.offset = parseInt(index.dataset.offset) + CARD_PEN_OFFSET;
          index.style.transform = `translate(${index.dataset.offset}px, ${index.dataset.offset}px)`;

          if (index.dataset.scrolling === 'up') {
            index.style.zIndex = COUNT_OF_CARDS + 1;
            index.dataset.scrolling = '';
            index.dataset.offset = 0;
            index.style.transform = `translate(${index.dataset.offset}px, ${index.dataset.offset}px)`;
          }
          index.style.zIndex = parseInt(index.style.zIndex) - 1;

          index.addEventListener('transitionend', () => index.dataset.transition = null, {once: true });
        }
      }
    }, {once: true });
  }
});
