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

const fetchRestaurants = async () => await makeFetch("https://10.120.32.94/restaurant/api/v1/restaurants");

const fetchDailyMenuFi = async (id) => makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/daily/${id}/fi`);

const fetchDailyMenuEn = async (id) => makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/daily/${id}/en`);

const fetchWeeklyMenuFi = async (id) => makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${id}/fi`);

const fetchWeeklyMenuEn = async (id) => makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${id}/en`);

async function fetchAndLogData() {
  try {
    const selectedTypeFi = document.getElementById("menuTypeFi");
    const selectedTypeEn = document.getElementById("menuTypeEn");

    const dailyMenuFi = await fetchDailyMenuFi(restaurantId);
    const dailyMenuEn = await fetchDailyMenuEn(restaurantId);
    const weeklyMenuFi = await fetchWeeklyMenuFi(restaurantId);
    const weeklyMenuEn = await fetchWeeklyMenuEn(restaurantId);

    if (selectedTypeFi && selectedTypeFi.value === "dailyFi") {
      displayDailyMenu(dailyMenuFi);
    } else if (selectedTypeFi && selectedTypeFi.value === "weeklyFi") {
      displayWeeklyMenu(weeklyMenuFi);
    } else if (selectedTypeEn && selectedTypeEn.value === "dailyEn") {
      displayDailyMenu(dailyMenuEn);
    } else if (selectedTypeEn && selectedTypeEn.value === "weeklyEn") {
      displayWeeklyMenu(weeklyMenuEn);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const displayDailyMenu = (menu) => {
  const menuList = document.getElementById('menuList');
  menuList.innerHTML = '';
  menu.forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = item;
    menuList.appendChild(listItem);
  });
};

const displayWeeklyMenu = (menu) => {
  const menuList = document.getElementById('menuList');
  menuList.innerHTML = '';
  menu.forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = item;
    menuList.appendChild(listItem);
  });
};

// Käynnistää tietojen hakuprosessin, kun dokumentti on ladattu
document.addEventListener('DOMContentLoaded', fetchAndLogData);
