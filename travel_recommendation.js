const action = {
    'templ': {
        'f': showTemple,
        'k': 'temples',
    },

    'count': {
        'f': showCountry,
        'k': 'countries',
    },

    'beac': {
        'f': showBeaches,
        'k': 'beaches',
    },
};

window.addEventListener('load', function() {
    console.log('All assets are loaded');

    document.getElementById('searchButton').addEventListener('click', Search);
    document.getElementById('searchReset').addEventListener('click', Reset);

    function Search(e) {
        e.preventDefault();
        console.log(e);
        const text = String(document.getElementById('searchField').value).toLowerCase();
        console.log('text', text);

        ResetData();

        let found = false;
        for (let prefix in action) {
            if (text.startsWith(prefix)) {
                found = true;
                break;
            }
        }

        if (!found) {
            NotFound();
            return;
        }

        // http://localhost:8080
        fetch('./travel_recommendation_api.json').then(response => {
            if (!response.ok) {
                console.log('+ response.status');
                throw new Error('HTTP error ' + response.status);
            }
            return response.json();
        }).then(json => {
            // this.users = json;
            console.log('json', json);

            for (let prefix in action) {
                if (text.startsWith(prefix)) {
                    let f = action[prefix].f;
                    f(json[action[prefix].k]);
                    return;
                }
            }

        }).catch(function() {
            console.log('fetch error');
            NotFound();
        });
    }

    function Reset(e) {
        e.preventDefault();
        ResetData();
    }
});

function NotFound() {
    // temples and countries, "beach," or "beaches," "Beach" or "BEACH,"
    document.getElementById('searchResult').innerHTML = `
<div class="row">
    <div class="col-12">
        <p>
            Not found.
        </p>
        <p>
            Please search "temples", "countries", or "beaches".
        </p>
    </div>
</div>
`;
}

function ResetData() {
    document.getElementById('searchField').value = '';
    document.getElementById('searchResult').innerHTML = '';
}

function showCountry(countries) {
    console.log('country');
    console.log(countries);
    const searchResult = document.getElementById('searchResult');
    countries.forEach(country => {
        console.log(country);
        country.cities.forEach(city => {
            console.log("city");
            console.log(city);
            let d = makeSearchOnePoint(country.id, `countries-${city.name}`, city);
            searchResult.appendChild(d);
        });
    });
}

function showTemple(temples) {
    console.log('temple');
    const searchResult = document.getElementById('searchResult');

    temples.forEach(temple => {
        console.log(temple);

        let d = makeSearchOnePoint(temple.id, 'temples', temple);
        searchResult.appendChild(d);
    });
}

function showBeaches(beaches) {
    console.log('beaches');
    beaches.forEach(beach => {
        console.log(beach);

        let d = makeSearchOnePoint(beach.id, 'beaches', beach);
        searchResult.appendChild(d);
    });
}

function makeSearchOnePoint(id, typ, data) {
    console.log(data);

    let out = document.createElement('div');
    out.className = 'row';
    out.innerHTML = `
<div class="row">
    <div class="col-12">
        <div class="p-3 mb-2 bg-secondary text-white">
            <p>
                ${data.name}
            </p>
            <p> 
                <img class="xs-3 mb-2"  width="300" src="${data.imageUrl}"  alt="${data.name}"/>
            </p>
            <p>
                ${data.description}
            </p>
             <button type="button" class="btn btn-lg btn-success" onclick="bookNow('${id}', '${typ}')">Visit</button>
        </div>
    </div>
</div>
`;

    return out;
}

function bookNow(id, typ) {
    alert(`You want to book ${typ} => #${id} `);
}