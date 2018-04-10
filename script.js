/*jshint esversion: 6 */

/*set own values*/
const CARD_PEN_OFFSET = 10; //displacement of the cards
const CARD_SWITCH_RANGE = '130%';


/* Do not change this */
const CARD_ARRAY = Array.from(document.querySelectorAll('div[class*="card"]'));
let last_element = CARD_ARRAY[CARD_ARRAY.length - 1];
let isMoving = false;
let scrolling = '';

let offsetArray = [];
let offset = 0;
for (let i = 1; i <= CARD_ARRAY.length; i++) {
  offsetArray.push(offset);
  offset += CARD_PEN_OFFSET;
}

setCardOffset();
function setCardOffset() {
  let offset = 0;
  let order = 0;
  let zIndex = CARD_ARRAY.length;
  CARD_ARRAY.forEach(function(item, index){
    item.style.zIndex = zIndex;
    item.style.transform = `translate(${offsetArray[index]}px, ${offsetArray[index]}px)`;
    zIndex--;
  });
}

/******************************************************************/
window.addEventListener('wheel', function(e) {

  const COUNT_OF_CARDS = CARD_ARRAY.length;
  let animationObject = {};

  /* return when you scroll during the animation of a card */
  for (let index of CARD_ARRAY) {
    if ((scrolling === 'up') || (scrolling === 'down') || (isMoving)) return;
  }

  for (let index of CARD_ARRAY) {


    if ((parseInt(window.getComputedStyle(index).zIndex) === CARD_ARRAY.length) || (parseInt(index.style.zIndex) === CARD_ARRAY.length)) {

      /*switch the rearmost card */
      if (e.deltaY < 0) { //deltaY < 0 -> scrolling up
        let previousSibling = index.previousElementSibling;

        if (previousSibling === null) {
          previousSibling = last_element;
        }
        previousSibling.style.transform = `translate(0px, -${CARD_SWITCH_RANGE})`;

        animationObject = previousSibling;
        isMoving = true;
        scrolling = 'up';
      }

      /*switch the foremost card */
      else if (e.deltaY > 0){
        index.style.transform = `translate(0px, -${CARD_SWITCH_RANGE})`;
        scrolling = 'down';
        animationObject = index;
        isMoving = true;
      }
    }
  }

  if (animationObject !== undefined) {
    animationObject.addEventListener('transitionend', function(){
      if (scrolling === 'down') {
        animationObject.style.zIndex = 0;
        animationObject.style.transform = `translate(${offsetArray[COUNT_OF_CARDS]}px, ${offsetArray[COUNT_OF_CARDS]}px)`;

        for (let index of CARD_ARRAY) {
          index.style.zIndex = parseInt(index.style.zIndex) + 1;
          let offsetIndex = Math.abs(parseInt(index.style.zIndex) - COUNT_OF_CARDS);
          index.style.transform = `translate(${offsetArray[offsetIndex]}px, ${offsetArray[offsetIndex]}px)`;

          index.addEventListener('transitionend', () => isMoving = false, {once: true });
        }

        scrolling = '';
      }

      else if (scrolling === 'up'){
        for (let index of CARD_ARRAY) {
          index.style.zIndex = parseInt(index.style.zIndex) - 1;
          let offsetIndex = Math.abs(parseInt(index.style.zIndex) - COUNT_OF_CARDS);
          index.style.transform = `translate(${offsetArray[offsetIndex]}px, ${offsetArray[offsetIndex]}px)`;

          index.addEventListener('transitionend', () => isMoving = false, {once: true });
        }
        animationObject.style.zIndex = COUNT_OF_CARDS;
        animationObject.style.transform = `translate(0px, 0px)`;

        scrolling = '';
      }
    }, {once: true });
  }
});
