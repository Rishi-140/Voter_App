const express = require('express')
const router = express.Router()
const User = require('./../Models/user');
require('dotenv').config()
const {jwtAuthMiddleware,generateToken} = require('./../jwt');
const { json } = require('body-parser');

router.post('/signup', async (req, res) => {
    try {
        const data = req.body
        const adminUser=await User.findOne({role:'admin'})
        if(data.role==='admin'&& adminUser){
             return res.status(400).json({ error: 'Admin user already exists' });
        }
        const newUser = new User(data);
        const response = await newUser.save();
        console.log('Data Saved');
        const payload={id : response.id}
        console.log(JSON.stringify(payload))
        const token = generateToken(payload)
        console.log("Token is :", token)
        res.status(200).json({ response: response , token :token });
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Issuee' })

    }

});

router.post('/login', async(req,res)=>{
    try{

        const {aadharCardNumber,password}=req.body;
        const user = await User.findOne({aadharCardNumber:aadharCardNumber})
        if(!user||!(await user.comparePassword(password))){

            return res.status(401).json({error:'Invalid username or password'})
        }
        const payload={id : user.id,username :user.username}
        const token= generateToken(payload)
        res.json({token})


    }catch(err){

        console.log(err)
        res.status(500).json({error:'Internal Server error'})
    }

})

router.get('/profile',jwtAuthMiddleware, async (req, res) => {

    try {
        const dataid=req.user
        const datar=dataid.id
        const data = await User.findOne({_id :datar})
        console.log("fetched Succesfully");
        res.status(200).json(data)

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Issue' })

    }
})



router.put('/profile/password',jwtAuthMiddleware,async (req, res) => {
    try {
        //const personid = req.params.id;
        const {currentPassword,newPassword} = req.body;
        const Userid = req.user.id;
        const user= await User.findById(Userid)
        if(!(await user.comparePassword(currentPassword))){

            return res.status(401).json({error:'Invalid username or password'})
        }
        user.password=newPassword;
        await user.save()
        
        console.log("Password upadate")
        // res.status(200).json(response)
        res.status(200).json({mesage: "Password updated" })


    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal server issue' })

    }

})



module.exports = router;
