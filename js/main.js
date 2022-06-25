
//data
let started = false;
let currentWord = "";
let errors = 0;
let points = 0;
let currentWordPoints= 0;
let accerts = 0;
let parts = ["l", "cabeza", "cuerpo", "mano-derecha", "mano-izquierda", "pie-derecho", "pie-izquierdo", "cuerda"];
let part = 0;
let breakGame = false;

function inputInner(index) {
    return `<input type="text" class="input-letter" id="${index}" readonly>`;
}

function addWord(word){
    if(word.length <= 0) return;
    if(localStorage.getItem("words") == null){
        localStorage.setItem("words", JSON.stringify(_words));
    } else {
        let allWords = JSON.parse(localStorage.getItem("words"));
        allWords.words.push(word);
        localStorage.setItem("words", JSON.stringify(allWords));
    }
}

function getWords(){
    if(localStorage.getItem("words") == null){
        localStorage.setItem("words", JSON.stringify(_words));
        return _words.words;
    } else {
        return (JSON.parse(localStorage.getItem("words"))).words;
    }
}

function getAnyWord(){
    let words = getWords();
    return words[Math.floor(Math.random() * words.length)];
}

function start(){
    if(started == true || started == false && breakGame == true) return;
    let contain_body = document.getElementById("contain-body");
    let word = getAnyWord();
    currentWord = word;
    for(let i = 0; i < word.length; i++){
        contain_body.innerHTML += inputInner("index"+i);
    }
    for(let i = 0; i < parts.length; i++){
        document.getElementById(parts[i]).style.opacity = 0;
        part = 0;
    }
    document.getElementById('lose').textContent = "";
    return started = true;

}
function restartAll(){
    let contain_body = document.getElementById("contain-body");
    document.getElementById('lose').textContent = "";
    contain_body.innerHTML = `<div id="contain-body"></div>`;
    for(let i = 0; i < parts.length; i++){
        document.getElementById(parts[i]).style.opacity = 0;
        part = 0;
    }
    let _keys = Object.keys(_used);
    for(let _key of _keys){
        _used[_key] = false;
    }
    breakGame = false;
    points = 0;
    accerts = 0;
    currentWordPoints = 0;
    errors = 0;
    localStorage.removeItem('words');
    document.getElementById('points').textContent = points;
    document.getElementById('words-err').textContent = errors;
    document.getElementById('words-accert').textContent = accerts;
    return started = false;
}
function restart() {
    let contain_body = document.getElementById("contain-body");
    document.getElementById('lose').textContent = "";
    contain_body.innerHTML = `<div id="contain-body"></div>`;
    for(let i = 0; i < parts.length; i++){
        document.getElementById(parts[i]).style.opacity = 0;
        part = 0;
    }
    let _keys = Object.keys(_used);
    for(let _key of _keys){
        _used[_key] = false;
    }
    breakGame = false;
    return started = false;
}

async function ifHasLetter(letter){
    if(_used[letter] == true || _used[letter] == undefined) return false;
    let word = currentWord;
    let acerts = 0;
    for(let i = 0; i < word.length; i++){
        if(word[i] == letter){
            document.getElementById("index"+i).value = letter;
            if(_used[letter] == false) _used[letter] = true;
            acerts =  acerts + 1;
        }
    }
    if(acerts <= 0){
        return false;
    } else {
        return acerts;
    }
}

let digit = document.getElementById('digit')
    digit.addEventListener('input', async () => {
        if(started == false){
            document.getElementById('digit').value = "";
            digit.removeAttribute("readonly")
            return;
        }
        if(breakGame == true){
            document.getElementById('digit').value = "";
            digit.removeAttribute("readonly")
            return;
        }
        if(digit.value.length == 1){
            digit.setAttribute("readonly", "true");
            await ifHasLetter(digit.value).then(acerts => {
                if(acerts == false){
                    errors = errors + 1;
                    document.getElementById('words-err').textContent = errors;
                    digit.value = "";
                    digit.removeAttribute("readonly");
                    newPart();
                } else {
                    digit.value = "";
                    digit.removeAttribute("readonly");
                    points = points + acerts;
                    currentWordPoints = currentWordPoints + acerts;
                    document.getElementById('points').textContent = points;
                    if(currentWordPoints >= currentWord.length){
                        gameOver(false);
                    }
                }
            })

        }
    })

window.addEventListener('keydown', async (e) => {
    if(window.matchMedia('(max-width: 768px)').matches == true) return;
    if(started == false) return;
    if(breakGame == true) return;
    let letter = e.key;
    if(letter.length != 1) return;
    await ifHasLetter(letter).then(acerts => {
        if(acerts == false){
            errors = errors + 1;
            document.getElementById('words-err').textContent = errors;
            newPart();
        } else {
            points = points + acerts;
            currentWordPoints = currentWordPoints + acerts;
            document.getElementById('points').textContent = points;
            if(currentWordPoints >= currentWord.length){
                gameOver(false);
            }
        }
    })
});

function nextGame(){
    let initialDisplay = `<div id="contain-body"></div>`;
    document.getElementById('contain-body').innerHTML = initialDisplay;
    document.getElementById('win').textContent = "";
    document.getElementById('lose').textContent = "";
    restart();
    start();
}

function newPart() {
    if(part >= 8){
        gameOver();
        part = 0;
        return;
    }
    let cPart = parts[part];
    document.getElementById(cPart).style.opacity = 1;
    if(part == 7){
        gameOver();
        part = 0;
        return;
    }
    part = part + 1;
    return;
}

function gameOver(data){
    let initialDisplay = `<div id="contain-body"></div>`;
    if(data == false){
    document.getElementById('contain-body').innerHTML = initialDisplay;
    document.getElementById('win').textContent = "Parabens você ganhou!";
    accerts = accerts + 1;
    document.getElementById('words-accert').textContent = accerts;
    breakGame = true;
    currentWordPoints = 0;
    restart();
    } else {
    document.getElementById('contain-body').innerHTML = initialDisplay;
    document.getElementById('lose').textContent = "Você perdeu!";
    breakGame = true;
    started = false;
    currentWordPoints = 0;
    }
}