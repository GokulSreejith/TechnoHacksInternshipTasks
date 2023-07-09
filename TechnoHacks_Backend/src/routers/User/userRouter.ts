import express from 'express';
import { userController } from '../../controllers';
import { userAccess } from '../../middlewares';

const {
  getUsers,
  getUserById,
  getUserProfile,
  updateUserProfile,
  userLogin,
  userRegistration,
  deleteUser,
  deleteAllUser,
} = userController;

const router = express.Router();

router.route('/').get(userAccess, getUsers);
router
  .route('/profile')
  .get(userAccess, getUserProfile)
  .patch(userAccess, updateUserProfile);
router.route('/register').post(userRegistration);
router.route('/login').patch(userLogin);
router
  .route('/:uid')
  .get(userAccess, getUserById)
  .delete(userAccess, deleteUser);
router.route('/delete/all').delete(userAccess, deleteAllUser);

export default router;
