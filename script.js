'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-05-17T17:01:17.194Z',
    '2021-05-18T23:36:17.929Z',
    '2021-05-20T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
// Generate usernames
const username = function (accounts) {
  accounts.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
username(accounts);

// starting logout timer
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(parseInt(time / 60)).padStart(2, 0);
    const sec = String(parseInt(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    time--;
  };

  let time = 10 * 60;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// Format Movement Dates
const movDates = function (date, locale) {
  //   console.log(date);
  const calcDaysPassed = (date1, date2) =>
    Math.round((date1 - date2) / (60 * 60 * 24 * 1000));
  const now = new Date();
  const daysPassed = calcDaysPassed(now, date);

  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `Yesterday`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

// movements currency display
const formatCur = (mov, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(mov);
};

// Display Movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((mov, i) => {
    // formatting movement date
    const date = new Date(acc.movementsDates[i]);
    const displayMovdate = movDates(date, acc.locale);
    // type of transaction
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    // movements html
    const movementsHTML = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayMovdate}</div>
    <div class="movements__value">${formatCur(
      mov,
      acc.locale,
      acc.currency
    )}</div>
    </div>`;
    // appending movements to movements container
    containerMovements.insertAdjacentHTML('afterbegin', movementsHTML);
  });
};

// Calculate and display account balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((a, b) => a + b);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

// calculate and display account summary
const calcDisplaySummary = function (acc) {
  // incomes
  const income = acc.movements.filter(mov => mov > 0).reduce((a, b) => a + b);
  labelSumIn.textContent = formatCur(income, acc.locale, acc.currency);
  //outcomes
  const outcome = acc.movements.filter(mov => mov < 0).reduce((a, b) => a + b);
  labelSumOut.textContent = formatCur(outcome, acc.locale, acc.currency);
  // interest
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * 1.2) / 100)
    .reduce((a, b) => a + b);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

// UpdateUI
const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

// Event Handlers
// GLobal variables
let currentAccount, timer;

// Fake login
// currentAccount = account1;
// updateUI(account1);
// containerApp.style.opacity = 100;
// Login date function

// Login Event
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    const date = new Date();
    const loginDate = new Intl.DateTimeFormat(currentAccount.locale, {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);

    labelDate.textContent = loginDate;
    // initiating logout timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    // updateUI
    updateUI(currentAccount);
  }

  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
});

// Transfer Event
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = +inputTransferAmount.value;
  if (recieverAcc.username !== currentAccount.username && amount > 0) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    // initiating logout timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    //Update UI
    updateUI(currentAccount);
  }

  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
});

// Loan Event
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  if (amount > 0) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    // initiating logout timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// Close Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    accounts.splice(
      accounts.findIndex(acc => (acc.username = currentAccount.username)),
      1
    );
    labelWelcome.textContent = 'Log in to get started';
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});

// Sorting Movements
let sorted = false;
btnSort.addEventListener('click', function () {
  displayMovements(currentAccount, !sorted);

  sorted = !sorted;
});
