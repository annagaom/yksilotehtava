

const makeFetch = async (url) => {
  const result = await fetch(url)

  return await result.json()
}

const fetchRestaurants = async () =>
  await makeFetch("https://10.120.32.94/restaurant/api/v1/restaurants")

const fetchDailyMenu = async (id) =>
  makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/daily/${id}/fi`)

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
      iconUrl: '/image/green-marker.png',
      iconSize: [25, 40],
      popupAnchor: [15, -16]
    });

    const orangeIcon = L.icon({
      iconUrl: '/image/orange-marker.png',
      iconSize: [25, 40],
      popupAnchor: [15, -16]
    });

    const blueIcon = L.icon({
      iconUrl: '/image/blue-marker.png',
      iconSize: [25, 40],
      popupAnchor: [15, -16]
    });



    L.marker([crd.latitude, crd.longitude],{icon: greenIcon}).addTo(map)
    .bindPopup('Olet tässä.')
    .openPopup();
  const nearestRestaurant = findNearestRestaurant(restaurants);
  restaurants.forEach(restaurant => {
    if (restaurant === nearestRestaurant) {
      L.marker([restaurant.location.coordinates[1], restaurant.location.coordinates[0]],{icon: orangeIcon}).addTo(map)
        .bindPopup('<h2> Lähin ravintola.<h2><h3>' + restaurant.name + '</h3><p>' + restaurant.address + ', '+
            restaurant.city + '</p><p>Distance: ' + restaurant.distance.toFixed(2) + ' km</p>');
    } else {
      L.marker([restaurant.location.coordinates[1], restaurant.location.coordinates[0]], {icon: blueIcon}).addTo(map)
        .bindPopup('<h3>' + restaurant.name + '</h3><p>' + restaurant.address + ', '+
        restaurant.city + '</p><p>Distance: ' + restaurant.distance.toFixed(2) + ' km</p>');
    }
  });







    // console.log('nearest restaurant:', nearestRestaurant);
    //   //handleTableRowClick(tr, nearestRestaurant, dialogNode);
    //   L.marker([nearestRestaurant.location.coordinates[1], nearestRestaurant.location.coordinates[0]],{icon: orangeIcon}).addTo(map)
    //     .bindPopup('<h3>' + nearestRestaurant.name + '</h3><p>' + nearestRestaurant.address + ', '+
    //     nearestRestaurant.city + '</p><p>Distance: ' + nearestRestaurant.distance.toFixed(2) + ' km</p>');
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
    <h1>${restaurant.name}</h1>
    <p>${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}</p>
    <p>${restaurant.company} ${phone}</p>

    <ul>
    ${menu.courses.map(({name, price, diets}) =>

    `<li>${name} - ${price} (${diets.join(", ")})</li>`).join("")}
    </ul>

    <form method="dialog">
      <button class = "button">Sulje</button>
    </form>
  `
  dialogNode.showModal()
}

const handleTableRowClick = async (tr, restaurant, dialogNode) => {
  document.querySelectorAll("tr").forEach((tr) => {
    tr.classList.remove("highlight")
  })

  tr.classList.add("highlight")

  const menu = await fetchDailyMenu(restaurant._id)
  console.log("menu", menu)

  createDialog(restaurant, dialogNode, menu)
}
const createTable = async (restaurants) => {
  const tableNode = document.querySelector("table");
  const dialogNode = document.querySelector("dialog");

  for (const restaurant of restaurants) {
    const menu = await fetchDailyMenu(restaurant._id);
    const tr = document.createElement("tr");
    const distance = restaurant.distance.toFixed(2) + " km";

    tr.innerHTML = `
      <td>${restaurant.name}</td>
      <td>${restaurant.address}</td>
      <td>${restaurant.city}</td>
      <td>${restaurant.distance}</td>
    `;
    tableNode.appendChild(tr);

    tr.addEventListener("click", () => {
      handleTableRowClick(tr, restaurant, dialogNode);
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



// // kun painaa registeroidy button, niin tulee registeri formi ikkuna
// registerForm.style.display = 'none';
// document.querySelector('#registerBtn').addEventListener('click', () => {
//     registerForm.style.display = 'block';
// });
// function registerUser(e) {
//     e.preventDefault();

//     const firstname = registerForm['etunimi'].value;
//     const laskname = registerForm['sukunimi'].value;

//     const email = registerForm['email'].value;
//     const phone = registerForm['puhelin'].value;
//     const password = registerForm['password'].value;

//     auth.createUserWithEmailAndPassword(email, password).then(cred => {
//         console.log(cred.user);
//         registerForm.reset();
//     });
// }
// registerForm.addEventListener('submit', registerUser);

