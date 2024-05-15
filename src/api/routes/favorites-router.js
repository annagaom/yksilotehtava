import {
getFavoriteByUserId,
postFavorite,
deleteFavoriteByRestaurantAndUserId,
getFavorites
} from '../controllers/favorites-controller.js'
import express from 'express';


const favoriteRouter = express.Router();

favoriteRouter.route('/').get(getFavorites).post(postFavorite);
favoriteRouter.route('/:user_id').get(getFavoriteByUserId)
favoriteRouter.route('/delete/:restaurant_id/:user_id').delete(deleteFavoriteByRestaurantAndUserId);


export default favoriteRouter;
