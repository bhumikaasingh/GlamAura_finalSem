const mongoose=require ('mongoose')



//Making schema
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        require:true
    },
    lastName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    profileImage:{
        type:String,
        require:true
    },
    contactNumber:{
        type:Number,
        require:true
    },
    location:{
        type:String,
        require:true
    },
    role:{
        type:String,
        require:true
    },

})

const User=mongoose.model('User',userSchema)
module.exports=User;