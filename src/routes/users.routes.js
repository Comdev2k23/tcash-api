import express from 'express'
import {  getUserById, updateUserBalance } from '../controllers/user.controller.js';

const userRouter = express.Router()


userRouter.get('/:userId', getUserById);
userRouter.post('/update-user', updateUserBalance)

export default userRouter