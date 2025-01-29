import express from 'express'
import {userHome} from '../../controllers/user/home.js'
import url from './url/url.js'

const router=express.Router()

router.get('/:id',userHome) 
router.use('/url',url) 

export default router