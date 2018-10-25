const SEARCH_THRESHHOLD = 1000;
const API_URI = '';
const DOMAIN_ENDPOINT = API_URI + '/domain/';
const RESULT_DIV = 'div#results';
const SEARCH_INPUT = 'input#search-input';

let searchInputTime = Date.now();
let shouldSearch = false;

const searchDomain = async (domain) => {
  const response = await fetch('http://localhost:3000' + DOMAIN_ENDPOINT + domain);

  return response.json();
};

const processQuery = async (domain) => {
  const resp = await searchDomain(domain);

  console.log(resp);
  const resultElement = document.querySelector(RESULT_DIV);
  const searchElement = document.querySelector(SEARCH_INPUT);

  for (let [tld, data] of Object.entries(resp)) {
    if (Object.keys(data).indexOf('available') !== -1 && data['available'] === true) {
      let child = document.createElement('div');

      child.innerHTML = `${searchElement.value}.${tld}`;

      resultElement.appendChild(child);
      // resultElement.appendChild(document.createElement('break'));
    }
  }
  return true;
};

onload = _ => {
  document.querySelector('input#search-input').oninput = function processSearchBar(event) {
    console.log('oninput called');
    let eventTime = Date.now();
    // let delta = eventTime - searchInputTime;

    // console.log(delta);
    // console.log(event.srcElement.value);

    searchInputTime = eventTime;
    shouldSearch = true;
  };

  document.querySelector('input#search-input').addEventListener('keydown', (event) => {
    console.log('keydown called');
    if (event.keyCode === 13 || event.keyCode === 10) {
      event.preventDefault();
      processQuery(event.srcElement.value).then((res) => console.log(res));
      shouldSearch = false;
    }
  });

  setInterval(async () => {
    const searchBarElement = document.querySelector('input#search-input');
    let currentTime = Date.now();

    if (shouldSearch && (currentTime - searchInputTime >= SEARCH_THRESHHOLD) && searchBarElement.value !== '') {
      console.log('SEARCH NOW!!');
      shouldSearch = false;
      try {
        console.log(await processQuery(searchBarElement.value));
      } catch (e) {
        console.error(`Failed to get data\n${e}`);
      }
    }
  }, 250);
};