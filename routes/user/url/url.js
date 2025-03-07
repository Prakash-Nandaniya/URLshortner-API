import express from 'express'
import { generateURL,URLinfo,deleteURL } from '../../../controllers/user/url.js'
const router=express.Router()

router.post('/generate',generateURL) 
router.get('/info/:id',URLinfo) 
router.delete('/delete/:id',deleteURL) 

export default router

