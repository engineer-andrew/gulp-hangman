var hangman = hangman || {
    alphabet: [],
    badGuesses: 0,
    correctGuesses: 0,
    wordToGuess: ''
};

hangman.buildAlphabetDisplay = () => {
    hangman.alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    document.getElementById('letters').innerHTML = '';

    hangman.alphabet.forEach((letter) => {
        var div = document.createElement('div');
        div.innerHTML = letter;
        div.id = letter;
        div.classList = ['col-sm-1 btn-danger clickable'];
        div.onclick = hangman.evaluateGuess;
        document.getElementById('letters').appendChild(div);
    });
};

hangman.buildPlaceholders = () => {
    document.getElementById('word').innerHTML = '';

    hangman.wordToGuess.split('').forEach(() => {
        var span = document.createElement('span');
        span.innerHTML = '_';
        document.getElementById('word').appendChild(span);
    });
};

hangman.checkForGuessedLetter = (letter) => {
    var lower = letter.toLowerCase();
    if (hangman.wordToGuess.toLowerCase().indexOf(lower) > -1) {        
        hangman.revealMatches(lower);

        if (hangman.correctGuesses === hangman.wordToGuess.length) {
            hangman.draw();
        }
    } else {
        hangman.badGuesses++;
        hangman.draw();
    }
};

hangman.clearScore = () => {};

hangman.closeHelp = () => {
    document.getElementById('helpText').style.display = 'none';
    document.body.removeChild(document.getElementById('mask'));
};

hangman.draw = () => {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
        
    context.lineWidth = 10;
    context.fillStyle = 'brown';    
    // draw the ground
    hangman.drawLine(context, [20,190], [180,190]);
    
    if (hangman.badGuesses > 0) {
        hangman.drawLine(context, [30,185], [30,10]);
        
        if (hangman.badGuesses > 1) {
            context.lineTo(150, 10);
            context.stroke();
        }
        
        if (hangman.badGuesses > 2) {
            // draw rope
            hangman.drawLine(context, [145,15], [145,30]);
            // draw head
            context.beginPath();
            context.moveTo(160, 45);
            context.arc(145, 45, 15, 0, (Math.PI/180)*360);
            context.stroke();
        }
        
        if (hangman.badGuesses > 3) {
            // draw body
            hangman.drawLine(context, [145,60], [145,130]);
        }
        
        if (hangman.badGuesses > 4) {
            // draw left arm
            hangman.drawLine(context, [145,80], [110,90]);
        }
        
        if (hangman.badGuesses > 5) {
            // draw right arm
            hangman.drawLine(context, [145,80], [180,90]);
        }
        
        if (hangman.badGuesses > 6) {
            // draw left leg
            hangman.drawLine(context, [145,130], [130,170]);
        }
        
        if (hangman.badGuesses > 7) {
            // draw right leg
            hangman.drawLine(context, [145,130], [160,170]);
            // display game over message
            context.fillText('Game Over!', 45, 110);
            // clear alphabet
            document.getElementById('letters').innerHTML = '';
            
            setTimeout(hangman.showResult, 200);
        }
    }

    if (hangman.correctGuesses == hangman.wordToGuess.length) {
        document.getElementById('letters').innerHTML = '';
        context.fillText('You Won!', 45,110);
    }
};

hangman.drawLine = (context, from, to) => {
    context.beginPath();
    context.moveTo(from[0], from[1]);
    context.lineTo(to[0], to[1]);
    context.stroke();
};

hangman.evaluateGuess = (mouseEvent) => {
    var letter = mouseEvent.target.innerHTML;
    var letterDiv = document.getElementById(letter);
    hangman.checkForGuessedLetter(letter);
    letterDiv.innerHTML = '&nbsp;';
    letterDiv.classList.remove('clickable');
    letterDiv.onclick = null;
};

hangman.getNewWord = () => {
    let xhr = hangman.getXhrRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState < 4) {
            return;
        }

        if (xhr.status !== 200) {
            return;
        }

        if (xhr.readyState === 4) {
            hangman.wordToGuess = xhr.responseText;
            hangman.buildPlaceholders();
        }
    };

    xhr.open('GET', 'http://www.setgetgo.com/randomword/get.php', true);
    xhr.send('');
};

hangman.getXhrRequest = () => {
    return new XMLHttpRequest();
};

hangman.init = () => {
    document.getElementById('helpText').style.display = 'none';
    document.getElementById('play').style.display = 'inline-block';
    document.getElementById('clear').style.display = 'inline-block';
    document.getElementById('help').onclick = hangman.showHelp;
    document.getElementById('close').onclick = hangman.closeHelp;
    document.getElementById('play').onclick = hangman.newGame;
    document.getElementById('clear').onclick = hangman.clearScore;
};

hangman.newGame = () => {
    hangman.badGuesses = 0;
    hangman.correctGuesses = 0;
    hangman.getNewWord();
    hangman.buildAlphabetDisplay();
    var canvas = document.getElementById('canvas');
    canvas.width = canvas.width;
};

hangman.revealMatches = (letter) => {
    var letters = document.getElementById('word').children;
    for (var i = 0; i < hangman.wordToGuess.length; i++) {
        if (hangman.wordToGuess.charAt(i).toLowerCase() === letter) {
            hangman.correctGuesses++;
            letters[i].innerHTML = letter;
        }
    }
};

hangman.showHelp = () => {
    var mask = document.createElement('div');
    mask.id = 'mask';    

    document.body.appendChild(mask);
    
    document.getElementById('helpText').style.display = 'block';
};

hangman.showResult = function () {
    var letters = document.getElementById('word').children;
    for (var i = 0; i < hangman.wordToGuess.length; i++) {
        if (letters[i].innerHTML === '_') {
            letters[i].classList.add('missed-letter');
            letters[i].innerHTML = hangman.wordToGuess.charAt(i);
        }
    }
};