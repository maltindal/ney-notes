let neySvg = undefined;

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
    //neys.appendChild(createNey(note));
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

const createNey = note => {
  const ney = document.createElement('div');
  ney.className = 'ney n ' + noteToClassName(note);
  ney.innerHTML = neySvg;
  return ney;
};

const noteToClassName = note => note.replace('#', 'sharp');

window.onload = () => {
  fetch('/svg/ney.svg')
    .then(resp => resp.text())
    .then(svgText => {
      neySvg = svgText;
    });

  const newPhraseButton = document.getElementById('new-phrase');
  newPhraseButton.addEventListener('click', onNewPhraseButtonClicked);

  new Clipboard('#copy-link', {
    text: trigger => createURI()
  });

  loadFromHash();

  //document.getElementById('notes').value = 'C, hD, hE, D, D,   C, D, C, B, C, C, D, C, B, A';
  // document.getElementById('notes').value = 'B, A, C, hD, hE, hE, hD, hD';
};

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
  return urlParts[0] + '//' + urlParts[2] + '/#' + createBase64Snapshot(phrasesValue);
};

const updateHash = () => {
  window.location.hash = createBase64Snapshot();
}
