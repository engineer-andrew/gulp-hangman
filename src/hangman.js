var hangman = hangman || {
    alphabet: [],
    badGuesses: 0,
    correctGuesses: 0,
    wordToGuess: '',
    wordArray: ['abate','aberrant','abscond','accolade','acerbic','acumen','adulation','adulterate','aesthetic','aggrandize','alacrity','alchemy','amalgamate','ameliorate','amenable','anachronism','anomaly','approbation','archaic','arduous','ascetic','assuage','astringent','audacious','austere','avarice','aver','axiom','bolster','bombast','bombastic','bucolic','burgeon','cacophony','canon','canonical','capricious','castigation','catalyst','caustic','censure','chary','chicanery','cogent','complaisance','connoisseur','contentious','contrite','convention','convoluted','credulous','culpable','cynicism','dearth','decorum','demur','derision','desiccate','diatribe','didactic','dilettante','disabuse','discordant','discretion','disinterested','disparage','disparate','dissemble','divulge','dogmatic','ebullience','eccentric','eclectic','effrontery','elegy','eloquent','emollient','empirical','endemic','enervate','enigmatic','ennui','ephemeral','equivocate','erudite','esoteric','eulogy','evanescent','exacerbate','exculpate','exigent','exonerate','extemporaneous','facetious','fallacy','fawn','fervent','filibuster','flout','fortuitous','fulminate','furtive','garrulous','germane','glib','grandiloquence','gregarious','hackneyed','halcyon','harangue','hedonism','hegemony','heretical','hubris','hyperbole','iconoclast','idolatrous','imminent','immutable','impassive','impecunious','imperturbable','impetuous','implacable','impunity','inchoate','incipient','indifferent','inert','infelicitous','ingenuous','inimical','innocuous','insipid','intractable','intransigent','intrepid','inured','inveigle','irascible','laconic','laud','loquacious','lucid','luminous','magnanimity','malevolent','malleable','martial','maverick','mendacity','mercurial','meticulous','misanthrope','mitigate','mollify','morose','mundane','nebulous','neologism','neophyte','noxious','obdurate','obfuscate','obsequious','obstinate','obtuse','obviate','occlude','odious','onerous','opaque','opprobrium','oscillation','ostentatious','paean','parody','pedagogy','pedantic','penurious','penury','perennial','perfidy','perfunctory','pernicious','perspicacious','peruse','pervade','pervasive','phlegmatic','pine','pious','pirate','pith','pithy','placate','platitude','plethora','plummet','polemical','pragmatic','prattle','precipitate','precursor','predilection','preen','prescience','presumptuous','prevaricate','pristine','probity','proclivity','prodigal','prodigious','profligate','profuse','proliferate','prolific','propensity','prosaic','pungent','putrefy','quaff','qualm','querulous','query','quiescence','quixotic','quotidian','rancorous','rarefy','recalcitrant','recant','recondite','redoubtable','refulgent','refute','relegate','renege','repudiate','rescind','reticent','reverent','rhetoric','salubrious','sanction','satire','sedulous','shard','solicitous','solvent','soporific','sordid','sparse','specious','spendthrift','sporadic','spurious','squalid','squander','static','stoic','stupefy','stymie','subpoena','subtle','succinct','superfluous','supplant','surfeit','synthesis','tacit','tenacity','terse','tirade','torpid','torque','tortuous','tout','transient','trenchant','truculent','ubiquitous','unfeigned','untenable','urbane','vacillate','variegated','veracity','vexation','vigilant','vilify','virulent','viscous','vituperate','volatile','voracious','waver','zealous']
};

hangman.buildAlphabetArray = function() {
    hangman.alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
};


hangman.buildAlphabetDisplay = function() {
    hangman.buildAlphabetArray();
    
    var letters = document.getElementById('letters');
    var fragment = document.createDocumentFragment();
    
    letters.innerHTML = '';
    
    for(var i = 0; i < hangman.alphabet.length; i++) {
        var div = hangman.buildSingleLetter(hangman.alphabet[i]);
        div.id = hangman.alphabet[i];
        fragment.appendChild(div);
    }
    
    letters.appendChild(fragment);
};

hangman.buildPlaceholders = function() {
    var word = document.getElementById('word');
    word.innerHTML = '';
    for(var i = 0; i < hangman.wordToGuess.length; i++){
        word.innerHTML += '_';
    }
};

hangman.buildSingleLetter = function(letter) {
    var div = document.createElement('div');
    div.style.cursor = 'pointer';
    div.classList = ['col-sm-1 btn-danger'];
    div.innerHTML = letter;
    div.onclick = hangman.evaluateGuess;
    return div;
};

hangman.checkForGuessedLetter = function(letter) {
    var placeholders = document.getElementById('word').innerHTML;
    
    // split the placeholders into an array
    placeholders = placeholders.split('');
    
    var letterArray = hangman.wordToGuess.split('');
    if (letterArray.indexOf(letter) === -1 && letterArray.indexOf(letter.toLowerCase()) === -1) {
        hangman.badGuesses++;
        hangman.draw();
    } else {        
        for (var i = 0; i < placeholders.length; i++) {
            if (hangman.wordToGuess.charAt(i).toLowerCase() == letter.toLowerCase()) {
                placeholders[i] = hangman.wordToGuess.charAt(i);
                hangman.correctGuesses++;
            }
        }
        
        if (hangman.correctGuesses === hangman.wordToGuess.length) {
            hangman.draw();
        }
    }
    
    word.innerHTML = placeholders.join('');
};

hangman.closeHelp = function() {
    document.getElementById('helpText').style.display = 'none';
    document.body.removeChild(document.getElementById('mask'));
};

hangman.draw = function () {
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

hangman.drawLine = function(context, from, to) {
    context.beginPath();
    context.moveTo(from[0], from[1]);
    context.lineTo(to[0], to[1]);
    context.stroke();
};

hangman.evaluateGuess = function() {
    var letter = document.getElementById(this.id);
    hangman.checkForGuessedLetter(letter.innerHTML);
    letter.innerHTML = '&nbsp;';
    letter.style.cursor = 'default';
    letter.onclick = null;
};

hangman.getNewWord = function() {
    var index = parseInt(Math.floor(Math.random() * hangman.wordArray.length));
    hangman.wordToGuess = hangman.wordArray[index];
    hangman.buildPlaceholders();
};

hangman.init = function() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('helpText').style.display = 'none';
    document.getElementById('play').style.display = 'inline-block';
    document.getElementById('clear').style.display = 'inline-block';
    document.getElementById('help').onclick = hangman.showHelp;
    document.getElementById('close').onclick = hangman.closeHelp;
    document.getElementById('play').onclick = hangman.newGame;
};

hangman.newGame = function() {
    hangman.badGuesses = 0;
    hangman.correctGuesses = 0;
    hangman.getNewWord();    
    hangman.buildAlphabetDisplay();
    var canvas = document.getElementById('canvas');
    canvas.width = canvas.width;
};

hangman.showHelp = function() {
    var mask = document.createElement('div');
    mask.id = 'mask';    

    document.body.appendChild(mask);
    
    document.getElementById('helpText').style.display = 'block';
};

// When the game is over, display missing letters in red
hangman.showResult = function() {
    var word = document.getElementById('word');
    var placeholders = word.innerHTML;
    placeholders = placeholders.split('');
    for (i = 0; i < placeholders.length; i++) {
        if (placeholders[i] == '_') {
            placeholders[i] = '<span style="color:red">' + hangman.wordToGuess.charAt(i).toUpperCase() + '</span>';
        }
    }
    word.innerHTML = placeholders.join('');
};