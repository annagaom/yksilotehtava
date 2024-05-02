document.addEventListener('DOMContentLoaded', function () {
  const loginButton = document.getElementById('loginButton');

  if (loginButton) {
    loginButton.addEventListener('click', async function (event) {
      event.preventDefault();

      const username = document.getElementById('kayttaja_tunnus').value;
      const password = document.getElementById('salasana').value;
      console.log(username);

      try {
        const response = await fetch(`https://10.120.32.94/auth-api/api/v1/users`);

        if (response.ok) {
          const users = await response.json();
          const findUser = users.find(user => user.username === username);
          console.log(findUser);

          if (findUser) {
            if (findUser.password === password) {
              const token = findUser.token; // Retrieve token from findUser
              localStorage.setItem('token', token); // Store token in localStorage
              console.log(token); // Log the token to console

              // Redirect to 'oma.html' only after successfully setting the token
              window.location.href = '../../html/fi/oma.html';
            } else {
              alert('Invalid username or password');
            }
          } else {
            alert('Invalid username or password');
          }
        } else {
          throw new Error('User hakuminen epäonnistui');
        }
      } catch (error) {
        alert(error.message);
      }
    });
  }
});


