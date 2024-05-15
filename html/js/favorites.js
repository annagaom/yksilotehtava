
const getFavorites = async () => {
  const response = await fetch('http://localhost/api/favorites');

  if (!response.ok) {
    throw new Error('Failed to fetch favorites');
  } else if (response.status === 404) {
    message: 'No favorites found';
    return [];
  } else {
  const favorites = await response.json();
  return favorites;
  }
};

const renderFavorites = async () => {
  const favorites = await getFavorites();
  const favoritesList = document.getElementById('favoritesList');

  favoritesList.innerHTML = '';

  favorites.forEach(favorite => {
    const favoriteItem = document.createElement('td');
    favoriteItem.textContent = favorite.company;
    favoritesList.appendChild(favoriteItem);

    const favoriteItem2 = document.createElement('td');
    favoriteItem2.textContent = favorite.name;
    favoritesList.appendChild(favoriteItem2);

    const favoriteItem3 = document.createElement('td');
    favoriteItem3.textContent = favorite.address;
    favoritesList.appendChild(favoriteItem3);

    const favoriteItem4 = document.createElement('td');
    favoriteItem4.textContent = favorite.city;
    favoritesList.appendChild(favoriteItem4);

    const favoriteItem5 = document.createElement('td');
    favoriteItem5.textContent = favorite.puh;
    favoritesList.appendChild(favoriteItem5);

    const favoriteItem6 = document.createElement('td');
    favoriteItem6.textContent = favorite.email;
    favoritesList.appendChild(favoriteItem6);

    const favoriteItem7 = document.createElement('td');
    favoriteItem7.textContent = favorite.distance;
    favoritesList.appendChild(favoriteItem7);

    // lisää ostoskori- ja suosikkipainikkeet
    const buttonElement = document.createElement('button');
    buttonElement.innerHTML = '<i class="fas fa-shopping-cart"></i>';
    buttonElement.classList.add('cart-button');

    const buttonElement2 = document.createElement('button');
    const isAlreadyFavorite = await isFavorite(userId, tuote_id);
    if (isAlreadyFavorite) {
      buttonElement2.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
      buttonElement2.innerHTML = '<i class="far fa-heart"></i>';
    }

    buttonElement2.classList.add('favorite-button');

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    buttonContainer.appendChild(buttonElement);
    buttonContainer.appendChild(buttonElement2);

    tuoteElement.appendChild(buttonContainer);
    cakeList.appendChild(tuoteElement);


    buttonElement.addEventListener('click', async () => {
      const tarkista = await ostoskoriTarkistus(userId, tuote_id);
      if (tarkista === false) {
        await addToCart(userId, tuote_id, 1);
      } else {
        await updateCart(userId, tuote_id, 1);
      }
    });

    buttonElement2.addEventListener('click', async () => {
      const currentlyFavorite = await isFavorite(userId, tuote_id);
      if (currentlyFavorite) {
        await removeSuosikista(userId, tuote_id);
        const parentElement = buttonElement2.closest('.cake-item');
        if (parentElement) {
          parentElement.remove();
        }
      } else {
        await addFavorite(userId, tuote_id);
        buttonElement2.querySelector('i').classList.replace('far', 'fas');
      }
    });
  } catch (error) {
    console.error('Virhe tuotteen hakemisessa:', error.message);
  }
};

const isFavorite = async (userId, tuote_id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/suosikit/${userId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(virhesuosikit);
    }

    const favorites = await response.json();
    const favoriteTuoteIds = favorites.map((item) => item.tuote_id);

    return favoriteTuoteIds.includes(tuote_id);
  } catch (error) {
    return false;
  }
};

const toggleFavorite = async (userId, tuote_id, buttonElement) => {
  const currentlyFavorite = await isFavorite(userId, tuote_id);

  if (currentlyFavorite) {
    await removeFavorite(userId, tuote_id);
    buttonElement.querySelector('i').classList.replace('fas', 'far');
  } else {
    await addFavorite(userId, tuote_id);
    buttonElement.querySelector('i').classList.replace('far', 'fas');
  }
};

const removeFavorite = async (restaurant_id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/favorotes/${restaurant_id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(virhesuosikit);
    }
  } catch (error) {
    console.error(error.message);
  }
}

const addFavorite = async (restaurant_id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/favprites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        asiakas_id: asiakas_id,
        tuote_id: tuote_id,
      }),
    });

    if (!response.ok) {
      throw new Error(virhesuosikit2);
    }

  } catch (error) {
    const removeSuosikista = async (userId, tuote_id) => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/suosikit/${userId}/${tuote_id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(virhesuosikit3);
        }
      } catch (error) {
      }
    };
  }
};







  });
}
