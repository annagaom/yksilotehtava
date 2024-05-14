'use strict';

function getSelectedLanguage() {
    const kieli = document.getElementById('kieli');
    return kieli && kieli.value ? kieli.value : 'FI';
}

let loginTeksti = '';
let logoutTeksti = '';

switch (getSelectedLanguage()) {
    case 'EN':
        loginTeksti = 'Log in';
        logoutTeksti = 'Log out';
        break;
    case 'FI':
    default:
        loginTeksti = 'Kirjaudu sisään';
        logoutTeksti = 'Kirjaudu ulos';
};

function updateLoginButton(isLoggedIn) {
  const loginButton = document.getElementById('loginButton');
  if (isLoggedIn) {
      loginButton.textContent = logoutTeksti;
      loginButton.id = 'logoutButton';
  } else {
      loginButton.textContent = loginTeksti;
      loginButton.id = 'loginButton';
  }
}

function checkLoginStatus() {
  const token = localStorage.getItem('authToken');
  if (token) {
      updateLoginButton(true);
  } else {
      updateLoginButton(false);
  }

  return token;
}

const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
  logoutButton.addEventListener('click', function (event) {
      event.preventDefault();
      localStorage.removeItem('authToken');
      updateLoginButton(false);
  });
}

document.addEventListener('DOMContentLoaded', function () {

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
          password: password
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
        } else {
            throw new Error('Login failed');
        }
      })
      .then(data => {
        const token = data.token;

        if (token) {
            localStorage.setItem('authToken', token);

            let targetPage = '';
            switch (selectedLanguage) {
              case 'EN':
                targetPage = '../en/user_en.html';
                break;
              case 'FI':
              default:
                targetPage = '../fi/user.html';
                break;
            }

          window.location.href = targetPage;

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
            console.error('Virhe kirjautumisessa:', error.message);
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




