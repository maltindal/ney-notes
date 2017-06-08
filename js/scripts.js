const createInputChangeListener = (input, neys) => e => {
  const notes = input.value;
  const notesArray = notes.split(',').join('').split(' ');
  while (neys.firstChild) {
    neys.removeChild(neys.firstChild);
  }
  for (let i = 0; i < notesArray.length; i++) {
    const note = notesArray[i];
    if (note.trim() === '') {
      continue;
    }
    neys.appendChild(createPattern(note));
  }
  updateHash();
};

const createPattern = note => {
  const ney = document.createElement('div');
  ney.className = 'ney-pattern n ' + noteToClassName(note);
  ney.appendChild(createDiv('neva'));
  ney.appendChild(createDiv('nim-hicaz'));
  ney.appendChild(createDiv('cargah'));
  ney.appendChild(createDiv('segah'));
  ney.appendChild(createDiv('kuerdi'));
  ney.appendChild(createDiv('duegah'));
  return ney;
};

const createDiv = className => {
  const perde = document.createElement('div');
  perde.className = className;
  return perde;
};

const noteToClassName = note => note.replace('#', 'sharp');

window.onload = () => {
  const newPhraseButton = document.getElementById('new-phrase');
  const showNotesButton = document.getElementById('notes');
  const modalCurtain = document.getElementById('modal-curtain');
  newPhraseButton.addEventListener('click', onNewPhraseButtonClicked);
  showNotesButton.addEventListener('click', onShowNotesButtonClicked);
  modalCurtain.addEventListener('click', onModalCurtainClicked);

  new Clipboard('#copy-link', {
    text: trigger => createURI()
  });

  loadFromHash();

  //document.getElementById('notes').value = 'C, hD, hE, D, D,   C, D, C, B, C, C, D, C, B, A';
  // document.getElementById('notes').value = 'B, A, C, hD, hE, hE, hD, hD';
};

const onModalCurtainClicked = () => {
  const overlays = document.getElementsByClassName('overlay');
  for (var i = 0; i < overlays.length; i++) {
    overlays[i].parentNode.removeChild(overlays[i]);
  };
  const modalCurtain = document.getElementById('modal-curtain');
  modalCurtain.className = 'hidden';
}

const loadFromHash = () => {
  const data = atob(window.location.hash.substr(1));
  try {
    const jsonData = JSON.parse(decodeURIComponent(data));
    if (Array.isArray(jsonData.phrases)) {
      jsonData.phrases.forEach(appendPhrase);
    }
  } catch (ignored) {}
}

const appendPhrase = phrase => {
  const phrases = document.getElementById('phrases');
  phrases.appendChild(createPhrase(phrase));
};

const onNewPhraseButtonClicked = () => {
  appendPhrase();
  updateHash();
};

const createInput = className => {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = className;
  return input;
};

const createPhrase = notes => {
  const phrase = createDiv('phrase');

  const input = createInput('notes');
  const removeButton = createRemovePhraseButton(phrase);

  const neys = createDiv('neys');
  const inputChangeListener = createInputChangeListener(input, neys);

  neys.className = neys.className + ' hl';
  input.addEventListener('keyup', inputChangeListener);
  phrase.appendChild(input);
  phrase.appendChild(removeButton);
  phrase.appendChild(neys);

  if (notes !== undefined) {
    input.value = notes;
    inputChangeListener();
  }

  setTimeout(() => input.focus(), 100);
  return phrase;
};

const createRemovePhraseButton = phrase => {
  const button = document.createElement('button');
  button.innerHTML = '<svg class="icon"><use xlink:href="svg/sprite.min.svg#minus"></use></svg>';
  button.addEventListener('click', () => {
    phrase.parentNode.removeChild(phrase);
    updateHash();
  });
  return button;
};

const getPhrases = () => {
  const phrases = document.getElementById('phrases');
  const phrasesValue = [];
  for (var i=0; i < phrases.children.length; i++) {
    const phrase = phrases.children[i];
    const input = phrase.querySelector('input');
    phrasesValue.push(input.value);
  }
  return phrasesValue;
}

const createBase64Snapshot = phrasesValue => {
  if (phrasesValue === undefined) {
    return btoa(encodeURIComponent(JSON.stringify({ phrases: getPhrases() })));
  } else {
    return btoa(encodeURIComponent(JSON.stringify({ phrases: phrasesValue })));
  }
};

const createURI = () => {
  const phrasesValue = getPhrases();
  const urlParts = window.location.href.split('/');
  const urlData = encodeURIComponent(JSON.stringify({ phrases: phrasesValue }));
  return 'https://maltindal.github.io/ney-notes/#' + createBase64Snapshot(phrasesValue);
};

const updateHash = () => {
  window.location.hash = createBase64Snapshot();
}

const neyMapping = {
  'g/4':  [1,1,1,1,1,1,1],
  'a/4':  [1,1,1,1,1,1,0],
  'a#/4': [1,1,1,1,1,0,0],
  'b/4':  [1,1,1,1,0,1,0],
  'c/5':  [1,1,1,0,0,1,0],
  'c#/5': [1,1,0,0,0,1,0],
  'd/5':  [1,0,1,0,0,1,0],
  'eb/5': [1,1,1,1,1,1,0.75],
  'e/5':  [1,1,1,1,1,1,0],
  'f/5':  [1,1,1,1,1,0,0],
  'f#/5': [1,1,1,1,0,1,0],
  'g/5':  [1,1,1,0,0,1,0],
  'ab/5': [1,1,0,0,0,1,0],
  'a/5':  [1,0,1,0,0,1,0],
  'b/5':  [1,1,1,1,0,1,0],
  'c/6':  [1,1,1,0,0,1,0],
  'c#/6': [1,1,0,0,0,1,0],
  'd/6':  [1,0,1,0,0,1,0],
}

const perdeLabelMapping = {
  'g/4':  'sol',
  'a/4':  'la',
  'a#/4': 'la #',
  'b/4':  'si',
  'c/5':  'do',
  'c#/5': 'do #',
  'd/5':  're',
  'eb/5': 'mi b',
  'e/5':  'mi',
  'f/5':  'fa',
  'f#/5': 'fa #',
  'g/5':  'sol',
  'ab/5': 'la b',
  'a/5':  'la',
  'b/5':  'si',
  'c/6':  'do',
  'c#/6': 'do #',
  'd/6':  're',
}

const trPerdeLabelMapping = {
  'g/4':  'rast',
  'a/4':  'dügâh',
  'a#/4': 'kürdî',
  'b/4':  'segâh',
  'c/5':  'çargâh',
  'c#/5': 'nim hicaz',
  'd/5':  'neva',
  'eb/5': 'nim hisar',
  'e/5':  'hüseynî',
  'f/5':  'acem',
  'f#/5': 'eviç',
  'g/5':  'gerdaniye',
  'ab/5': 'şehnaz',
  'a/5':  'muhayyer',
  'b/5':  'tiz segah',
  'c/6':  'tiz çargâh',
  'c#/6': 'tiz nim hicaz',
  'd/6':  'tiz neva',
}

const onShowNotesButtonClicked = () => {
  const overlaysDiv = document.getElementById('overlays');
  const modalCurtain = document.getElementById('modal-curtain');
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = '<div id="scale" class="scale"></div><div class="scale" style="height: 200px"><div class="neys hl" style="text-align:center"></div></div>';
  overlaysDiv.appendChild(overlay);

  modalCurtain.className = '';

  const scale = 'g/4,a/4,a#/4,b/4,c/5,c#/5,d/5,eb/5,e/5,f/5,f#/5,g/5,ab/5,a/5,b/5,c/6,c#/6,d/6'.split(',');
  renderNotes(scale);
  renderNeys(scale);
};

const renderNotes = v => {
  const VF = Vex.Flow;

  var vf = new Vex.Flow.Factory({ renderer: {selector: 'scale', width: 800, height: 150} });
  var stave = vf.Stave();

  var notes = v.map(n => ({ keys: [n], duration: '1' })).map(vf.StaveNote.bind(vf));

  var voice = vf.Voice()
    .setMode(Vex.Flow.Voice.Mode.SOFT)
    .addTickables(notes);

  Vex.Flow.Accidental.applyAccidentals([voice]);

  new Vex.Flow.Formatter()
    .joinVoices([voice])
    .formatToStave([voice], stave);

  vf.draw();
}

const renderNeys = v => {
  const neys = $('.overlay .neys');
  v.map(n => {
    const ney = document.createElement('div');
    const mapping = neyMapping[n];
    ney.className = 'ney-pattern n ';

    const perdeler = [
      createDiv('asiran'),
      createDiv('neva'),
      createDiv('nim-hicaz'),
      createDiv('cargah'),
      createDiv('segah'),
      createDiv('kuerdi'),
      createDiv('duegah'),
    ];

    perdeler.map((perde, i) => {
      if (mapping !== undefined && mapping[i] > 0) {
        perde.className += ' pressed';
        if (mapping !== undefined && mapping[i] < 1) {
          perde.className += ' half';
        }
      }
      ney.appendChild(perde);
    });
    ney.appendChild(createLabel(n));
    ney.appendChild(createLabel(perdeLabelMapping[n]));
    ney.appendChild(createLabel(trPerdeLabelMapping[n]));
    neys.append(ney);
  });
}

const createLabel = v => {
  const label = document.createElement('div');
  label.className = 'label';
  if (v !== undefined) {
    label.innerHTML = v;
  }
  return label;
}
