import { isValidObjectId } from 'mongoose';
import {
  HttpStatusCode,
  IAccountStatus,
  IResponseData,
  ILoginResponse,
  IUserResponse,
  IGetUsersResponse,
  IUser,
  UserRoles,
} from '../../interfaces';
import { User } from '../../models';
import { config } from '../../config';
import { ThrowError } from '../../classes';
import { generateToken } from '../../utils';

const NODE_ENV = config.SERVER.SERVER_NODE_ENV;
/**
 * To get all users except deleted users
 * @returns IUser[]
 */
export const getUsers = () => {
  return new Promise<IGetUsersResponse>(async (resolve, reject) => {
    try {
      const users = await User.find(
        {},
        {
          name: 1,
          username: 1,
          email: 1,
          phone: 1,
          password: 1,
          status: 1,
          createdAt: 1,
        }
      ).sort({ createdAt: -1 });

      resolve({
        message: users.length > 0 ? 'Users fetched' : 'User is empty',
        results: users,
      });
    } catch (error: any) {
      reject({
        message: error.message || error.msg || 'User fetching failed',
        statusCode: error.statusCode || HttpStatusCode.INTERNAL_SERVER,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * To get a particular user by id
 * @param userId
 * @returns IUser
 */
export const getUserById = (userId: IUser['_id'], role?: string) => {
  return new Promise<IUserResponse>(async (resolve, reject) => {
    try {
      if (!userId || !isValidObjectId(userId)) {
        return reject({
          message: !userId ? 'Provide userId' : 'userId not Valid',
          statusCode: HttpStatusCode.BAD_REQUEST,
        });
      }

      const user = await User.findOne(
        { _id: userId },
        {
          name: 1,
          username: 1,
          email: 1,
          phone: 1,
          password: 1,
          status: 1,
          createdAt: 1,
        }
      );

      if (!user) {
        return reject({
          message: 'User not found',
          statusCode: HttpStatusCode.NOT_FOUND,
        });
      }
      resolve({
        message: 'User details fetched',
        results: user,
      });
    } catch (error: any) {
      reject({
        message: error.message || error.msg || 'User fetching failed',
        statusCode: error.statusCode || HttpStatusCode.INTERNAL_SERVER,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * To login a user's account by email and password
 * @param {String} username
 * @param {String} email
 * @param {String} phone
 * @param {String} password
 * @returns {String} token
 */
export const userLogin = (
  username: string,
  email: string,
  phone: string,
  password: string
) => {
  return new Promise<ILoginResponse>(async (resolve, reject) => {
    try {
      if (
        (!username && !email && !phone) ||
        (phone && isNaN(Number(phone))) ||
        !password
      )
        throw new ThrowError(
          `Provide ${
            email ? 'Email' : phone ? 'Phone' : 'Username'
          } and password`,
          HttpStatusCode.BAD_REQUEST
        );

      const user = await User.findOne(
        {
          $or: [{ username }, { email }, { phone }],
        },
        {
          name: 1,
          role: 1,
          password: 1,
          status: 1,
          lastSync: 1,
          lastUsed: 1,
        }
      );

      if (!user)
        throw new ThrowError(
          `Invalid ${
            email ? 'Email' : phone ? 'Phone' : 'Username'
          } or Password`,
          HttpStatusCode.UNAUTHORIZED
        );

      if (user.status === 'Blocked')
        throw new ThrowError(`Account blocked! contact Customer Care`, 401);

      if (user && (await user.matchPasswords(password))) {
        if (user.status === IAccountStatus.INACTIVE)
          user.status = IAccountStatus.ACTIVE;
        user.lastSync = new Date();

        await user.save();

        const accessToken = await generateToken({
          id: user._id.toString(),
          name: user.name,
          role: user.role,
        });

        resolve({
          message: 'Login Success',
          results: { token: accessToken },
        });
      } else {
        throw new ThrowError(
          `Invalid ${
            email ? 'Email' : phone ? 'Phone' : 'Username'
          } or Password`,
          HttpStatusCode.UNAUTHORIZED
        );
      }
    } catch (error: any) {
      reject({
        message: error.message || error.msg || 'User login failed',
        statusCode: error.statusCode || HttpStatusCode.INTERNAL_SERVER,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * To register a new user
 * @param newUser { IUser }
 * @returns IUser
 */
export const userRegistration = (newUser: IUser) => {
  return new Promise<ILoginResponse>(async (resolve, reject) => {
    try {
      if (
        !newUser.name ||
        !newUser.username ||
        !newUser.phone ||
        !newUser.email ||
        !newUser.password
      ) {
        return reject({
          message:
            'Please provide valid name, username, phone, email and password',
          statusCode: HttpStatusCode.BAD_REQUEST,
        });
      }

      const isUserFound: IUser[] = await User.find({
        $or: [
          { username: newUser.username.toLocaleLowerCase() },
          { phone: newUser.phone },
          { email: newUser.email.toLocaleLowerCase() },
        ],
      });

      if (isUserFound.length > 0) {
        return reject({
          message:
            isUserFound[0].username == newUser.username
              ? 'Username already exist'
              : isUserFound[0].phone == newUser.phone
              ? 'Phone number already exist'
              : 'Email already exist',
        });
      }

      const user = new User({
        name: newUser.name,
        username: newUser.username.toLocaleLowerCase(),
        phone: newUser.phone,
        email: newUser.email.toLocaleLowerCase(),
        password: newUser.password,
        role: UserRoles.USER,
        lastSync: new Date(),
      });

      const editedUser = await user.save();

      const accessToken = await generateToken({
        id: user._id.toString(),
        name: user.name,
        role: user.role,
      });

      resolve({
        message: 'Registration Success',
        results: { token: accessToken },
      });
    } catch (error: any) {
      reject({
        message: error.message || error.msg || 'User creation failed',
        statusCode: error.statusCode || HttpStatusCode.INTERNAL_SERVER,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * To update a user profile
 * @param {String} userId
 * @param data
 * @returns IUser
 */
export const updateUserProfile = (userId: IUser['_id'], data: IUser) => {
  return new Promise<IUserResponse>(async (resolve, reject) => {
    try {
      if (!userId || !isValidObjectId(userId))
        throw new ThrowError(
          'Provide vaild user id',
          HttpStatusCode.BAD_REQUEST
        );

      const user = await User.findById(userId, {
        name: 1,
        username: 1,
        email: 1,
        phone: 1,
        password: 1,
        status: 1,
        createdAt: 1,
      });
      if (!user)
        throw new ThrowError('User not found', HttpStatusCode.NOT_FOUND);

      const { name, username, email, phone, password } = data;

      // New username is already exist from another user then
      if (username && user.username != username) {
        const userExists = await User.findOne({ username });
        if (userExists)
          throw new ThrowError(
            'Email already exist for other user',
            HttpStatusCode.BAD_REQUEST
          );
      }

      // New email is already exist from another user then
      if (email && user.email != email) {
        const userExists = await User.findOne({ email });
        if (userExists)
          throw new ThrowError(
            'Email already exist for other user',
            HttpStatusCode.BAD_REQUEST
          );
      }

      // New phone is already exist from another user then
      if (phone && user.phone != phone) {
        const userExists = await User.findOne({ phone });
        if (userExists)
          throw new ThrowError(
            'Phone already exist for other user',
            HttpStatusCode.BAD_REQUEST
          );
      }

      user.name = name || user.name;
      user.username = username || user.username;
      user.email = email || user.email;
      user.phone = phone || user.phone;

      if (password) {
        user.password = password;
      }

      const updatedUser = await user.save();

      resolve({
        message: `Profile Updated Successfully`,
        results: updatedUser,
      });
    } catch (error: any) {
      reject({
        message: error.message || error.msg || 'User profile updation failed',
        statusCode: error.statusCode || HttpStatusCode.INTERNAL_SERVER,
        code: error.code || error.names,
      });
    }
  });
};

/**
 * To check a particular user's status
 * @param userId
 * @returns IUser
 */
export const checkUserStatus = (
  userId: IUser['_id'],
  status: IUser['status'][]
) => {
  return new Promise<IUserResponse>(async (resolve, reject) => {
    try {
      if (!userId || !isValidObjectId(userId) || status.length <= 0)
        throw new ThrowError(
          'Provide vaild user id and status',
          HttpStatusCode.BAD_REQUEST
        );

      const user = await User.findOne(
        { _id: userId, isDeleted: false },
        {
          name: 1,
          username: 1,
          email: 1,
          phone: 1,
          password: 1,
          status: 1,
          createdAt: 1,
        }
      );

      if (!user)
        throw new ThrowError('User not found', HttpStatusCode.NOT_FOUND);

      if (user.status === IAccountStatus.INACTIVE)
        user.status = IAccountStatus.ACTIVE;
      const editedUser = await user.save();

      if (status.includes(user.status)) {
        return resolve({
          message: `User is ${user.status}`,
          results: editedUser,
        });
      } else {
        throw new ThrowError(
          `User is ${user.status}`,
          HttpStatusCode.UNAUTHORIZED
        );
      }
    } catch (error: any) {
      reject({
        message: error.message || error.msg || 'Status checking failed',
        statusCode: error.statusCode || HttpStatusCode.INTERNAL_SERVER,
        code: error.code || error.names,
      });
    }
  });
};

/**
 * To delete a user
 * @param userId
 * @returns message
 */
export const deleteUser = (userId: IUser['_id']) => {
  return new Promise<IResponseData>(async (resolve, reject) => {
    try {
      if (!userId || !isValidObjectId(userId))
        throw new ThrowError(
          'Provide valid user id',
          HttpStatusCode.BAD_REQUEST
        );

      const user = await User.findOne(
        {
          _id: userId,
        },
        {
          name: 1,
          username: 1,
          email: 1,
          phone: 1,
          password: 1,
          status: 1,
          createdAt: 1,
        }
      );

      if (!user)
        throw new ThrowError('User not found', HttpStatusCode.NOT_FOUND);

      if (NODE_ENV != 'development')
        throw new ThrowError(
          `In ${NODE_ENV} mode not able to delete permanently!!`,
          HttpStatusCode.FORBIDDEN
        );

      await user.deleteOne();
      resolve({
        message: `${user.username} user was deleted permanently`,
      });
    } catch (error: any) {
      reject({
        message:
          error.message || error.msg || 'User permanently deleting failed',
        statusCode: error.statusCode || HttpStatusCode.INTERNAL_SERVER,
        code: error.code || error.names,
      });
    }
  });
};

/**
 * To delete all user
 * @returns message
 */
export const deleteAllUsers = () => {
  return new Promise<IResponseData>(async (resolve, reject) => {
    try {
      if (NODE_ENV != 'development')
        throw new ThrowError(
          `In ${NODE_ENV} mode not able to delete permanently!!`,
          HttpStatusCode.FORBIDDEN
        );

      await User.deleteMany({});

      resolve({
        message: `All user deleted permanently`,
      });
    } catch (error: any) {
      reject({
        message:
          error.message || error.msg || 'User permanently deleting failed',
        statusCode: error.statusCode || HttpStatusCode.INTERNAL_SERVER,
        code: error.code || error.names,
      });
    }
  });
};
