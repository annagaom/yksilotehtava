'use strict';

function getSelectedLanguage() {
    const kieli = document.getElementById('kieli');
    return kieli && kieli.value ? kieli.value : 'FI';
}

const registerButton = document.getElementById('registerButton');
if (registerButton) {
  registerButton.addEventListener('click', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value || '' ;
    const password = document.getElementById('password').value || '' ;
    const email = document.getElementById('email').value|| '' ;
    const firstname = document.getElementById('firstname').value || '' ;
    const lastname = document.getElementById('lastname').value || '' ;
    const address = document.getElementById('address').value || '' ;
    const postalcode = document.getElementById('postalcode').value || '' ;
    const city = document.getElementById('city').value || '' ;
    const phone = document.getElementById('phone').value || '' ;

    const data = {
      username: username,
      password: password,
      email: email,
      firstname: firstname,
      lastname: lastname,
      address: address,
      postalcode: postalcode,
      city: city,
      phone: phone
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
                  targetPage = '../../html/en/oma_en.html';
                  break;
              case 'FI':
              default:
                  alert('Rekisteröinti onnistui. Tervetuloa!');
                  targetPage = '../../html/fi/oma.html';
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



