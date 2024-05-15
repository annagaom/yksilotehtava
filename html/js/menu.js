const selectLanguage = getSelectedLanguage();
const urlParams = new URLSearchParams(window.location.search);
const restaurantId = urlParams.get('id');

// Käytä restaurantId arvoa tarpeesi mukaan
console.log('Restaurant ID:', restaurantId);

const makeFetch = async (url) => {
  try {
    const result = await fetch(url);
    if (!result.ok) {
      throw new Error('Network response was not ok');
    }
    return await result.json();
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error; // Re-throw the error after logging it
  }
};

const fetchDailyMenuFi = async (id) => makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/daily/${id}/fi`);

const fetchDailyMenuEn = async (id) => makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/daily/${id}/en`);

const fetchWeeklyMenuFi = async (id) => makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${id}/fi`);

const fetchWeeklyMenuEn = async (id) => makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${id}/en`);

const displayDailyMenu = (menu) => {
  const menuList = document.getElementById('menuList');
  menuList.innerHTML = '';

  menu.courses.forEach(course => {
    const listItem = document.createElement('li');
    const diets = Array.isArray(course.diets) ? course.diets.join(', ') : 'No diet information';
    listItem.innerHTML = `<strong>${course.name}</strong><br>Price: ${course.price}<br>Diets: ${diets}`;
    menuList.appendChild(listItem);

    // Lisää <hr> jokaisen ruokalajin jälkeen
    const hr = document.createElement('hr');
    hr.className = 'hr2';
    menuList.appendChild(hr);
  });
};

const displayWeeklyMenu = (menu) => {
  const menuList = document.getElementById('menuList');
  menuList.innerHTML = '';

  menu.days.forEach(day => {
    const dayHeader = document.createElement('h2');
    dayHeader.textContent = day.date;
    menuList.appendChild(dayHeader);

    day.courses.forEach(course => {
      const listItem = document.createElement('li');
      const diets = Array.isArray(course.diets) ? course.diets.join(', ') : 'No diet information';
      listItem.innerHTML = `<strong>${course.name}</strong><br>Price: ${course.price || 'Not specified'}<br>Diets: ${diets}`;
      menuList.appendChild(listItem);

      // Lisää <hr> jokaisen ruokalajin jälkeen
      const hr = document.createElement('hr');
      hr.className = 'hr2';
      menuList.appendChild(hr);
    });
  });
};

const getSelectedValue = () => {
  if (selectLanguage === 'FI') {
    const selected = document.getElementById('menuTypeFi');
    if (selected) {
      const selectedValue = selected.value;
      console.log('Selected value (FI):', selectedValue);
      return selectedValue;
    } else {
      console.error('Element with ID "menuTypeFi" not found');
      return null;
    }
  } else {
    const selected = document.getElementById('menuTypeEn');
    if (selected) {
      const selectedValue = selected.value;
      console.log('Selected value (EN):', selectedValue);
      return selectedValue;
    } else {
      console.error('Element with ID "menuTypeEn" not found');
      return null;
    }
  }
};

const updateSelectedAlue = async () => {
  const selectedValue = getSelectedValue();
  console.log('Selected alue vaihdettu:', selectedValue);
  await fetchAndLogData();
  return selectedValue;
};

async function fetchAndLogData() {
  try {
    const selectedValue = getSelectedValue();
    console.log('Fetching data for selected value:', selectedValue);

    const dailyMenuFi = await fetchDailyMenuFi(restaurantId);
    const dailyMenuEn = await fetchDailyMenuEn(restaurantId);
    const weeklyMenuFi = await fetchWeeklyMenuFi(restaurantId);
    const weeklyMenuEn = await fetchWeeklyMenuEn(restaurantId);

    console.log('Daily menu (FI):', dailyMenuFi);
    console.log('Daily menu (EN):', dailyMenuEn);
    console.log('Weekly menu (FI):', weeklyMenuFi);
    console.log('Weekly menu (EN):', weeklyMenuEn);

    if (selectedValue === "dailyFi") {
      displayDailyMenu(dailyMenuFi);
    } else if (selectedValue === "weeklyFi") {
      displayWeeklyMenu(weeklyMenuFi);
    } else if (selectedValue === "dailyEn") {
      displayDailyMenu(dailyMenuEn);
    } else if (selectedValue === "weeklyEn") {
      displayWeeklyMenu(weeklyMenuEn);
    } else {
      console.error('Unknown selected value:', selectedValue);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Käynnistää tietojen hakuprosessin, kun dokumentti on ladattu
document.addEventListener('DOMContentLoaded', async () => {
  await fetchAndLogData();

  const menuTypeFi = document.getElementById('menuTypeFi');
  const menuTypeEn = document.getElementById('menuTypeEn');

  if (menuTypeFi) {
    menuTypeFi.addEventListener('change', updateSelectedAlue);
  }

  if (menuTypeEn) {
    menuTypeEn.addEventListener('change', updateSelectedAlue);
  }
});
