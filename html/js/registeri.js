'use strict';

function getSelectedLanguage() {
    const kieli = document.getElementById('kieli');
    return kieli && kieli.value ? kieli.value : 'FI';
}

const registerButton = document.getElementById('registerButton');
if (registerButton) {
  registerButton.addEventListener('click', function (event) {
    event.preventDefault();
    const firstname = document.getElementById('firstname').value || '' ;
    const lastname = document.getElementById('lastname').value || '' ;
    const photo = document.getElementById('photo').value || '' ;
    const username = document.getElementById('username').value || '' ;
    const password = document.getElementById('password').value || '' ;
    const email = document.getElementById('email').value|| '' ;

    const data = {
      firstname: firstname,
      lastname: lastname,
      photo: photo,
      username: username,
      password: password,
      email: email
    };

   console.log(data);

    fetch('http://localhost:3000/api/v1/users', {
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
        throw new Error('Registration failed');
      }
    })
    .then(data => {
      const token = data.token;  // Hakee JWT-tokenin palvelimen vastauksesta

        if (token) {
          localStorage.setItem('authToken', token);

          let targetPage = '';  // Määrittää sivun, jonne siirrytään rekisteröinnin jälkeen
          switch (selectedLanguage) {
              case 'EN':
                  alert('Registration successful. Welcome!');
                  targetPage = '../en/login_en.html';
                  break;
              case 'FI':
              default:
                  alert('Rekisteröinti onnistui. Pääset kirjautumaan sisään!');
                  targetPage = '../fi/login.html';
                  break;
            }
              window.location.href = targetPage;  // Uudelleenohjaus rekisteröinnin jälkeen
          } else {
              throw new Error('Registration token missing.');  // Heittää virheen, jos token puuttuu
        }
      })
        .catch(error => {
          console.error('Virhe rekisteröinnissä: ', error);
          // Käsittelee virheen kielen perusteella
          switch (selectedLanguage) {
            case 'EN':
                alert('An error occurred during registration. Please try again later.');
                break;
            case 'FI':
            default:
                alert('Virhe rekisteröinnissä. Yritä myöhemmin uudelleen.');
                break;
                }
            });
    });
}



