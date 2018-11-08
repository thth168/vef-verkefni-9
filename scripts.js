// const API_URL = '/example.json?domain=';
const API_URL = 'https://apis.is/isnic?domain=';

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
    let domains;
    let container;
    let loadingGIF;

    function convertDate(date) {
        var n = new Date(date);
        return n.toISOString().split('T')[0];
    }

    function clearResults() {
        while(container.firstChild){
            container.removeChild(container.firstChild);
        }
        container.classList.toggle('loading', false);
    }
    
    function createDataElement(name, value) {
        if(value === '') return;
        const dl = document.createElement('dl');

        const domainElement = document.createElement('dt');
        domainElement.appendChild(document.createTextNode(name));
        dl.appendChild(domainElement);

        const domainElementValue = document.createElement('dd');
        domainElementValue.appendChild(document.createTextNode(value));
        dl.appendChild(domainElementValue);

        container.appendChild(dl);
    }
    
    function displayData(domainData) {
        clearResults();
        if(domainData.length === 0) {
            displayError('Lén er ekki skráð');
            return;
        }
        const [{domain, registered, lastChange, expires, registrantname, email, address, country}] = domainData;
        createDataElement('Lén', domain);
        createDataElement('Skráð', convertDate(registered));
        createDataElement('Seinast breytt', convertDate(lastChange));
        createDataElement('Rennur út', convertDate(expires));
        createDataElement('Skráningaraðili', registrantname);
        createDataElement('Netfang', email);
        createDataElement('Heimilisfang', address);
        createDataElement('Land', country);
    }

    function displayError(error){
        const container = domains.querySelector('.results');

        while(container.firstChild){
            container.removeChild(container.firstChild);
        }

        container.appendChild(document.createTextNode(error));
    }

    function fetchUrl(_url) {
        fetch(`${API_URL}${_url}`)
            .then((response) => {
                if(response.ok){
                    return response.json();
                }
                throw new Error('Villa kom upp');
            })
            .then((data) =>{
                displayData(data.results);
            })
            .catch((error) =>{ /*eslint-disable-line*/
                displayError('Villa við að hlaða síðu!!');
            });
    }

    function onsubmit(e) {
        e.preventDefault();

        const input = e.target.querySelector('input');
        if(/\S/.test(input.value) === false){
            displayError('Lén verður að vera strengur!');
            return;
        }
        clearResults();
        container.classList.toggle('loading', true);
        container.appendChild(loadingGIF);
        container.appendChild(document.createTextNode('Leita að léni...'));
        fetchUrl(input.value);
    }

    function init(_domains) {
        domains = _domains;
        const form = domains.querySelector('form');
        form.addEventListener('submit', onsubmit);
        container = domains.querySelector('.results');
        loadingGIF = document.createElement('img');
        loadingGIF.src = './loading.gif';
    }

    return {
        init,
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    const domains = document.querySelector('.domains');

    program.init(domains);
});