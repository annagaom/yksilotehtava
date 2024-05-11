import {
  listAllFavorates,
  findSuosikkiByUserId,
  addFavorate,
  removeFavorateByRestaurantId
} from '../models/suosikit-model.js';

const getFavorates = async (req, res) => {
  const favorates = await listAllFavorates();
  if (!favorates) {
      res.sendStatus(404);
      return;
  }res
  res.json(favorates);
};

const getFavorateByUserId = async(req, res) => {
const favorate = await findSuosikkiByUserId(req.params.favorite_id);
  if (favorate) {
      res.json(favorate);
  } else {
      res.sendStatus(404);
  }
}

const postFavorate = async (req, res) => {
console.log(req.body);

const result = await addFavorate(req.body);
if (!result) {
    const error = new Error('Invalid or missing fields.');
    error.status = 400;
    return
}
res.status(201).json(result);
};

const deleteFavorateByRestaurantId = async (req, res) => {

  const result = await removeFavorateByRestaurantId(req.params.user_id);
  if (!favorate) {
      res.sendStatus(400);
      return;
  }
  res.json(result);
};

export {
getFavorates,
getFavorateByUserId,
postFavorate,
deleteFavorateByRestaurantId
};
