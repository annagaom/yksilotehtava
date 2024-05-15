const selectLanguage = getSelectedLanguage();

const makeFetch = async (url) => {
  const result = await fetch(url);
  if (!result.ok) {
    throw new Error('Network response was not ok');
  }
  return await result.json();
};

const fetchRestaurants = async () => await makeFetch("https://10.120.32.94/restaurant/api/v1/restaurants");

const fetchDailyMenuFi = async (id) => makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/daily/${id}/fi`);

const fetchDailyMenuEn = async (id) => makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/daily/${id}/en`);

const fetchWeeklyMenuFi = async (id) => makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${id}/fi`);

const fetchWeeklyMenuEn = async (id) => makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${id}/en`);

let nearestTeksti = '';
let menuTeksti = '';
let idKieli = '';
let locationTeksti = "";

switch (getSelectedLanguage()) {
  case 'EN':
    nearestTeksti = 'Nearest restaurant';
    menuTeksti = 'Menu';
    idKieli = 'en';
    locationTeksti = 'You are here';
    break;
  case 'FI':
  default:
    nearestTeksti = 'Lähin ravintola';
    menuTeksti = 'Ruokalista';
    idKieli = 'fi';
    locationTeksti = 'Olet tässä';
    break;
}

function success(pos) {
  const crd = pos.coords;
  const map = L.map('map').setView([60.228982, 25.018456], 12);

  fetchRestaurants().then(restaurants => {
    crd.restaurants = restaurants;

    restaurants.forEach(restaurant => {
      const lon1 = restaurant.location.coordinates[0];
      const lat1 = restaurant.location.coordinates[1];
      const lon2 = crd.longitude;
      const lat2 = crd.latitude;
      const dist = distance(lat1, lon1, lat2, lon2);
      restaurant.distance = dist;
    });

    createTable(restaurants);

    const findNearestRestaurant = (restaurants) => {
      restaurants.sort((a, b) => a.distance - b.distance);
      return restaurants[0];
    };

    const greenIcon = L.icon({
      iconUrl: '../image/green-marker.png',
      iconSize: [25, 40],
      popupAnchor: [15, -16]
    });

    const orangeIcon = L.icon({
      iconUrl: '../image/orange-marker.png',
      iconSize: [25, 40],
      popupAnchor: [15, -16]
    });

    const blueIcon = L.icon({
      iconUrl: '../image/blue-marker.png',
      iconSize: [25, 40],
      popupAnchor: [15, -16]
    });

    L.marker([crd.latitude, crd.longitude], { icon: greenIcon }).addTo(map)
      .bindPopup(locationTeksti)
      .openPopup();

    const nearestRestaurant = findNearestRestaurant(restaurants);
    restaurants.forEach(restaurant => {
      const icon = restaurant === nearestRestaurant ? orangeIcon : blueIcon;

      const popupContent = document.createElement('div');

      if (restaurant === nearestRestaurant) {
        const nearestMessage = document.createElement('h2');
        nearestMessage.textContent = nearestTeksti;
        popupContent.appendChild(nearestMessage);
      }

      const h3 = document.createElement('h3');
      h3.textContent = restaurant.name;
      popupContent.appendChild(h3);

      const p1 = document.createElement('p');
      p1.textContent = `${restaurant.address}, ${restaurant.city}`;
      popupContent.appendChild(p1);

      const p2 = document.createElement('p');
      p2.textContent = `Distance: ${restaurant.distance.toFixed(2)} km`;
      popupContent.appendChild(p2);

      const button = document.createElement('button');
      button.textContent = menuTeksti;
      button.classList.add('menuButton');
      button.dataset.id = restaurant._id;
      button.addEventListener('click', (event) => {
        const restaurantId = event.target.dataset.id;
        const kieli = getSelectedLanguage();
        const targetPage = getMenuPageUrl(kieli);
        window.location.href = `${targetPage}?id=${restaurantId}`;
      });
      popupContent.appendChild(button);

      L.marker([restaurant.location.coordinates[1], restaurant.location.coordinates[0]], { icon }).addTo(map)
        .bindPopup(popupContent);
    });
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function distance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const dist = (R * c) / 1000;
  return dist;
}

/* sort anfd filter */

function sortRestaurantsByName(restaurants ) {
  restaurants.sort((a, b) =>
    a.name.toLowerCase().trim().localeCompare(b.name.toLowerCase().trim())
  );
  console.log('sorted restaurants by name:', restaurants);
}

const filterAndSortRestaurantsByCity = (restaurants, city) => {
  restaurants.filter((restaurant) => restaurant.city === city);
  restaurants.sort((a, b) =>
    a.city.toLowerCase().trim().localeCompare(b.city.toLowerCase().trim())
  );
};

const filterRestaurantsByCompany= (restaurants, company) => {
  return restaurants.filter((restaurant) => restaurant.company === company);
  restaurants.sort((a, b) =>
    a.company.toLowerCase().trim().localeCompare(b.company.toLowerCase().trim())
  );
}

/* create table */

const createPhoneLink = (phone) => {
  const cleanedNumber = phone.replaceAll(" ", "").replace(/[a-zA-Z-]+/g, "");
  return `<a href="tel:${cleanedNumber}">${cleanedNumber}</a>`;
};

const createDialog = (restaurant, dialogNode, menu) => {
  const phone = restaurant.phone !== "-" ? createPhoneLink(restaurant.phone) : "";

  dialogNode.innerHTML = `
    <h3>${restaurant.name}</h3>
    <p>${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}</p>
    <p>${restaurant.company} ${phone}</p>

    <form method="dialog">
      <button id="menuButton" class="button">${menuTeksti}</button>
      <button class="button" type="submit">Sulje</button>
    </form>
  `;

  const menuButton = dialogNode.querySelector("#menuButton");
  menuButton.addEventListener('click', (event) => {
    event.preventDefault();
    const restaurantId = restaurant._id;
    const kieli = getSelectedLanguage();
    const targetPage = getMenuPageUrl(kieli);
    window.location.href = `${targetPage}?id=${restaurantId}`;
  });

  dialogNode.showModal();
};

const handleTableRowClick = async (tr, restaurant, dialogNode) => {
  document.querySelectorAll("tr").forEach((tr) => {
    tr.classList.remove("highlight");
  });

  tr.classList.add("highlight");

  let menu;
  if (getSelectedLanguage() === 'FI') {
    menu = await fetchDailyMenuFi(restaurant._id);
  } else {
    menu = await fetchDailyMenuEn(restaurant._id);
  }

  console.log("menu", menu);

  createDialog(restaurant, dialogNode, menu);
};

const sortList = (restaurants) => {
  const sortBy = updateSelectedValue();

  if (sortBy === "name") {
    sortRestaurantsByName(restaurants);
    console.log('sorted restaurants by name:', restaurants);
  } else if (sortBy === "city") {
     filterAndSortRestaurantsByCity(restaurants);
     console.log('sorted restaurants by city:', restaurants);
    } else if (sortBy === "company") {
      filterRestaurantsByCompany(restaurants);

    console.log('sorted restaurants by distance:', restaurants);
  }
};

const createTable = async (restaurants) => {
  sortList(restaurants);

  const tableNode = document.querySelector("table");
  const dialogNode = document.querySelector("dialog");

  tableNode.innerHTML = '';

  for (const restaurant of restaurants) {
    const distanceText = restaurant.distance !== undefined
                         ? `${restaurant.distance.toFixed(2)} km`
                          : "-";


    const tr = document.createElement("tr");

    tr.innerHTML = `
    <td>${restaurant.company}</td>
      <td>${restaurant.name}</td>
      <td>${restaurant.address}</td>
      <td>${restaurant.city}</td>
      <td>${distanceText}</td>
    `;
    tableNode.appendChild(tr);

    tr.addEventListener("click", async () => {
      await handleTableRowClick(tr, restaurant, dialogNode);
    });
  }
};

const updateSelectedValue = () => {


  if (selectLanguage === 'FI') {
    const selected = document.getElementById('sortByFi');
    if (selected) {
      const selectedValue = selected.value;
      console.log('Selected value (FI):', selectedValue);
      return selectedValue;
    } else {
      console.error('Element with ID "sortByFi" not found');
      return null;
    }
  } else {
    const selected = document.getElementById('sortByEn');
    if (selected) {
      const selectedValue = selected.value;
      console.log('Selected value (EN):', selectedValue);
      return selectedValue;
    } else {
      console.error('Element with ID "sortByEn" not found');
      return null;
    }
  }
};

const getSelectedValue = () => {
  if (selectLanguage === 'FI') {
    const selected = document.getElementById('sortByFi').value;
    return selected;
  } else {
    const selected = document.getElementById('sortByEn').value;
    return selected;
  }
};

const buildWebsite = async () => {
  try {
    const restaurants = await fetchRestaurants();
    createTable(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
  }
};
 if (selectLanguage === 'FI') {
  document.getElementById("sortByFi").addEventListener("change", async () => {
    const restaurants = await fetchRestaurants();
    createTable(restaurants);
  });
} else {
  document.getElementById("sortByEn").addEventListener("change", async () => {
    const restaurants = await fetchRestaurants();
    createTable(restaurants);
  });

}

buildWebsite();

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

navigator.geolocation.getCurrentPosition(success, error, options);

function getMenuPageUrl(kieli) {
  switch (kieli) {
    case 'EN':
      return '../en/menu_en.html';
    case 'FI':
    default:
      return '../fi/menu.html';
  }
}
