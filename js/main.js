// get the elements
const fromText = document.querySelector('.from-text');
const toText = document.querySelector('.to-text');
const selectTag = document.querySelectorAll('select');
const exchangeIcon = document.querySelector('.exchange');
// get the translate button
const translateBtn = document.querySelector('.translateBtn');
const icons = document.querySelectorAll('.row i');

// loop through each language options
selectTag.forEach((tag, id) => {
    for (const country_code in countries) {
        // console.log(countries[country_code]);
        // selecting English by default as FROM language and French as TO language
        let selected;
        if (id == 0 && country_code == "en-GB") {
            selected = 'selected';
        } else if (id == 1 && country_code == "fr-FR") {
            selected = 'selected';
        }
        let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;

        // Adding option tag inside select tag
        tag.insertAdjacentHTML('beforeend', option)
    }
});

// add event to the exchange btn
exchangeIcon.addEventListener('click', () => {
    // textarea text value swap
    let tempText = fromText.value;
    fromText.value = toText.value;
    toText.value = tempText;

    // language selection swap
    let tempLang = selectTag[0].value;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
})

// translate text button event
translateBtn.addEventListener('click', () => {
    let text = fromText.value;
    let translateFrom = selectTag[0].value;  // getting fromSelect tag value
    let translateTo = selectTag[1].value;  // getting toSelect tag value
    // console.log(text, translateFrom, translateTo);

    if(!text) return;
    toText.setAttribute("placeholder", "Translating...");
    translateBtn.innerText = "Translating...";

    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;

    // using the fetch api
    // fetching api response and returning it with parsing into js obj
    // and in another then method receiving that obj
    fetch(apiUrl).then(res => res.json().then(data => {
        console.log(data);
        toText.value = data.responseData.translatedText;
        toText.setAttribute("placeholder", "Translation");
        translateBtn.innerText = "Translate Text";
    }))
});

icons.forEach((icon)=> {
    icon.addEventListener('click', ({target}) => {
        // console.log(target)
        if(target.classList.contains('fa-copy')) {
            if(target.id == "from") {
                // console.log('From icon clicked')
                // use the window navigator object to copy to clipboard
                navigator.clipboard.writeText(fromText.value);
            } else {
                // console.log('To icon clicked')
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let utterance;
            // console.log('Speech icon clicked')
            // if clicked icon has from id, speak the fromTextarea value else speak the toTextarea value
            if (target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value; // setting utterance language to fromSelect tag value
                speechSynthesis.cancel();
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value; // setting utterance language to toSelect tag value
                speechSynthesis.cancel();
            }
            window.speechSynthesis.speak(utterance)
            
        }
    })
})