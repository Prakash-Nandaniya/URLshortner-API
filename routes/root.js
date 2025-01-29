import express from 'express'
import {mainHome} from '../controllers/home.js'
import auth from './auth/auth.js'
import user from './user/user.js'
import {authentication} from '../middlewares/auth.js'
import { redirectURL } from '../controllers/user/url.js'

const router=express.Router()

router.get('/:id',redirectURL) 
router.use('/auth',auth)
router.use('/user',authentication,user)
router.get('/',mainHome) 

export default router

