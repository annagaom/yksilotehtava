import {
  listAllFavorites,
  findFavoriteByUserId,
  addFavorite,
  removeFavoriteByRestaurantId
} from '../models/favorites-model.js';

const getFavorites = async (req, res) => {
  const favorites = await listAllFavorites();
  if (!favorites) {
      res.sendStatus(404);
      return;
  }res
  res.json(favorites);
};

const getFavoriteByUserId = async(req, res) => {
const favorite = await findFavoriteByUserId(req.params.favorite_id);
  if (favorite) {
      res.json(favorite);
  } else {
      res.sendStatus(404);
  }
}

const postFavorite = async (req, res) => {
console.log(req.body);

const result = await addFavorite(req.body);
if (!result) {
    const error = new Error('Invalid or missing fields.');
    error.status = 400;
    return
}
res.status(201).json(result);
};

const deleteFavoriteByRestaurantId = async (req, res) => {

  const result = await removeFavoriteByRestaurantId(req.params.user_id);
  if (!favorite) {
      res.sendStatus(400);
      return;
  }
  res.json(result);
};

export {
getFavorites,
getFavoriteByUserId,
postFavorite,
deleteFavoriteByRestaurantId
};
