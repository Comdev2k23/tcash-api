import express from 'express'
import { authMiddleware, validateUserExists } from '../middlewares/auth.middleware.js';
import {  getUserById, updateUser } from '../controllers/user.controller.js';
const userRouter = express.Router()


userRouter.get('/:userId', getUserById);
userRouter.put('/update-user', updateUser)

export default userRouter