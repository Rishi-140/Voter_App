const express = require('express')
const router = express.Router()
const User = require('./../Models//user');
require('dotenv').config()
const {jwtAuthMiddleware,generateToken} = require('./../jwt');
const { json } = require('body-parser');
const Candidate = require('./../Models/candidate');

const CheckAdminrole=async (userid)=>{
    try{
    const user= await User.findById(userid)
    if(user.role==='admin'){
        return true;
    }
     

    }catch(err){
        return false;
    }


}

router.post('/',jwtAuthMiddleware, async (req, res) => {
    try {

        if(!await CheckAdminrole(req.user.id))
            return res.status(403).json({message:'User not have a Admin Role'})
        

        const data = req.body
        const newCandidate = new Candidate(data);
        const response = await newCandidate.save();
        console.log('Data Saved');
        res.status(200).json({ response: response});
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Issue' })

    }

});



router.put('/:CandidateID',jwtAuthMiddleware,async (req, res) => {
    try {
       
         if(!CheckAdminrole(req.user.id))
            return res.status(403).json({message:'User not have a Admin Role'})


            const updateCandidatedata = req.body;
            const Candiadteid = req.params.CandidateID;
            //const nameToFind = req.body.age;
            
            const response = await Candidate.findByIdAndUpdate({_id: Candiadteid},
                updateCandidatedata, {
                new: true,//return the update document
                runValidators: true,//run the mongoose validation 
            })
            if (!response) {
                return res.status(404).json({ error: "Candidate not found" })
            }
            console.log("data upadate")
            // res.status(200).json(response)
            res.status(200).json({sucess: "data updated"})


    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal server issue' })

    }

})
router.delete('/:CandidateID',jwtAuthMiddleware, async (req, res) => {
    try {

        if(!CheckAdminrole(req.user.id))
            return res.status(403).json({message:'User not have a Admin Role'})
        const deleteid = req.params.CandidateID;
        const response = await Candidate.findByIdAndDelete(deleteid)
        if (!response) {
            return res.status(404).json({ error: "Candidate not found" })
        }
        console.log("person deleted")
        res.status(200).json({ error: 'deleted successfully' })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal server issue' })

    }

}) 

router.post('/vote/:CandidateID', jwtAuthMiddleware,async(req,res)=>{
    
        const userid= req.user.id
        const candidateid=req.params.CandidateID
    try{
        const candidate= await Candidate.findById(candidateid)
        if(!candidate){

            return res.status(404).json({message:'Candidate not found'})
        }
        const userr = await User.findById(userid)
        if(!userr){

            return res.status(404).json({message:'User not found'})

        }
        if(userr.isVoted){
            res.status(400).json({message:"You have already voted"})
        }
        if(userr.role==='admin'){
            res.status(403).json({message:"Admin Cannot Vote"})
        }
        candidate.votes.push({user:userid})
        candidate.voteCount++
        await candidate.save()

        userr.isVoted=true
        await userr.save()

        res.status(200).json({message:"Vote recorded Successfully"})




    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Internal server issue' })

    }

})

router.get('/vote/count',async(req,res)=>{
    try{
        const candidate= await Candidate.find().sort({voteCount:'desc'})
        const candidatecount= candidate.map((data)=>{
            return{
                party: data.party,
                count: data.voteCount
            }
        })

    }catch(err){


        console.log(err)
        res.status(500).json({ error: 'Internal server issue' })
    }
})



module.exports = router;
