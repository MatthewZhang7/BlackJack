var initialDealerSum = 0;
var dealerSum = 0;
var yourSum = 0;

var dealerAceCount = 0;
var yourAcecount = 0;

var hidden;
var deck;

var canHit = true; //allows player to hit while yourSum <= 21
window.onload = function () {
  buildDeck();
  shuffleDeck();
  // placeBets();
  startGame();
};

function buildDeck() {
  let values = [
    'A',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
  ];
  let types = ['C', 'D', 'H', 'S'];
  deck = [];
  for (let i = 0; i < types.length; i++) {
    for (let j = 0; j < values.length; j++) {
      deck.push(values[j] + '-' + types[i]);
    }
  }
}

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length); //(0-1)*52 =>(0 - 51.9999)
    let temp = deck[i];
    deck[j] = temp;
  }
}

function startGame() {
  //Give dealer cards
  hidden = deck.pop();
  dealerSum += getValue(hidden);
  dealerAceCount += checkAce(hidden);
  dealerHit();
  //Give player cards
  for (let i = 0; i < 2; i++) {
    let cardImg = document.createElement('img');
    let card = deck.pop();
    cardImg.src = './cards/' + card + '.png';
    yourSum += getValue(card);
    yourAcecount += checkAce(card);
    document.getElementById('your-cards').append(cardImg);
  }
  //Blackjack Case
  if (yourSum == 21 && dealerSum != 21) {
    canHit = false;
    document.getElementById('dealer-sum').innerText = dealerSum;
    document.getElementById('your-sum').innerText = yourSum;
    document.getElementById('hidden').src = './cards/' + hidden + '.png';
    document.getElementById('results').innerText = 'Blackjack!';
    return;
  } else if (yourSum == 21 && dealerSum == 21) {
    canHit = false;
    document.getElementById('dealer-sum').innerText = dealerSum;
    document.getElementById('your-sum').innerText = yourSum;
    document.getElementById('hidden').src = './cards/' + hidden + '.png';
    document.getElementById('results').innerText = 'Push';
    return;
  }
  //Dealer
  else if (dealerAceCount > 0 && getValue(hidden) != 11) {
    document.getElementById('dealer-sum').innerText =
      initialDealerSum + '/' + (initialDealerSum - 10);
  } else {
    document.getElementById('dealer-sum').innerText = initialDealerSum;
  }
  //Player
  if (yourAcecount > 1) {
    yourSum = reduceAce(yourSum, yourAcecount);
    document.getElementById('your-sum').innerText =
      yourSum + '/' + (yourSum - 10);
  } else if (yourAcecount > 0) {
    document.getElementById('your-sum').innerText =
      yourSum + '/' + (yourSum - 10);
  } else {
    document.getElementById('your-sum').innerText = yourSum;
  }
  document.getElementById('hit').addEventListener('click', hit);
  document.getElementById('stand').addEventListener('click', stand);
}

function hit() {
  if (!canHit) {
    return;
  }
  let cardImg = document.createElement('img');
  let card = deck.pop();
  cardImg.src = './cards/' + card + '.png';
  yourSum += getValue(card);
  yourAcecount += checkAce(card);
  yourSum = reduceAce(yourSum, yourAcecount);
  document.getElementById('your-cards').append(cardImg);
  document.getElementById('your-sum').innerText = yourSum;

  if (reduceAce(yourSum, yourAcecount) > 21) {
    canHit = false;
  }
  let message = '';
  if (yourSum > 21) {
    message = 'Player Bust';
    document.getElementById('hidden').src = './cards/' + hidden + '.png';
    document.getElementById('dealer-sum').innerText = dealerSum;
  }
  document.getElementById('results').innerText = message;
}

function stand() {
  yourSum = reduceAce(yourSum, yourAcecount);
  canHit = false;
  document.getElementById('hidden').src = './cards/' + hidden + '.png';

  while (dealerSum < 17) {
    dealerHit();
    //add a pause between each card pull to build suspense
    //create a variable to adjust the speed of cards being pulled like in pickering casino
    //have to adjust since most casinos pull a card on soft 17
  }

  let message = '';

  if (yourSum > 21) {
    message = 'Player Bust';
  } else if (dealerSum > 21) {
    message = 'Player Win';
  } else if (dealerSum == yourSum) {
    message = 'Push';
  } else if (yourSum > dealerSum) {
    message = 'Player Win';
  } else if (yourSum < dealerSum) {
    message = 'Dealer Wins';
  }
  document.getElementById('dealer-sum').innerText = dealerSum;
  document.getElementById('your-sum').innerText = yourSum;
  document.getElementById('results').innerText = message;
}

function getValue(card) {
  let data = card.split('-'); //"4-C" -> ["4", "C"]
  let value = data[0];
  if (isNaN(value)) {
    if (value == 'A') {
      return 11;
    }
    return 10;
  }
  return parseInt(value);
}

function checkAce(card) {
  if (card[0] == 'A') {
    return 1;
  } else {
    return 0;
  }
}

function reduceAce(playerSum, playerAcecount) {
  while (playerSum > 21 && playerAcecount > 0) {
    playerSum -= 10;
    playerAcecount -= 1;
  }
  return playerSum;
}

function dealerHit() {
  let cardImg = document.createElement('img');
  let card = deck.pop();
  cardImg.src = './cards/' + card + '.png';
  initialDealerSum = getValue(card);
  dealerSum += getValue(card);
  dealerAceCount += checkAce(card);
  dealerSum = reduceAce(dealerSum, dealerAceCount);
  document.getElementById('dealer-cards').append(cardImg);
  if (dealerAceCount > 0) {
    document.getElementById('dealer-sum').innerText =
      dealerSum + '/' + (dealerSum - 10);
  } else {
    document.getElementById('dealer-sum').innerText = dealerSum;
  }
}
