

window.addEventListener('DOMContentLoaded', function() {
  fetch('http://localhost:3000/api/vi/users/photo')
  .then(response => {
      if (!response.ok) {
          throw new Error('Virhe kuvan hakemisessa.');
      }
      return response.blob(); // Muuta vastaus blob-muotoon
  })
  .then(blob => {
      var img = document.getElementById('profilePictureImg');
      img.src = URL.createObjectURL(blob); // Luo URL kuvan näyttämiseksi
  })
  .catch(error => {
      console.error('Virhe:', error);
  });
});

function previewAndUploadImage(input) {
  var reader = new FileReader();

  reader.onload = function (e) {
      var img = document.getElementById('profilePictureImg');
      img.src = e.target.result;
  };

  reader.readAsDataURL(input.files[0]);
}

function uploadImage(input) {
  var file = input.files[0];
  var formData = new FormData();
  formData.append('photo', file);

  fetch('http://localhost:3000/api/vi/users', {
      method: 'POST',
      body: formData
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Virhe kuvan lähetyksessä.');
      }
      console.log('Kuva lähetetty ja tallennettu onnistuneesti!');
  })
  .catch(error => {
      console.error('Virhe:', error);
  });
}
