describe('Hangman', () => {
    it('should populate alphabet with 26 characters', () => {
        // act
        hangman.buildAlphabetArray();

        // assert
        expect(hangman.alphabet.length).toBe(26);
    });

    it('should populate alphabet with 26 different letters', () => {
        // act
        hangman.buildAlphabetArray();

        // assert
        expect(hangman.alphabet).toEqual(['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']);
    });

    describe('newGame()', function(){
        beforeEach(function() {
            // functions are added to the window object when they're not explicitly
            // by creating a spy like this we're telling Jasmine that we want
            // to keep an eye on that method
            spyOn(hangman, 'buildAlphabetDisplay');
            spyOn(hangman, 'getNewWord');
            
            // since our newGame() function is going to manipulate the canvas object in the DOM,
            // we need to add it to the DOM before our tests run
            var canvas = document.createElement('canvas');
            canvas.id = "canvas";
            document.body.appendChild(canvas);
        });
        
        afterEach(function() {
            // since we added the canvas to the DOM before the tests, we want to remove it
            // from the DOM after each test
            document.body.removeChild(document.getElementById('canvas'));
        });
                
        it('should set badGuesses to 0', function() {
            hangman.badGuesses = 15;
            
            hangman.newGame();
            
            expect(hangman.badGuesses).toBe(0);
        });
        
        it('should set correctGuesses to 0', function() {
            hangman.correctGuesses = 15;
            
            hangman.newGame();
            
            expect(hangman.correctGuesses).toBe(0);
        });
        
        it('should call getNewWord', function() {
            hangman.newGame();
            
            // this expectation is possibly because we spied on this function in the beforeEach
            expect(hangman.getNewWord).toHaveBeenCalled();
        });
        
        it('should call buildAlphabetDisplay', function() {
            hangman.newGame();
            
            expect(hangman.buildAlphabetDisplay).toHaveBeenCalled();
        });
    });
    
    describe('getNewWord()', function() {
        beforeEach(function() {
            hangman.wordToGuess = '';
            
            // when Math.random() is called we want to spy on it (so we'll know it
            // was called), but we also want it to go ahead and return a random number
            spyOn(Math, 'random').and.callThrough();
            // when Math.floor() is called we want to spy on it and always return a 1
            spyOn(Math, 'floor').and.returnValue(1);
            spyOn(hangman, 'buildPlaceholders');
        });
        
        it('should call Math.random', function() {
            hangman.getNewWord();
            
            expect(Math.random).toHaveBeenCalled();
        });
        
        it('should call Math.floor', function() {
            hangman.getNewWord();
            
            expect(Math.floor).toHaveBeenCalled();
        });
        
        it('should set wordToGuess to word randomly selected from array', function() {            
            hangman.getNewWord();
            
            expect(hangman.wordToGuess).toBe('aberrant');
        });
        
        it('should call buildPlaceholders', function() {
            hangman.getNewWord();
            
            expect(hangman.buildPlaceholders).toHaveBeenCalled();
        });
    });
    
    describe('buildPlaceholders()', function() {
        beforeEach(function() {
            spyOn(document, 'getElementById').and.callThrough();
            
            var wordDiv = document.createElement('div');
            wordDiv.id = "word";
            document.body.appendChild(wordDiv);
        });
        
        afterEach(function() {
            document.body.removeChild(document.getElementById('word'));
        });
        
        it('should call document.getElementById for word', function() {            
            hangman.buildPlaceholders();
            
            expect(document.getElementById).toHaveBeenCalledWith('word');
        });
        
        it('should add an element for each letter in wordToGuess', function() {
            hangman.wordToGuess = 'apple';
            hangman.buildPlaceholders();
            
            var placeholdersDiv = document.getElementById('word');
            expect(placeholdersDiv.innerHTML.length).toBe(5);
        });
        
        it('should add an underscore for each letter in wordToGuess', function() {
            hangman.wordToGuess = 'apple';
            hangman.buildPlaceholders();
            
            var placeholdersDiv = document.getElementById('word');
            expect(placeholdersDiv.innerHTML[0]).toBe('_');
        });
    });
    
    describe('buildAlphabetDisplay()', function() {
        beforeEach(function() {
            spyOn(hangman, 'buildAlphabetArray');
            spyOn(document, 'getElementById').and.callThrough();
            spyOn(document, 'createDocumentFragment').and.callThrough();
            spyOn(hangman, 'buildSingleLetter').and.callThrough();;
            
            var lettersDiv = document.createElement('div');
            lettersDiv.id = "letters";
            document.body.appendChild(lettersDiv);
        });
        
        afterEach(function() {
            document.body.removeChild(document.getElementById('letters'));
        });
        
        it('should call buildAlphabetArray', function() {            
            hangman.buildAlphabetDisplay();
            
            expect(hangman.buildAlphabetArray).toHaveBeenCalled();
        });
        
        it('should call document.getElementById for letters', function() {            
            hangman.buildAlphabetDisplay();
            
            expect(document.getElementById).toHaveBeenCalledWith('letters');
        });
        
        it('should call buildSingleLetter once for each letter in alphabet', function() {
            hangman.buildAlphabetDisplay();
            
            var lettersDiv = document.getElementById('letters');
            // this expectation is to verify that the function (buildSingleLetter) was called exactly 26 times
            expect(hangman.buildSingleLetter.calls.count()).toEqual(26);
        });
        
        it('should pass each letter in alphabet once to buildSingleLetter', function() {
            hangman.buildAlphabetDisplay();
            
            var lettersDiv = document.getElementById('letters');
            expect(hangman.buildSingleLetter.calls.allArgs()).toEqual([['A'],['B'],['C'],['D'],['E'],['F'],['G'],['H'],['I'],['J'],['K'],['L'],['M'],['N'],['O'],['P'],['Q'],['R'],['S'],['T'],['U'],['V'],['W'],['X'],['Y'],['Z']]);
        });
        
        it('should call document.createDocumentFragment', function() {
            hangman.buildAlphabetDisplay();
            
            expect(document.createDocumentFragment).toHaveBeenCalled();
        });
        
        it('should add a div for each letter', function() {
            hangman.buildAlphabetDisplay();
            
            expect(document.getElementById('letters').children.length).toBe(26);
        });
    });
    
    describe('buildSingleLetter()', function() {
        beforeEach(function() {
            spyOn(document, 'createElement').and.callThrough();
        });
        
        it('should call document.createElement', function() {
            hangman.buildSingleLetter();
            
            expect(document.createElement).toHaveBeenCalled();
        });
        
        it('should set cursor style to pointer', function() {
            var div = hangman.buildSingleLetter('A');
            
            expect(div.style.cursor).toBe('pointer');
        });
        
        it('should set innerHTML to letter passed', function() {
            var div = hangman.buildSingleLetter('A');
            
            expect(div.innerHTML).toBe('A');
        });
        
        it('should set onclick event', function() {
            var div = hangman.buildSingleLetter('A');
            
            expect(div.onclick).not.toBe(null);
        });
    });
    
    describe('evaluateGuess()', function() {
        beforeEach(function() {
            var letterDiv = document.createElement('div');
            letterDiv.id = 'A';
            letterDiv.innerHTML = 'A';
            letterDiv.style.cursor = 'pointer';
            document.body.appendChild(letterDiv);
            spyOn(document, 'getElementById').and.returnValue(letterDiv);
            spyOn(hangman, 'checkForGuessedLetter');
        });
        
        afterEach(function() {
            document.body.removeChild(document.getElementById('A'));
        });
        
        it('should call checkForGuessedLetter', function() {
            hangman.evaluateGuess();
            
            expect(hangman.checkForGuessedLetter).toHaveBeenCalled();
        });
        
        it('should set innerHTML of clicked element to non-breaking space', function() {
            var letterDiv = document.getElementById('A');
            hangman.evaluateGuess();
            
            expect(letterDiv.innerHTML).toBe('&nbsp;');
        });
        
        it('should set cursor style of clicked element to default', function() {
            var letterDiv = document.getElementById('A');
            hangman.evaluateGuess();
            
            expect(letterDiv.style.cursor).toBe('default');
        });
        
        it('should set onclick event to null', function() {
            var letterDiv = document.getElementById('A');
            letterDiv.onclick = function() {};
            hangman.evaluateGuess();
            
            expect(letterDiv.onclick).toBe(null);
        });
    });
    
    describe('checkForGuessedLetter()', function() {
        beforeEach(function() {
            spyOn(document, 'getElementById').and.callThrough();
            // we can spy on pretty much anything (I haven't found something I wasn't able to spy on),
            // including JavaScript prototype functions like string.split()...
            spyOn(String.prototype, 'split').and.callThrough();
            spyOn(hangman, 'draw');
            // and Array.indexOf()
            spyOn(Array.prototype, 'indexOf').and.callThrough();
            
            var wordDiv = document.createElement('div');
            wordDiv.id = "word";
            wordDiv.innerHTML = '______';
            document.body.appendChild(wordDiv);
            
            hangman.wordToGuess = 'Applea';
        });
        
        afterEach(function() {
            document.body.removeChild(document.getElementById('word'));
        });
        
        it('should call document.getElementById', function() {
            hangman.checkForGuessedLetter('A');
            
            expect(document.getElementById).toHaveBeenCalledWith('word');
        });
        
        it('should split string into array', function() {
            hangman.checkForGuessedLetter('A');
            
            expect(String.prototype.split).toHaveBeenCalled();
        });
        
        it('should call Array.indexOf', function() {
            hangman.checkForGuessedLetter('A');
            
            expect(Array.prototype.indexOf).toHaveBeenCalledWith('A');
        });
        
        it('should call draw when letter is not in word', function() {
            hangman.wordToGuess = 'Apple';
            hangman.checkForGuessedLetter('Z');
            
            expect(hangman.draw).toHaveBeenCalled();
        });
        
        it('should not call draw when letter is in word', function() {
            hangman.wordToGuess = 'Apple';
            hangman.checkForGuessedLetter('A');
            
            expect(hangman.draw).not.toHaveBeenCalled();
        });
        
        it('should replace all underscores with letter when letter matches', function() {
            hangman.checkForGuessedLetter('A');
            var wordDiv = document.getElementById('word');
            
            expect(wordDiv.innerHTML).toBe('A____a');
        });
        
        it('should increment badGuesses by one when letter is not found', function() {
            hangman.badGuesses = 1;            
            hangman.checkForGuessedLetter('Z');
            
            expect(hangman.badGuesses).toBe(2);
        });
        
        it('should not increment badGuesses when letter is found', function() {
            hangman.badGuesses = 1;
            hangman.checkForGuessedLetter('A');
            
            expect(hangman.badGuesses).toBe(1);
        });
        
        it('should increment correctGuesses when letter is found', function() {
            hangman.correctGuesses = 1;
            hangman.checkForGuessedLetter('A');
            
            expect(hangman.correctGuesses).toBe(3);
        });
        
        it('should not increment correctGuesses when letter is not found', function() {
            hangman.correctGuesses = 1;
            hangman.checkForGuessedLetter('Z');
            
            expect(hangman.correctGuesses).toBe(1);
        });
    });
    
    describe('draw()', function() {
        var passedContext, passedStart, passedEnd;
        beforeEach(function() {
            spyOn(document, 'getElementById').and.callThrough();
            spyOn(hangman, 'showResult');
            spyOn(HTMLCanvasElement.prototype, 'getContext').and.callThrough();
            spyOn(CanvasRenderingContext2D.prototype, 'lineTo').and.callThrough();
            spyOn(CanvasRenderingContext2D.prototype, 'stroke').and.callThrough();
            spyOn(CanvasRenderingContext2D.prototype, 'beginPath').and.callThrough();
            spyOn(CanvasRenderingContext2D.prototype, 'moveTo').and.callThrough();
            spyOn(CanvasRenderingContext2D.prototype, 'arc').and.callThrough();
            spyOn(CanvasRenderingContext2D.prototype, 'fillText').and.callThrough();
            // here we're specifying that when the drawLine function is called we invoke
            // an entirely different, anonymous function
            spyOn(hangman, 'drawLine').and.callFake(function(context, start, end) {
                passedContext = context;
                passedStart = start;
                passedEnd = end;
            });
            
            var canvas = document.createElement('canvas');
            canvas.id = "canvas";
            document.body.appendChild(canvas);
            
            var letters = document.createElement('div');
            letters.id = "letters";
            letters.innerHTML = 'placeholder text';
            document.body.appendChild(letters);
            
            hangman.wordToGuess = 'Apple';
            hangman.badGuesses = 0;
            hangman.correctGuesses = 0;
            
            passedContext = null;
            passedStart = [0,0];
            passedEnd = [0,0];
        });
        
        afterEach(function() {
            document.body.removeChild(document.getElementById('canvas'));
            document.body.removeChild(document.getElementById('letters'));
        });
        
        it('should call document.getElementById', function() {
            hangman.draw();
            
            expect(document.getElementById).toHaveBeenCalledWith('canvas');
        });
        
        it('should call HTMLCanvasElement.getContext', function() {
            hangman.draw();
            
            expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d');
        });
        
        it('should set line color to black', function() {
            hangman.draw();
            
            expect(passedContext.fillStyle).toBe('#a52a2a');
        });
        
        it('should set line width to 10', function() {
            hangman.draw();
            
            expect(passedContext.lineWidth).toBe(10);
        });
        
        it('should call drawLine', function() {
            hangman.draw();
            
            expect(hangman.drawLine).toHaveBeenCalled();
        });
        
        it('should call drawLine twice when one bad guess has been made', function() {
            hangman.badGuesses = 1;
            hangman.draw();
            
            expect(hangman.drawLine.calls.count()).toBe(2);
        });
        
        it('should pass in coordinates to start gallow pole when one bad guess has been made', function() {
            hangman.badGuesses = 1;
            hangman.draw();
            
            // this expectation is checking the arguments passed to the most recent call
            // to the drawLine function
            expect(hangman.drawLine.calls.mostRecent().args[1]).toEqual([30,185]);
        });
        
        it('should pass in coordinates to end gallow pole when one bad guess has been made', function() {
            hangman.badGuesses = 1;
            hangman.draw();
            
            expect(hangman.drawLine.calls.mostRecent().args[2]).toEqual([30,10]);
        });
        
        it('should draw gallow arm when two bad guesses have been made', function() {
            hangman.badGuesses = 2;
            hangman.draw();
            
            expect(CanvasRenderingContext2D.prototype.lineTo).toHaveBeenCalled();
            expect(CanvasRenderingContext2D.prototype.stroke).toHaveBeenCalled();
        });
        
        it('should call drawLine three times when three bad guesses have been made', function() {
            hangman.badGuesses = 3;
            hangman.draw();
            
            expect(hangman.drawLine.calls.count()).toBe(3);
        });
        
        it('should pass in coordinates to start noose when three bad guesses have been made', function() {
            hangman.badGuesses = 3;
            hangman.draw();
            
            expect(hangman.drawLine.calls.mostRecent().args[1]).toEqual([145,15]);
        });
        
        it('should pass in coordinates to end noose when three bad guesses have been made', function() {
            hangman.badGuesses = 3;
            hangman.draw();
            
            expect(hangman.drawLine.calls.mostRecent().args[2]).toEqual([145,30]);
        });
        
        it('should draw head when three bad guesses have been made', function() {
            hangman.badGuesses = 3;
            hangman.draw();
            
            // although most testing experts consider testing multiple expectations in a single
            // spec to be bad form, this is one of the situations where it didn't make sense to me to break it out into 
            // 11 separate tests
            expect(CanvasRenderingContext2D.prototype.beginPath.calls.count()).toBe(1);
            expect(CanvasRenderingContext2D.prototype.moveTo.calls.count()).toBe(1);
            expect(CanvasRenderingContext2D.prototype.moveTo.calls.mostRecent().args[0]).toBe(160);
            expect(CanvasRenderingContext2D.prototype.moveTo.calls.mostRecent().args[1]).toBe(45);
            expect(CanvasRenderingContext2D.prototype.arc.calls.count()).toBe(1);
            expect(CanvasRenderingContext2D.prototype.arc.calls.mostRecent().args[0]).toBe(145);
            expect(CanvasRenderingContext2D.prototype.arc.calls.mostRecent().args[1]).toBe(45);
            expect(CanvasRenderingContext2D.prototype.arc.calls.mostRecent().args[2]).toBe(15);
            expect(CanvasRenderingContext2D.prototype.arc.calls.mostRecent().args[3]).toBe(0);
            expect(CanvasRenderingContext2D.prototype.arc.calls.mostRecent().args[4]).toBe((Math.PI/180)*360);
            expect(CanvasRenderingContext2D.prototype.stroke.calls.count()).toBe(2);
        });
        
        it('should call drawLine four times when four bad guesses have been made', function() {
            hangman.badGuesses = 4;
            hangman.draw();
            
            expect(hangman.drawLine.calls.count()).toBe(4);
        });
        
        it('should pass in coordinates to start body when four bad guesses have been made', function() {
            hangman.badGuesses = 4;
            hangman.draw();
            
            expect(hangman.drawLine.calls.mostRecent().args[1]).toEqual([145,60]);
        });
        
        it('should pass in coordinates to end body when four bad guesses have been made', function() {
            hangman.badGuesses = 4;
            hangman.draw();
            
            expect(hangman.drawLine.calls.mostRecent().args[2]).toEqual([145,130]);
        });
        
        it('should call drawLine five times when five bad guesses have been made', function() {
            hangman.badGuesses = 5;
            hangman.draw();
            
            expect(hangman.drawLine.calls.count()).toBe(5);
        });
        
        it('should pass in coordinates to start left arm when five bad guesses have been made', function() {
            hangman.badGuesses = 5;
            hangman.draw();
            
            expect(hangman.drawLine.calls.mostRecent().args[1]).toEqual([145,80]);
        });
        
        it('should pass in coordinates to end left arm when five bad guesses have been made', function() {
            hangman.badGuesses = 5;
            hangman.draw();
            
            expect(hangman.drawLine.calls.mostRecent().args[2]).toEqual([110,90]);
        });
        
        it('should call drawLine six times when six bad guesses have been made', function() {
            hangman.badGuesses = 6;
            hangman.draw();
            
            expect(hangman.drawLine.calls.count()).toBe(6);
        });
        
        it('should pass in coordinates to start right arm when six bad guesses have been made', function() {
            hangman.badGuesses = 6;
            hangman.draw();
            
            expect(hangman.drawLine.calls.mostRecent().args[1]).toEqual([145,80]);
        });
        
        it('should pass in coordinates to end right arm when six bad guesses have been made', function() {
            hangman.badGuesses = 6;
            hangman.draw();
            
            expect(hangman.drawLine.calls.mostRecent().args[2]).toEqual([180,90]);
        });
        
        it('should call drawLine seven times when seven bad guesses have been made', function() {
            hangman.badGuesses = 7;
            hangman.draw();
            
            expect(hangman.drawLine.calls.count()).toBe(7);
        });
        
        it('should pass in coordinates to start left leg when seven bad guesses have been made', function() {
            hangman.badGuesses = 7;
            hangman.draw();
            
            expect(hangman.drawLine.calls.mostRecent().args[1]).toEqual([145,130]);
        });
        
        it('should pass in coordinates to end left leg when seven bad guesses have been made', function() {
            hangman.badGuesses = 7;
            hangman.draw();
            
            expect(hangman.drawLine.calls.mostRecent().args[2]).toEqual([130,170]);
        });
        
        it('should call drawLine eight times when eight bad guesses have been made', function() {
            hangman.badGuesses = 8;
            hangman.draw();
            
            expect(hangman.drawLine.calls.count()).toBe(8);
        });
        
        it('should pass in coordinates to start right leg when eight bad guesses have been made', function() {
            hangman.badGuesses = 8;
            hangman.draw();
            
            expect(hangman.drawLine.calls.mostRecent().args[1]).toEqual([145,130]);
        });
        
        it('should pass in coordinates to end right leg when eight bad guesses have been made', function() {
            hangman.badGuesses = 8;
            hangman.draw();
            
            expect(hangman.drawLine.calls.mostRecent().args[2]).toEqual([160,170]);
        });
        
        it('should call fillText with Game Over when eight bad guesses have been made', function() {
            hangman.badGuesses = 8;
            hangman.draw();
            
            expect(CanvasRenderingContext2D.prototype.fillText).toHaveBeenCalledWith('Game Over!', 45, 110);
        });
        
        it('should clear alphabet when eight bad guesses have been made', function() {
            hangman.badGuesses = 8;
            hangman.draw();
            
            var letters = document.getElementById('letters');
            expect(letters.innerHTML).toBe('');
        });
        
        it('should clear alphabet when word has been guessed correctly', function() {
            hangman.correctGuesses = hangman.wordToGuess.length;
            hangman.draw();
            
            var letters = document.getElementById('letters');
            expect(letters.innerHTML).toBe('');
        });
        
        it('should call fillText with You Won when word has been guessed correctly', function() {
            hangman.correctGuesses = hangman.wordToGuess.length;
            hangman.draw();
            
            expect(CanvasRenderingContext2D.prototype.fillText).toHaveBeenCalledWith('You Won!', 45, 110);
        });
    });

    describe('init()', function() {
        beforeEach(function() {
            var loading = document.createElement('p');
            loading.id = 'loading';
            document.body.appendChild(loading);
            
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
        
        afterEach(function() {
            document.body.removeChild(document.getElementById('loading'));
            document.body.removeChild(document.getElementById('play'));
            document.body.removeChild(document.getElementById('clear'));
            document.body.removeChild(document.getElementById('help'));
            document.body.removeChild(document.getElementById('helpText'));
            document.body.removeChild(document.getElementById('close'));
        });
        
        it('should hide loading div', function() {
            hangman.init();
            
            expect(document.getElementById('loading').style.display).toBe('none');
        });
        
        it('should show play div', function() {
            hangman.init();
            
            expect(document.getElementById('play').style.display).toBe('inline-block');
        });
        
        it('should show clear div', function() {
            hangman.init();
            
            expect(document.getElementById('clear').style.display).toBe('inline-block');
        });
        
        it('should set onclick event of help div', function() {
            hangman.init();
            var help = document.getElementById('help');
            
            expect(help.onclick).not.toBe(null);
        });
        
        it('should set onclick event of close help div', function() {
            hangman.init();
            var close = document.getElementById('close');
            
            expect(close.onclick).not.toBe(null);
        });
    });
    
    describe('showHelp()', function() {
        beforeEach(function() {
            spyOn(document.body, 'appendChild').and.callThrough();
            
            var help = document.createElement('div');
            help.id = 'help';
            help.onclick = null;
            help.style.display = 'none';
            document.body.appendChild(help);
            
            var helpText = document.createElement('div');
            helpText.id = 'helpText';
            helpText.style.display = 'none';
            document.body.appendChild(helpText);
        });
        
        afterEach(function() {
            document.body.removeChild(document.getElementById('helpText'));
            document.body.removeChild(document.getElementById('help'));
            document.body.removeChild(document.getElementById('mask'));
        });
        
        it('should append mask div to body', function() {
            hangman.showHelp();
            
            expect(document.body.appendChild.calls.count()).toBe(3);
        });
        
        it('should display helpText div', function() {
            hangman.showHelp();
            
            expect(document.getElementById('helpText').style.display).toBe('block');
        });
    });
    
    describe('closeHelp()', function() {
        beforeEach(function() {
            var close = document.createElement('div');
            close.id = 'close';
            close.onclick = null;
            close.style.display = 'none';
            document.body.appendChild(close);
            
            var mask = document.createElement('div');
            mask.id = 'mask';
            document.body.appendChild(mask);
        });
        
        afterEach(function() {
            document.body.removeChild(document.getElementById('close'));
        });
        
        it('should remove mask from body', function() {
            hangman.closeHelp();
            
            var mask = document.getElementById('mask');
            expect(mask).toBe(null);
        });
    });
    
    describe('showResult()', function() {
        beforeEach(function() {
            spyOn(document, 'getElementById').and.callThrough();
            spyOn(String.prototype, 'split').and.callThrough();
            spyOn(Array.prototype, 'join').and.callThrough();
            
            var wordDiv = document.createElement('div');
            wordDiv.id = "word";
            wordDiv.innerHTML = 'a__l_';
            document.body.appendChild(wordDiv);
            
            hangman.showResult();
        });
        
        afterEach(function() {
            document.body.removeChild(document.getElementById('word'));
        });
        
        it('should call document.getElementById', function() {            
            expect(document.getElementById).toHaveBeenCalledWith('word');
        });

        it('should call String.split', function() {            
            expect(String.prototype.split).toHaveBeenCalledWith('');
        });
        
        it('should call Array.join', function() {            
            expect(Array.prototype.join).toHaveBeenCalledWith('');
        });
        
        it('should replace all underscores with their letter', function() {            
            var wordDiv = document.getElementById('word');
            expect(wordDiv.innerHTML).toBe('a<span style="color:red">P</span><span style="color:red">P</span>l<span style="color:red">E</span>');
        });
    });
    
    describe('drawLine()', function() {
        var context;
        
        beforeEach(function() {
            spyOn(CanvasRenderingContext2D.prototype, 'beginPath').and.callThrough();
            spyOn(CanvasRenderingContext2D.prototype, 'moveTo').and.callThrough();
            spyOn(CanvasRenderingContext2D.prototype, 'lineTo').and.callThrough();
            spyOn(CanvasRenderingContext2D.prototype, 'stroke').and.callThrough();
            
            var canvas = document.createElement('canvas');
            canvas.id = "canvas";
            document.body.appendChild(canvas);
            
            context = canvas.getContext('2d');
            hangman.drawLine(context, [145,15], [145,30]);
        });
        
        afterEach(function() {
            document.body.removeChild(document.getElementById('canvas'));
        });
        
        it('should invoke context.beginPath', function() {
            expect(CanvasRenderingContext2D.prototype.beginPath).toHaveBeenCalled();
        });
        
        it('should invoke context.moveTo', function() {
            expect(CanvasRenderingContext2D.prototype.moveTo).toHaveBeenCalledWith(145, 15);
        });
        
        it('should invoke context.lineTo', function() {
            expect(CanvasRenderingContext2D.prototype.lineTo).toHaveBeenCalledWith(145, 30);
        });
        
        it('should invoke context.beginPath', function() {
            expect(CanvasRenderingContext2D.prototype.stroke).toHaveBeenCalled();
        });
    });
});