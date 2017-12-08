const express=require('express')
const router=express.Router()

app.get('/users/:name',(req,res)=>{
    res.send(`hello~${req.params.name}`)
})

module.exports=router