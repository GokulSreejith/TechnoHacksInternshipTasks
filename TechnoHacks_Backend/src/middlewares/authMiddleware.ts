import { ErrorResponse } from '../classes';
import { verifyToken } from '../utils';
import { ApiParams } from '../types';
import { IAccountStatus } from '../interfaces';
import { userHelper } from '../helpers';

export const userAccess: ApiParams = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization?.includes('Bearer')
    ) {
      throw new ErrorResponse('Unathenticated', 403);
    }
    const authorizationToken = req.headers.authorization.split(' ')[1];

    if (!authorizationToken) {
      throw new ErrorResponse('Unathenticated', 403);
    }

    const decoded = await verifyToken(authorizationToken);

    if (decoded.role === 'User') {
      const user = await (
        await userHelper.checkUserStatus(decoded.id, [IAccountStatus.ACTIVE])
      ).results;

      req.client = {
        id: user.id,
        name: user.name,
        status: user.status,
        role: user.role,
      };
      return next();
    } else {
      return next(new ErrorResponse('Unathenticated', 403));
    }
  } catch (error: any) {
    return next(new ErrorResponse('Unathenticated', error.statusCode || 403));
  }
};
