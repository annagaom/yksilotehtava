'use strict';

function getSelectedLanguage() {
    const kieli = document.getElementById('kieli');
    return kieli && kieli.value ? kieli.value : 'FI';
}

document.addEventListener('DOMContentLoaded', function() {
  const selectedLanguage = getSelectedLanguage();
  const registerButton = document.getElementById('registeriButton');

  if (registerButton) {
    registerButton.addEventListener('click', async (event) => {
      event.preventDefault();
      const registeriForm = document.getElementById('registeriForm');
      if (registeriForm && registeriForm.checkValidity()) {
        const formData = new FormData(registeriForm);

        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
          const response = await fetch('http://localhost:3000/api/v1/users', {
            method: 'POST',
            body: formData
          });

          console.log('Response status: ', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('Server response data: ', data);

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
            const errorText = await response.text();
            console.error('Registration failed: ', errorText);
            throw new Error('Registration failed');
          }
        } catch (error) {
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
        }
      } else {
        console.log('Form is invalid');
      }
    });
  }
});
