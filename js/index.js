const makeFetch = async (url) => {
  const result = await fetch(url);
  return await result.json();
};

const fetchRestaurants = async () =>
  await makeFetch('https://10.120.32.94/restaurant/api/v1/restaurants');

  const fetchDailyMenu = async (id) =>
    makeFetch(
      `https://10.120.32.94/restaurant/api/v1/restaurants/daily/${id}/fi`
    );

    const restaurants = []; // Oletetaan, että ravintolatiedot haetaan jostain ja tallennetaan tähän taulukkoon

    const searchRestaurants = () => {
      const searchInput = document
        .getElementById('searchInput')
        .value.toLowerCase();
      const searchResults = document.getElementById('searchResults');
      searchResults.innerHTML = ''; // Tyhjennetään hakutulokset jokaisen haun alussa

      const matchingRestaurants = restaurants.filter((restaurant) => {
        return restaurant.name.toLowerCase().includes(searchInput);
      });

      matchingRestaurants.forEach((restaurant) => {
        const li = document.createElement('li');
        li.textContent = restaurant.name;
        searchResults.appendChild(li);
      });
    };

function success(pos) {
  const crd = pos.coords;

  const map = L.map('map').setView([60.228982, 25.018456], 12);
  // Use the leaflet.js library to show the location on the map (https://leafletjs.com/)
  fetchRestaurants()
    .then((restaurants) => {
      crd.restaurants = restaurants;

      restaurants.forEach((restaurant) => {
        const lon1 = restaurant.location.coordinates[0];
        const lat1 = restaurant.location.coordinates[1];
        const lon2 = crd.longitude;
        const lat2 = crd.latitude;
        const dist = distance(lat1, lon1, lat2, lon2);
        restaurant.distance = dist;

        L.marker([lat1, lon1])
          .addTo(map)
          .bindPopup(
            '<h3>' +
              restaurant.name +
              '</h3><p>' +
              restaurant.address +
              ', ' +
              restaurant.city +
              '</p><p>Distance: ' +
              dist.toFixed(2) +
              ' km</p>'
          );
      });

      function distance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Maapallon säde metreinä
        const φ1 = (lat1 * Math.PI) / 180; // Latitude radiaaneina
        const φ2 = (lat2 * Math.PI) / 180; // Longitude radiaaneina
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
          Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const dist = (R * c) / 1000; // Etäisyys kilometreinä
        return dist;
      }

      createTable(crd.restaurants);
    })
    .catch((error) => {
      console.error('Error fetching restaurants:', error);
    });

  L.marker([crd.latitude, crd.longitude])
    .addTo(map)
    .bindPopup('I am here.')
    .openPopup();

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

const sortRestaurants = (restaurants) => {
  restaurants.sort((a, b) =>
    a.name.toLowerCase().trim().localeCompare(b.name.toLowerCase().trim())
  );
};

const createPhoneLink = (phone) => {
  const cleanedNumber = phone.replaceAll(' ', '').replace(/[a-zA-Z-]+/g, '');
  return `<a href="tel:${cleanedNumber}">${cleanedNumber}</a>`;
};

const createDialog = (restaurant, dialogNode, menu) => {
  const phone =
    restaurant.phone !== '-' ? createPhoneLink(restaurant.phone) : '';

  dialogNode.innerHTML = `
    <h1>${restaurant.name}</h1>
    <p>${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}</p>
    <p>${restaurant.company} ${phone}</p>

    <ul>
    ${menu.courses
      .map(
        ({name, price, diets}) =>
          `<li>${name} - ${price} (${diets.join(', ')})</li>`
      )
      .join('')}
    </ul>

    <form method="dialog">
      <button class="button">Sulje</button>
    </form>
  `;
  dialogNode.showModal();
};

const handleTableRowClick = async (tr, restaurant, dialogNode) => {
  document.querySelectorAll('tr').forEach((tr) => {
    tr.classList.remove('highlight');
  });

  tr.classList.add('highlight');

  const handleTableRowClick = async (tr, restaurant, dialogNode) => {
    document.querySelectorAll('tr').forEach((tr) => {
      tr.classList.remove('highlight');
    });

    tr.classList.add('highlight');

    const menu = await fetchDailyMenu(restaurant._id);
    console.log('menu', menu);

    createDialog(restaurant, dialogNode, menu);
  };

  const createTable = async (restaurants) => {
    const tableNode = document.querySelector('table');
    const dialogNode = document.querySelector('dialog');

    for (const restaurant of restaurants) {
      const menu = await fetchDailyMenu(restaurant._id);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${restaurant.name}</td>
        <td>${restaurant.address}</td>
        <td>${restaurant.distance.toFixed(2)} km</td>
      `;
      tableNode.appendChild(tr);

      tr.addEventListener('click', () => {
        handleTableRowClick(tr, restaurant, dialogNode);
      });
    }
  };

  const buildWebsite = async () => {
    const restaurants = await fetchRestaurants();
    sortRestaurants(restaurants);
    createTable(restaurants);
  };

  buildWebsite();

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  navigator.geolocation.getCurrentPosition(success, error, options);
};
