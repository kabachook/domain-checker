const SEARCH_THRESHOLD = 1000;
const API_URI = '';
const DOMAIN_ENDPOINT = API_URI + '/domain/';
const ID_RESULTS_DIV = 'results';
const ID_SEARCH_INPUT = 'search-input';

let searchInputTime = Date.now();
let shouldSearch = false;

const searchDomain = async (domain) => {
  const response = await fetch(DOMAIN_ENDPOINT + domain);

  return response.json();
};

const processQuery = async (domain) => {
  const resp = await searchDomain(domain);

  const resultElement = document.getElementById(ID_RESULTS_DIV);
  const searchElement = document.getElementById(ID_SEARCH_INPUT);

  for (let [tld, data] of Object.entries(resp)) {
    if (data.available === true) {
      let child = document.createElement('div');

      child.innerHTML = `${searchElement.value}.${tld}`;

      resultElement.appendChild(child);
    }
  }
  return true;
};

onload = () => {
  document.getElementById(ID_SEARCH_INPUT).addEventListener('input', (event) => {
    let eventTime = Date.now();

    searchInputTime = eventTime;
    shouldSearch = true;
  });

  setInterval(async () => {
    const searchBarElement = document.getElementById(ID_SEARCH_INPUT);
    let currentTime = Date.now();

    if (shouldSearch && (currentTime - searchInputTime >= SEARCH_THRESHOLD) && searchBarElement.value !== '') {
      shouldSearch = false;
      try {
        await processQuery(searchBarElement.value);
      } catch (e) {
        console.error(`Failed to get data\n${e}`);
      }
    }
  }, 250);
};