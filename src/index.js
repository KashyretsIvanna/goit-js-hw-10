import './css/styles.css';
import deba from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

Notify.init({
  timeout: 1000,
});

const links = {
  ULL: document.querySelector('.country-list'),
};

const DEBOUNCE_DELAY = 300;
document.querySelector('#search-box').addEventListener('input', e => {
  console.log(e.target.value);
  if (e.target.value.trim() === '') {
    console.log('null');
    links.ULL.innerHTML = null;
  } else {
    console.log('value');
    debaunced(e);
  }
});

function getItems(e) {
  fetchCountries(e.target.value)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(j => {
      let newArray = [];
      if (j.length >= 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      } else if (j.length === 1) {
        let languages = '';

        newArray = j.forEach(
          el =>
            (links.ULL.innerHTML = `<li><img class="search-img" src=${
              el.flags.svg
            }></img><p>${el.name.official}</p>
            <p>Capitel: ${el.capital}</p><p>Population: ${
              el.population
            }</p><p>Languages: ${Object.keys(el.languages)
              .map(k => `<span>${el.languages[k]}</span>`)
              .join(', ')}</p>`)
        );
      } else {
        newArray = j.map(
          el =>
            `<li><img class="search-img" src=${el.flags.svg}></img>${el.name.official}</li>`
        );
      }
      links.ULL.innerHTML = newArray.join('');
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      console.log(error);
    });
}

const debaunced = deba(getItems, (wait = DEBOUNCE_DELAY));
function fetchCountries(name) {
  return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages
  `);
}
