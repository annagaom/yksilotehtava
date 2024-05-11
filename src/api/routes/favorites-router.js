import {
  getFavoriteByUserId,
postFavorite,
deleteFavoriteByRestaurantId,
getFavorites
} from '../controllers/favorites-controller.js'
import express from 'express';


const favoriteRouter = express.Router();

favoriteRouter.route('/').get(getFavorites).post(postFavorite);
favoriteRouter.route('/:user_id').get(getFavoriteByUserId)
favoriteRouter.route('/delete/:restaurant_id').delete(deleteFavoriteByRestaurantId);


export default favoriteRouter;
