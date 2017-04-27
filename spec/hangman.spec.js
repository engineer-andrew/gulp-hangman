describe('Hangman', () => {
    it('should declare a variable named hangman', () => {
        // assert
        expect(hangman).toBeDefined();
    });

    it('should define some properties for hangman', () => {
        // assert
        expect(hangman.alphabet).toBeDefined();
        expect(hangman.alphabet).toEqual([]);
        expect(hangman.badGuesses).toBe(0);
        expect(hangman.correctGuesses).toBe(0);
        expect(hangman.wordToGuess).toBe('');
    });

    var inputs = [
        'buildAlphabetDisplay',
        'buildPlaceholders',
        'checkForGuessedLetter',
        'closeHelp',
        'draw',
        'drawLine',
        'evaluateGuess',
        'getNewWord',
        'init',
        'newGame',
        'revealMatches',
        'showHelp',
        'showResult'
    ];

    inputs.forEach((input) => {
        it('should define a method named ' + input, () => {
            // assert
            expect(hangman[input]).toBeDefined();
        });
    });

    describe('buildAlphabetDisplay', () => {
        beforeEach(() => {
            // arrange
            var letters = document.createElement('div');
            letters.id = 'letters';
            document.body.appendChild(letters);
        });

        it('should clear the display of all children before recreating it', () => {
            // act
            hangman.buildAlphabetDisplay();
            hangman.buildAlphabetDisplay();

            // assert
            expect(document.getElementById('letters').children.length).toBe(26);
        });

        it('should create an array populated with all uppercase letters in the English alphabet', () => {
            // act
            hangman.buildAlphabetDisplay();

            // assert
            expect(hangman.alphabet).toEqual(['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']);
        });

        it('should add a div for each letter in the alphabet to the letters div', () => {
            // act
            hangman.buildAlphabetDisplay();

            // assert
            expect(document.getElementById('letters').children.length).toBe(26);
        });

        it('should create a div with the letter as the inner html', () => {
            // act
            hangman.buildAlphabetDisplay();

            // assert
            expect(document.getElementById('letters').children[0].innerHTML).toBe('A');
        });

        it('should define classes for div', () => {
            // act
            hangman.buildAlphabetDisplay();

            // assert
            expect(document.getElementById('letters').children[0].classList.toString()).toEqual('col-sm-1 btn-danger clickable');
        });

        it('should assign a click event to the new div', () => {
            // act
            hangman.buildAlphabetDisplay();

            // assert
            expect(document.getElementById('letters').children[0].onclick).not.toBe(null);
        });

        afterEach(() => {
            document.body.removeChild(document.getElementById('letters'));
        });
    });

    describe('buildPlaceholders', () => {
        beforeEach(() => {
            // arrange
            hangman.wordToGuess = 'apple';

            var letters = document.createElement('div');
            letters.id = 'word';
            document.body.appendChild(letters);
        });

        it('should clear the display of all children before recreating it', () => {
            // act
            hangman.buildPlaceholders();
            hangman.buildPlaceholders();

            // assert
            expect(document.getElementById('word').children.length).toBe(5);
        });

        it('should add a div for each letter in the word to guess', () => {
            // act
            hangman.buildPlaceholders();

            // assert
            expect(document.getElementById('word').children.length).toBe(5);
        });

        it('should create a div with the letter as the inner html', () => {
            // act
            hangman.buildPlaceholders();

            // assert
            expect(document.getElementById('word').children[0].innerHTML).toBe('_');
        });

        afterEach(() => {
            document.body.removeChild(document.getElementById('word'));
        });
    });

    describe('checkForGuessedLetter', () => {
        beforeEach(() => {
            // arrange
            hangman.wordToGuess = 'apple';
            hangman.badGuesses = 0;
            hangman.correctGuesses = 0;
            spyOn(hangman, 'draw');
            spyOn(hangman, 'revealMatches');
        });

        it('should increment bad guesses by 1 when guessed letter is not in word', () => {
            // act
            hangman.checkForGuessedLetter('b');

            // assert
            expect(hangman.badGuesses).toBe(1);
            expect(hangman.correctGuesses).toBe(0);
        });

        it('should increment good guesses by 1 when guessed letter is in word and case matches', () => {
            // act
            hangman.checkForGuessedLetter('a');

            // assert
            expect(hangman.badGuesses).toBe(0);
            expect(hangman.correctGuesses).toBe(1);
        });

        it('should increment good guesses by 1 when guessed letter is in word and case does not match', () => {
            // act
            hangman.checkForGuessedLetter('A');

            // assert
            expect(hangman.badGuesses).toBe(0);
            expect(hangman.correctGuesses).toBe(1);
        });

        it('should draw a new part of the hung man when guessed letter is not in word', () => {
            // act
            hangman.checkForGuessedLetter('b');

            // assert
            expect(hangman.draw).toHaveBeenCalledTimes(1);
        });

        it('should reveal matching letters when guessed letter is in the word', () => {
            // act
            hangman.checkForGuessedLetter('p');

            // assert
            expect(hangman.revealMatches).toHaveBeenCalledTimes(1);
            expect(hangman.revealMatches).toHaveBeenCalledWith('p');
        });
    });

    describe('evaluateGuess', () => {
        var letter;
        beforeEach(() => {
            // arrange
            letter = document.createElement('div');
            letter.id = 'A';
            letter.innerHTML = 'A';
            letter.onclick = hangman.evaluateGuess;
            letter.classList = ['col-md-1 btn-danger clickable'];
            spyOn(document, 'getElementById').and.returnValue(letter);
            spyOn(hangman, 'checkForGuessedLetter');

            // act
            hangman.evaluateGuess('A');
        });

        it('should check for guessed letter', () => {
            // assert
            expect(hangman.checkForGuessedLetter).toHaveBeenCalledTimes(1);
            expect(hangman.checkForGuessedLetter).toHaveBeenCalledWith('A');
        });

        it('should clear letter from display', () => {
            // assert
            expect(letter.innerHTML).toBe('&nbsp;');
        });

        it('should remove clickable class from letter element', () => {
            // assert
            expect(letter.classList.toString()).toBe('col-md-1 btn-danger');
        });

        it('should remove click event from letter element', () => {
            // assert
            expect(letter.onclick).toBe(null);
        });
    });

    describe('getNewWord', () => {
        let xhr;
        beforeEach(() => {
            xhr = new XMLHttpRequest();
            spyOn(hangman, 'getXhrRequest').and.returnValue(xhr);
        });

        it('should call external api to retrieve a random word', () => {
            // arrange
            spyOn(xhr, 'open');
            spyOn(xhr, 'send');

            // act
            hangman.getNewWord();

            // assert
            expect(xhr.open).toHaveBeenCalledTimes(1);
            expect(xhr.open).toHaveBeenCalledWith('GET', 'http://www.setgetgo.com/randomword/get.php', true);
            expect(xhr.send).toHaveBeenCalledTimes(1);
            expect(xhr.send).toHaveBeenCalledWith('');
        });
    });

    describe('getXhrRequest', () => {
        it('should build placeholders when readystatechange is invoked, status is 200, and readyState is 4', () => {
            // act
            var result = hangman.getXhrRequest();

            // assert
            expect(result).not.toBe(null);
        });
    });

    describe('init', () => {
        beforeEach(() => {
            var helpText = document.createElement('div');
            helpText.id = 'helpText';
            document.body.appendChild(helpText);
            
            var play = document.createElement('div');
            play.id = 'play';
            play.style.display = 'none';
            play.onclick = null;
            document.body.appendChild(play);
            
            var clear = document.createElement('div');
            clear.id = 'clear';
            clear.style.display = 'none';
            clear.onclick = null;
            document.body.appendChild(clear);
            
            var help = document.createElement('div');
            help.id = 'help';
            help.onclick = null;
            help.style.display = 'none';
            document.body.appendChild(help);
            
            var helpText = document.createElement('div');
            helpText.id = 'helpText';
            helpText.style.display = 'none';
            document.body.appendChild(helpText);
            
            var close = document.createElement('div');
            close.id = 'close';
            close.onclick = null;
            close.style.display = 'none';
            document.body.appendChild(close);
        });

        it('should hide help', () => {
            // act
            hangman.init();

            // assert
            expect(document.getElementById('helpText').style.display).toBe('none');
        });
        
        it('should show play button', () => {
            // act
            hangman.init();
            
            // assert
            expect(document.getElementById('play').style.display).toBe('inline-block');
        });
        
        it('should show clear button', () => {
            // act
            hangman.init();
            
            // assert
            expect(document.getElementById('clear').style.display).toBe('inline-block');
        });
        
        it('should set onclick event of help div', () => {
            // act
            hangman.init();

            // assert
            var help = document.getElementById('help');            
            expect(help.onclick).not.toBe(null);
        });
        
        it('should set onclick event of close help div', () => {
            // act
            hangman.init();

            // assert
            var close = document.getElementById('close');            
            expect(close.onclick).not.toBe(null);
        });

        it('should set onclick event of play button', () => {
            // act
            hangman.init();

            // assert
            expect(document.getElementById('play').onclick).not.toBe(null);
        });

        it('should set onclick event of clear button', () => {
            // act
            hangman.init();

            // assert
            expect(document.getElementById('clear').onclick).not.toBe(null);
        });

        afterEach(() => {
            document.body.removeChild(document.getElementById('helpText'));
            document.body.removeChild(document.getElementById('play'));
            document.body.removeChild(document.getElementById('clear'));
            document.body.removeChild(document.getElementById('help'));
            document.body.removeChild(document.getElementById('helpText'));
            document.body.removeChild(document.getElementById('close'));
        });
    });

    describe('newGame', () => {
        beforeEach(() => {
            spyOn(hangman, 'buildAlphabetDisplay');
            spyOn(hangman, 'getNewWord');

            var canvas = document.createElement('canvas');
            canvas.id = 'canvas';
            document.body.appendChild(canvas);
        });

        it('should reset hangman object', () => {
            // arrange
            hangman.badGuesses = 15;
            hangman.correctGuesses = 15;

            // act
            hangman.newGame();

            // assert
            expect(hangman.badGuesses).toBe(0);
            expect(hangman.correctGuesses).toBe(0);
        });

        it('should get a new word', () => {
            // act
            hangman.newGame();

            // assert
            expect(hangman.getNewWord).toHaveBeenCalledTimes(1);
        });

        it('should rebuild alphabet display', () => {
            // act
            hangman.newGame();

            // assert
            expect(hangman.buildAlphabetDisplay).toHaveBeenCalledTimes(1);
        });

        afterEach(() => {
            document.body.removeChild(document.getElementById('canvas'));
        });
    });

    describe('revealMatches', () => {
        beforeEach(() => {
            // arrange
            hangman.wordToGuess = 'apple';

            var word = document.createElement('div');
            word.id = 'word';
            document.body.appendChild(word);
            hangman.buildPlaceholders();
        });

        it('should replace each underscore with the guessed letter when the guessed letter is in the word', () => {
            // act
            hangman.revealMatches('p');

            // assert
            var letters = document.getElementById('word').children;
            expect(letters[0].innerHTML).toBe('_');
            expect(letters[1].innerHTML).toBe('p');
            expect(letters[2].innerHTML).toBe('p');
            expect(letters[3].innerHTML).toBe('_');
            expect(letters[4].innerHTML).toBe('_');
        });

        afterEach(() => {
            document.body.removeChild(document.getElementById('word'));
        });
    });
});