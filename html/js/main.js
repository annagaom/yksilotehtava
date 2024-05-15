

const makeFetch = async (url) => {
  const result = await fetch(url)

  return await result.json()
}

const fetchRestaurants = async () =>
  await makeFetch("https://10.120.32.94/restaurant/api/v1/restaurants")

const fetchDailyMenuFi = async (id) =>
  makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/daily/${id}/${idKieli}`)

const fetchDailyMenuEn = async (id) =>
  makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/daily/${id}/${idKieli}`)

const fetchWeeklyMenuFi = async (id) =>
  makeFetch(`https://https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${id}/${idKieli}`)

const fetchWeeklyMenuEn = async (id) =>
  makeFetch(`https://https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${id}/${idKieli}`)



let nearestTeksti = '';
let menuTeksti = '';
let idKieli = '';
let locationTeksti =""

console.log('selected language:', getSelectedLanguage());
switch (getSelectedLanguage()) {
  case 'EN':
    nearestTeksti = 'Nearest restaurant';
    menuTeksti = 'Menu';
    idKieli = 'en';
    nearestTeksti = 'Nearest restaurant';
    locationTeksti = 'You are here';
    break;
  case 'FI':
  default:
    nearestTeksti = 'Lähin ravintola';
    menuTeksti = 'Ruokalista';
    idKieli = 'fi';
    nearestTeksti = 'Lähin ravintola';
    locationTeksti = 'Olet tässä';
    break;
}

  function success(pos) {
    const crd = pos.coords;

    const map = L.map('map').setView([60.228982, 25.018456], 12);
    // Use the leaflet.js library to show the location on the map (https://leafletjs.com/)
    fetchRestaurants().then(restaurants => {
      crd.restaurants = restaurants;

      restaurants.forEach(restaurant => {
        const lon1 = restaurant.location.coordinates[0];
        const lat1 = restaurant.location.coordinates[1];
        const lon2 = crd.longitude;
        const lat2 = crd.latitude;
        const dist = distance(lat1, lon1, lat2, lon2);
        restaurant.distance = dist;
        restaurantIncludeDistance = restaurant;
        //console.log('restaurant:', restaurantIncludeDistance);

        // L.marker([lat1, lon1]).addTo(map)
        //   .bindPopup('<h3>' + restaurant.name + '</h3><p>' + restaurant.address + ', '+
        //   restaurant.city + '</p><p>Distance: ' + dist.toFixed(2) + ' km</p>');
      });


      function distance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Maapallon säde metreinä
        const φ1 = lat1 * Math.PI / 180; // Latitude radiaaneina
        const φ2 = lat2 * Math.PI / 180; // Longitude radiaaneina
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        const dist = (R * c) / 1000; // Etäisyys kilometreinä
        return dist;
      }
      createTable(crd.restaurants);

      function sortRestaurantsByName(restaurants) {
        restaurants.sort((a, b) =>
          a.name
            .toLowerCase()
            .trim()
            .localeCompare(b.name.toLowerCase().trim())
        );
        console.log('sorted restaurants by name:', restaurants);
      }

      const findNearestRestaurant = (restaurants) => {
        restaurants.sort((a, b) => a.distance - b.distance);
        console.log('sorted restaurants by distance:', restaurants);
        console.log('nearest restaurant:', restaurants[0]);
        return restaurants[0];
      }

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

    L.marker([crd.latitude, crd.longitude],{icon: greenIcon}).addTo(map)
    .bindPopup(locationTeksti)
    .openPopup();
    const nearestRestaurant = findNearestRestaurant(restaurants);
    restaurants.forEach(restaurant => {
      if (restaurant === nearestRestaurant) {
        L.marker([restaurant.location.coordinates[1], restaurant.location.coordinates[0]],{icon: orangeIcon}).addTo(map)

      } else {
        L.marker([restaurant.location.coordinates[1], restaurant.location.coordinates[0]], {icon: blueIcon}).addTo(map)

      }

      crd.restaurants.forEach(restaurant => {
        const icon = restaurant === nearestRestaurant ? orangeIcon : blueIcon;

        const popupContent = document.createElement('div');

        // Add the "Lähin ravintola" message for the nearest restaurant
        if (restaurant === nearestRestaurant) {
          const nearestMessage = document.createElement('h2');
          nearestMessage.textContent = nearestTeksti;
          popupContent.appendChild(nearestMessage);
        }

        const h3 = document.createElement('h3');
        h3.textContent = restaurant.name;
        popupContent.appendChild(h3);

        const p1 = document.createElement('p');
        p1.textContent = restaurant.address + ', ' + restaurant.city;
        popupContent.appendChild(p1);

        const p2 = document.createElement('p');
        p2.textContent = 'Distance: ' + restaurant.distance.toFixed(2) + ' km';
        popupContent.appendChild(p2);

        const button = document.createElement('button');
        button.textContent = menuTeksti;
        button.classList.add('menuButton');
        button.dataset.id = restaurant.id;
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
});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
}

// Function to be called if an error occurs while retrieving location information
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function sortRestaurantsByName(restaurants) {
  restaurants.sort((a, b) =>
    a.name
      .toLowerCase()
      .trim()
      .localeCompare(b.name.toLowerCase().trim())
  );
  console.log('sorted restaurants by name:', restaurants);
}

const createPhoneLink = (phone) => {
  const cleanedNumber = phone.replaceAll(" ", "").replace(/[a-zA-Z-]+/g, "")

  return `<a href="tel:${cleanedNumber}">${cleanedNumber}</a>`
}

const createDialog = (restaurant, dialogNode, menu) => {
  // ternary operator
  const phone = restaurant.phone !== "-" ? createPhoneLink(restaurant.phone) : ""

  dialogNode.innerHTML = `
    <h3>${restaurant.name}</h3>
    <p>${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}</p>
    <p>${restaurant.company} ${phone}</p>

    <form method="dialog">
      <button class="button">${menuTeksti}</button>
      <button class = "button">Sulje</button>

    </form>
  `
  dialogNode.showModal()
}


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


const createTable = async (restaurants) => {
  const tableNode = document.querySelector("table");
  const dialogNode = document.querySelector("dialog");

  // Clear existing rows if any
  tableNode.innerHTML = '';

  for (const restaurant of restaurants) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${restaurant.name}</td>
      <td>${restaurant.address}</td>
      <td>${restaurant.city}</td>
      <td>${restaurant.distance.toFixed(2)} km</td>
    `;
    tableNode.appendChild(tr);

    tr.addEventListener("click", async () => {
      await handleTableRowClick(tr, restaurant, dialogNode);
    });
  }
};


const buildWebsite = async () => {
  try {
    const restaurants = await fetchRestaurants();

    //const sortBy = updateSelectedSortBy();
    // Sort restaurants based on selected sorting option
    try {
       if (sortBy === "Nimi") {
        sortRestaurantsByName(restaurants);
      // } else if (sortBy === "Etäisyys") {
      //   sortRestaurantsByDistance(restaurants);
      } else if (sortBy === "Kaupunki") {
        sortRestaurantsByCity(restaurants);
      }

      // Update the table based on the sorted and filtered data
      createTable(restaurants);
    } catch (error) {
      console.error('Error:', error);
    }
    console.error('Error building website:', error);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
  }
};

buildWebsite()



const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

// Starts the location search
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




