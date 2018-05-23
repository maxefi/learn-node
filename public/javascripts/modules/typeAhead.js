import axios from 'axios';
import dompurify from 'dompurify';

function searchResultsHTML(stores) {
    return stores.map(store => {
        return `
            <a href='/store/${store.slug}' class='search__result'>
                <strong>${store.name}</strong>
            </a>
        `;
    }).join('');
};

function typeAhead(search) {
    if (!search) return;

    const searchInput = search.querySelector('input[name="search"]');
    const searchResults = search.querySelector('.search__results');

    searchInput.on('input', function() {
        if (!this.value) {
            searchResults.style.display = 'none';
            return;
        }

        searchResults.style.display = 'block';

        axios.get(`/api/v1/search?q=${this.value}`)
             .then(res => {
                 console.log('res.data: ', res.data);
                 if (res.data.length) {
                     searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data));
                     return;
                 }
                 searchResults.innerHTML = dompurify.sanitize(
                     `<div class='search__result'>No results for ${this.value} found!</div> `,
                 );
             })
             .catch(err => {
                 console.error('err: ', err);
             });
    });

    searchInput.on('keyup', (e) => {
        if (![38, 40, 13].includes(e.keyCode)) {
            return;
        }

        const activeClass = 'search__result--active';
        const current = search.querySelector(`.${activeClass}`);
        const items = search.querySelectorAll('.search__result');
        let next;

        if (e.keyCode === 40) {
            if (current) {
                next = current.nextElementSibling || items[0];
            } else {
                next = items[0];
            }
        }

        if (e.keyCode === 38) {
            const last = items[items.length - 1];
            if (current) {
                next = current.previousElementSibling || last;
            } else {
                next = last;
            }
        }

        if (e.keyCode === 13 && current.href) {
            window.location = current.href;
            return;
        }

        if (current) {
            current.classList.remove(activeClass);
        }

        next.classList.add(activeClass);
    });
}

export default typeAhead;
