'use strict';

document.getElementById("kieli").addEventListener("change", function () {
    var selectedLanguage = this.value;
    if (selectedLanguage === 'FI') {
        window.location.href = '../fi/index.html';
    } else if (selectedLanguage === 'EN') {
        window.location.href = '../en/index_en.html';
    }
});

if (localStorage.getItem('authToken')) {
    window.location.href = 'oma.html';
}
