(() => {
  const KEY = 'kc-no-delay';
  localStorage.removeItem(KEY);

  const base = {
    A: 'Waterfall',
    2: 'You',
    3: 'Me',
    4: 'Floor',
    5: 'Guys',
    6: 'Chicks',
    7: 'Heaven',
    8: 'Mate',
    9: 'Rhyme',
    10: 'Categories',
    J: 'Rule',
    Q: 'Questions',
    K: 'KING!'
  };
  const suits = ['♠','♦','♥','♣'];
  const candidates = ['4♠','4♦','4♥','4♣','5♠','5♦','5♥','5♣'];

  const shuffle = a => {
    let t, l = a.length, j;
    while (l) {
      j = Math.floor(Math.random() * l);
      t = a[--l];
      a[l] = a[j];
      a[j] = t;
    }
    return a;
  };

  const buildDeck = custom =>
    [].concat(...['A','2','3','4','5','6','7','8','9','10','J','Q','K'].map(r =>
      suits.map(s => ({ id: r+s, rule: custom[r+s] || base[r] }))
    ));

  let state = { deck: shuffle(buildDeck({})), kings: [], history: [], custom: {} };

  const $ = id => document.getElementById(id);
  const $card = $('card'),
        $rule = $('rule'),
        $btnDraw = $('btnDraw'),
        $btnSuggest = $('btnSuggest'),
        $btnReset = $('btnReset'),
        $historyList = $('historyList'),
        $customBody = $('customBody'),
        $kings = [...document.querySelectorAll('#kingsArea .cup-seg')],
        $modal = $('assignModal'),
        $assignGrid = $('assignGrid'),
        $punInput = $('punInput'),
        $punOk = $('punOk'),
        $punCancel = $('punCancel');

  let selected = null;

  function renderButtons() {
    $btnDraw.textContent = state.deck.length ? `Draw (${state.deck.length})` : 'Reshuffle';
  }

  function renderKings() {
    $kings.forEach((seg, i) => seg.classList.toggle('filled', !!state.kings[i]));
  }

  function renderHistory() {
    $historyList.innerHTML = '';
    state.history.forEach(e => {
      const li = document.createElement('li');
      li.textContent = `${e.id}: ${e.rule}`;
      $historyList.appendChild(li);
    });
  }

  function renderCustom() {
    $customBody.innerHTML = '';
    Object.entries(state.custom).forEach(([k, v]) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${k}</td><td>${v}</td>`;
      $customBody.appendChild(tr);
    });
  }

  function fullRender() {
    renderButtons();
    renderKings();
    renderHistory();
    renderCustom();
  }

  $btnDraw.onclick = () => {
    if (!state.deck.length) {
      state.deck = shuffle(buildDeck(state.custom));
      state.kings = [];
      state.history = [];
      alert('New round!');
    }
    const card = state.deck.pop();
    $card.textContent = card.id;
    $rule.textContent = card.rule;
    state.history.push(card);
    if (card.id[0] === 'K') {
      state.kings.push(card.id[1]);
      if (state.kings.length === 4) alert('Fourth King! Drink the cup!');
    }
    fullRender();
  };

  $btnSuggest.onclick = () => {
    selected = null;
    $punInput.value = '';
    $assignGrid.innerHTML = '';
    candidates.forEach(id => {
      const span = document.createElement('span');
      span.textContent = id;
      if (state.custom[id]) {
        span.classList.add('selected');
        span.textContent += ' ✓';
        span.style.cursor = 'not-allowed';
      } else {
        span.onclick = () => {
          selected = id;
          Array.from($assignGrid.children).forEach(ch => ch.classList.remove('selected'));
          span.classList.add('selected');
        };
      }
      $assignGrid.appendChild(span);
    });
    $modal.classList.add('show');
    $punInput.focus();
  };

  $punCancel.onclick = () => $modal.classList.remove('show');

  $punOk.onclick = () => {
    if (!selected) return alert('Click a card first');
    const t = $punInput.value.trim();
    if (!t) return alert('Type a punishment');
    state.custom[selected] = t;
    $modal.classList.remove('show');
    fullRender();
  };

  $btnReset.onclick = () => {
    if (confirm('Reset game?')) {
      state = { deck: shuffle(buildDeck({})), kings: [], history: [], custom: {} };
      fullRender();
    }
  };

  fullRender();
})();
