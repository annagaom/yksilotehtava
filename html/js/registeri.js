
'use strict';

function getSelectedLanguage() {
    const kieli = document.getElementById('kieli');
    return kieli && kieli.value ? kieli.value : 'FI';
}

document.addEventListener('DOMContentLoaded', function() {
    const selectedLanguage = getSelectedLanguage();


    const registerButton = document.getElementById('registerButton');

        registerButton.addEventListener('click', async (event) => {
            event.preventDefault();
            const registeriForm = document.getElementById('registrationForm');
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

                    if (response.ok) {
                        const data = await response.json();
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
                    } else {
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

});


      // event.preventDefault();
      // const firstname = document.getElementById('firstname').value || '' ;
      // const lastname = document.getElementById('lastname').value || '' ;
      // const photo = document.getElementById('photo').files[0] || null ;
      // const username = document.getElementById('username').value || '' ;
      // const password = document.getElementById('password').value || '' ;
      // const email = document.getElementById('email').value|| '' ;

    //   const data = {
    //     firstname: firstname,
    //     lastname: lastname,
    //     photo: photo,
    //     username: username,
    //     password: password,
    //     email: email
    //   };

    // console.log("Data: ", data);

    //file upload in form data
    // const formData = new FormData();
    //   formData.append('firstname', firstname);
    //   formData.append('lastname', lastname);
    //   if (photo) {
    //     formData.append('photo', photo);
    //   }
    //   formData.append('username', username);
    //   formData.append('password', password);
    //   formData.append('email', email);

    //   console.log("Form data: ", formData);


//       fetch('http://localhost:3000/api/v1/users', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),

//       })
//       .then(response => {
//         if (response.ok) {
//           return response.json();
//         } else {
//           throw new Error('Registration failed');
//         }
//       })
//       .then(data => {
//         const token = data.token;  // Hakee JWT-tokenin palvelimen vastauksesta


//           if (token) {
//             localStorage.setItem('authToken', token);

//             let targetPage = '';  // Määrittää sivun, jonne siirrytään rekisteröinnin jälkeen
//             switch (selectedLanguage) {
//                 case 'EN':
//                     alert('Registration successful. Welcome!');
//                     targetPage = '../en/login_en.html';
//                     break;
//                 case 'FI':
//                 default:
//                     alert('Rekisteröinti onnistui. Pääset kirjautumaan sisään!');
//                     targetPage = '../fi/login.html';
//                     break;
//               }
//                 window.location.href = targetPage;  // Uudelleenohjaus rekisteröinnin jälkeen
//             } else {
//                 throw new Error('Registration token missing.');  // Heittää virheen, jos token puuttuu
//           }
//         })
//           .catch(error => {
//             console.error('Virhe rekisteröinnissä: ', error);
//             // Käsittelee virheen kielen perusteella
//             switch (selectedLanguage) {
//               case 'EN':
//                   alert('An error occurred during registration. Please try again later.');
//                   break;
//               case 'FI':
//               default:
//                   alert('Virhe rekisteröinnissä. Yritä myöhemmin uudelleen.');
//                   break;
//                   }
//               });
//         }
//       });
//     }
//   }
// );



