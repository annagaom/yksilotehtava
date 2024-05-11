import {
  getFavorates,
  getFavorateByUserId,
  postFavorate,
  deleteFavorateByRestaurantId
} from '../controllers/suosikit-controller.js';
import express from 'express';


const favorateRouter = express.Router();

favorateRouter.route('/').get(getFavorates).post(postFavorate);
favorateRouter.route('/:user_id').get(getFavorateByUserId)
favorateRouter.route('/delete/:restaurant_id').delete(deleteFavorateByRestaurantId);


export default favorateRouter;
