'use strict';

function getSelectedLanguage() {
    const kieli = document.getElementById('kieli');
    return kieli && kieli.value ? kieli.value : 'FI';
}

document.addEventListener('DOMContentLoaded', function () {
    /**
     * Tapahtumankäsittelijä, joka suoritetaan, kun DOM on ladattu.
     */
    const loginButton = document.getElementById('loginButton');
    const selectedLanguage = getSelectedLanguage();

    if (loginButton) {
        loginButton.addEventListener('click', function (event) {
            event.preventDefault();

            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            console.log(username, password);

            const data = {
                username: username,
                password: password,
            };

            fetch('http://localhost:3000/api/v1/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                })
                .then(data => {
                    const token = data.token;

                    if (token) {
                        localStorage.setItem('authToken', token);

                        /**
                         * Ohjaa käyttäjä valitun kielen mukaiseen sivuun.
                         */
                        let targetPage = '';
                        switch (selectedLanguage) {
                            case 'EN':
                                targetPage = '../../html/en/oma_en.html';
                                break;
                            case 'FI':
                            default:
                                targetPage = '../../html/fi/oma.html';
                                break;
                        }

                        window.location.href = targetPage;
                        /**
                         * Näyttää virheilmoituksen, jos kirjautuminen ei onnistu.
                         */
                    } else {
                        switch (selectedLanguage) {
                            case 'EN':
                                alert('An error occurred during login. Please try again later.');
                                break;
                            case 'FI':
                            default:
                                alert('Virhe kirjautumisessa. Yritä myöhemmin uudelleen.');
                                break;
                        }
                    }
                })
                .catch(error => {
                    /**
                    * Näyttää virheilmoituksen, jos pyyntö epäonnistuu.
                    */
                    switch (selectedLanguage) {
                        case 'EN':
                            alert('Login failed. Please check your username and password.');
                            break;
                        case 'FI':
                        default:
                            alert('Kirjautuminen epäonnistui. Tarkista käyttäjätunnus ja salasana.');
                            break;
                    }
                });
        });
    }
});

