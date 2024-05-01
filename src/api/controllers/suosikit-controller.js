// import {
//   listAllSuosikit,
//   findSuosikkiByUserId,
//   addSuosikki,
//   removeSuosikkiById
// } from '../models/suosikit-model.js';

// const getsuosikit = async (req, res) => {
//   const suosikit = await listAllSuosikit();
//   if (!suosikit) {
//       res.sendStatus(404);
//       return;
//   }res
//   res.json(suosikit);
// };

// const getsuosikkiByUserId = async(req, res) => {
// const suosikit = await findSuosikkiByUserId(req.params.favorite_id);
//   if (suosikit) {
//       res.json(suosikit);
//   } else {
//       res.sendStatus(404);
//   }
// }

// const postsuosikki = async (req, res) => {
// console.log(req.body);

// const result = await addSuosikki(req.body);
// if (!result) {
//     const error = new Error('Invalid or missing fields.');
//     error.status = 400;
//     return
// }
// res.status(201).json(result);
// };

// const deletesuosikkiById = async (req, res) => {

//   const result = await removeSuosikkiById(req.params.user_id);
//   if (!result) {
//       res.sendStatus(400);
//       return;
//   }
//   res.json(result);
// };

// export {
// getsuosikit,
// getsuosikkiByUserId,
// postsuosikki,
// deletesuosikkiById
// };
