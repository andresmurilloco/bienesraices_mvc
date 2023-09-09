import express from 'express'

const router = express();

router.get('/', (req, res)=>{
    res.json({msg:'Hola mundo en express'});
})

router.post('/', (req, res)=>{
    res.json({msg:'Respuesta de tipo Post'});
})
export default router;