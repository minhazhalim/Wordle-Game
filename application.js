const words = [
     'Zebra',
     'Sling',
     'Crate',
     'Brick',
     'press',
     'truth',
     'sweet',
     'salty',
     'alert',
     'check',
     'roast',
     'toast',
     'shred',
     'cheek',
     'shock',
     'czech',
     'woman',
     'wreck',
     'court',
     'coast',
     'flake',
     'think',
     'smoke',
     'unrig',
     'slant',
     'ultra',
     'vague',
     'pouch',
     'radix',
     'yeast',
     'zoned',
     'cause',
     'quick',
     'bloat',
     'level',
     'civil',
     'civic',
     'madam',
     'house',
     'delay',
];
const container = document.querySelector('.container');
const winScreen = document.querySelector('.win-screen');
const submitButton = document.querySelector('.submit-button');
let backSpaceCount = 0;
let inputRow;
let inputCount;
let tryCount;
let randomWord;
let finalWord;
const isTouchDevice = () => {
     try {
          document.createEvent('TouchEvent');
          return true;
     }catch(error){
          return false;
     }
};
const getRandom = () => words[Math.floor(Math.random() * words.length)].toLowerCase();
const updateDivConfig = (element,disabledStatus) => {
     element.disabled = disabledStatus;
     if(!disabledStatus) element.focus();
};
const checker = async (event) => {
     let value = event.target.value.toUpperCase();
     updateDivConfig(event.target,true);
     if(value.length == 1){
          if(inputCount <= 4 && event.key != 'Backspace'){
               finalWord += value;
               if(inputCount < 4){
                    updateDivConfig(event.target.nextSibling,false);
               }
          }
          inputCount += 1;
     }else if(value.length == 0 && event.key == 'Backspace'){
          finalWord = finalWord.substring(0,finalWord.length - 1);
          if(inputCount == 0){
               updateDivConfig(event.target,false);
               return false;
          }
          updateDivConfig(event.target,true);
          event.target.previousSibling.value = "";
          updateDivConfig(event.target.previousSibling,false);
          inputCount = -1;
     }
};
const startGame = async () => {
     winScreen.classList.add('hide');
     container.innerHTML = "";
     inputCount = 0;
     successCount = 0;
     tryCount = 0;
     finalWord = "";
     for(let i = 0;i < 6;i++){
          const div = document.createElement('div');
          div.classList.add('input-group');
          for(let j = 0;j < 5;j++){
               div.innerHTML += '<input type="text" class="input-box" onkeyup="checker(event)" maxLength="1" disabled>';
          }
          await container.appendChild(div);
     }
     inputRow = document.querySelectorAll('.input-group');
     inputBox = document.querySelectorAll('.input-box');
     updateDivConfig(inputRow[tryCount].firstChild,false);
     randomWord = getRandom();
};
window.onload = startGame();
const validateWord = async () => {
     if(isTouchDevice()){
          submitButton.classList.add('hide');
     }
     let failed = false;
     let currentInputs = inputRow[tryCount].querySelectorAll('.input-box');
     await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${finalWord}`).then((response) => {
          if(response.status == '404'){
               console.clear();
               alert('Please Enter Valid Word');
               failed = true;
          }
     });
     if(failed) return false;
     let successCount = 0;
     let successLetters = "";
     for(let i in randomWord){
          if(finalWord[i] == randomWord[i]){
               currentInputs[i].classList.add('correct');
               successCount += 1;
               successLetters += randomWord[i];
          }else if(randomWord.includes(finalWord[i]) && !successLetters.includes(finalWord[i])){
               currentInputs[i].classList.add('exists');
          }else{
               currentInputs[i].classList.add('incorrect');
          }
     }
     tryCount += 1;
     if(successCount == 5){
          setTimeout(() => {
               winScreen.classList.remove('hide');
               winScreen.innerHTML = `
                    <span>total guesses: ${tryCount}</span>
                    <button onClick="startGame()">new game</button>
               `;
          },1000);
     }else{
          inputCount = 0;
          finalWord = "";
          if(tryCount == 6){
               tryCount = 0;
               winScreen.classList.remove('hide');
               winScreen.innerHTML = `
                    <span>you lose</span>
                    <button onClick="startGame()">new game</button>
               `;
               return false;
          }
          updateDivConfig(inputRow[tryCount].firstChild,false);
     }
     inputCount = 0;
};
window.addEventListener('keyup',(event) => {
     if(inputCount > 4){
          if(isTouchDevice()){
               submitButton.classList.remove('hide');
          }
          if(event.key == 'Enter') validateWord();
          else if(event.key == 'Backspace'){
               inputRow[tryCount].lastChild.value = "";
               finalWord = finalWord.substring(0,finalWord.length - 1);
               updateDivConfig(inputRow[tryCount].lastChild,false);
               inputCount -= 1;
          }
     }
});