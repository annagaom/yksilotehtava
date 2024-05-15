'use strict';
/*funktio kielen vaihtoon */
function getSelectedLanguage() {
  const kieli = document.getElementById('kieli');
  return kieli && kieli.value ? kieli.value : 'FI';
}

document.getElementById("kieli").addEventListener("change", function () {
    var selectedLanguage = this.value;
    if (selectedLanguage === 'FI') {
        window.location.href = '../fi/index.html';
    } else if (selectedLanguage === 'EN') {
        window.location.href = '../en/index_en.html';
    }
});


