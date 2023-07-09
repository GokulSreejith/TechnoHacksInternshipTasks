import { ErrorResponse } from '../../classes';
import { userHelper } from '../../helpers';
import { HttpStatusCode } from '../../interfaces';
import { ApiParams } from '../../types';

/**
 * To get all users
 * @param req
 * @param res
 * @param next
 */
export const getUsers: ApiParams = (req, res, next) => {
  userHelper
    .getUsers()
    .then((response) => {
      res.status(HttpStatusCode.OK).json({ success: true, ...response });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To get a particular user by id
 * @param req - Params : uid
 * @param res
 * @param next
 */
export const getUserById: ApiParams = (req, res, next) => {
  userHelper
    .getUserById(req.params.uid, req.client?.role)
    .then((response) => {
      res.status(HttpStatusCode.OK).json({ success: true, ...response });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * Get a particular user's profile
 * METHOD : GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getUserProfile: ApiParams = (req, res, next) => {
  userHelper
    .getUserById(req.client!.id, req.client!.role)
    .then((response) => {
      res.status(200).json({
        success: true,
        ...response,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To login a user
 * @param req - Body: { username and password }
 * @param res
 * @param next
 */
export const userLogin: ApiParams = (req, res, next) => {
  userHelper
    .userLogin(
      req.body.username,
      req.body.email,
      req.body.phone,
      req.body.password
    )
    .then((response) => {
      res.status(HttpStatusCode.OK).json({ success: true, ...response });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To registration a new user
 * @param req - Body: { IUser }
 * @param res
 * @param next
 */
export const userRegistration: ApiParams = (req, res, next) => {
  userHelper
    .userRegistration(req.body)
    .then((response) => {
      res.status(HttpStatusCode.OK).json({ success: true, ...response });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To update particular user profile
 * @param req Params: uid, Body: { IUser }
 * @param res
 * @param next
 */
export const updateUserProfile: ApiParams = (req, res, next) => {
  userHelper
    .updateUserProfile(req.client?.id, req.body)
    .then((response) => {
      res.status(HttpStatusCode.OK).json({ success: true, ...response });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To delete a user temporarily
 * @param req - Params: uid
 * @param res
 * @param next
 */
export const deleteUser: ApiParams = (req, res, next) => {
  userHelper
    .deleteUser(req.params.uid)
    .then((response) => {
      res.status(HttpStatusCode.OK).json({ success: true, ...response });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};

/**
 * To delete all user in development mode
 * METHOD : DELETE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deleteAllUser: ApiParams = (req, res, next) => {
  userHelper
    .deleteAllUsers()
    .then((response) => {
      res.status(HttpStatusCode.OK).json({
        success: true,
        ...response,
      });
    })
    .catch((error: any) => {
      return next(
        new ErrorResponse(error.message, error.statusCode, error.code)
      );
    });
};
