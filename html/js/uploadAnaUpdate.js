
// document.addEventListener('DOMContentLoaded', function () {
//   const loginButton = document.getElementById('loginButton');


// const getUserId
//       const username = document.getElementById('kayttaja_tunnus').value;
//       const password = document.getElementById('salasana').value;
//       console.log(username);

//       try {
//         const response = await fetch(`https://10.120.32.94/auth-api/api/v1/users`);

//         if (response.ok) {
//           const users = await response.json();
//           const findUser = users.find(user => user.username === username);
//           console.log(findUser);



  const uploadAvatar = async (input) => {
    const file = input.files[0]
    const formData = new FormData()
    formData.append('photo', file)

    const formData = new FormData()

    const response = await fetch('http://10.120.32.94/auth-api/api/v1/users/avatar', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Virhe kuvan lähetyksessä.')
    }

    console.log('Kuva lähetetty ja tallennettu onnistuneesti!')
  }
