// make a function (Logic)
const userModel = require('../models/userModel')
const rateLimit = require('express-rate-limit');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
// 1. Creating user function
const createUser = async (req, res) => {
    //1. Get data from the user (Fname,lname, email,pp)

    //#.Dstructuring
    const { firstName, lastName, email, password } = req.body;

    //2. validation 
    if (!firstName || !lastName || !email || !password) {
        return res.json({
            "success": false,
            "message": "Please enter all fields!"
        })
    }                                                        // != first name xaina vanye hunxa meaning 
    //try- catch (error Handling)
    try {
        //check if the user is already exist
        const existingUser = await userModel.findOne({ email: email })
        if (existingUser) {
            return res.json({
                "success": false,
                "message": "User Already Exists!"
            })
        }


        // Hash /encrypt the password
        const randomSalt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, randomSalt)

        //Save the user in database 
        const newUser = new userModel({
            //Fields:Values received from user 
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashPassword,

        })

        //Actually save the user in database 
        await newUser.save()             //certain time launa sakxa VANYE Await launye ho


        // Send the success response
        res.json({
            "success": true,
            "message": "User created successfully"
        })


    } catch (error) {
        console.log(error)                               //resposce pathai ra ko ho catch ma 
        res.json({
            "success": false,
            "message": "internal Server Error!"

        })

    }

}
// 2.login user function 

// Rate limiting middleware for login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    message: { success: false, message: "Too many login attempts, please try again later" }
});

// Login user function
const loginUser = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    console.log(email, password);

    if (!email || !password) {
        return res.json({
            "success": false,
            "message": "Please enter all fields!"
        });
    }

    try {
        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.json({
                "success": false,
                "message": "User not found!"
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.json({
                "success": false,
                "message": "Incorrect password!"
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            "success": true,
            "message": "Login Successful",
            "token": token,
            "csrfToken": req.csrfToken(), // Send CSRF token for frontend usage
            "userData": user
        });

    } catch (error) {
        console.log(error);
        res.json({
            "success": false,
            "message": "Internal server error!"
        });
    }
};

const profileUser = async (req, res) => {

    const { id } = req.params

    

    try {
        const user = await userModel.findById(id);
        console.log("id", id); // Log the user ID
        console.log("Fetched user:", user); // Log the user object

        res.status(200).json({
            "success": true,
            "user": user
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            "success": false,
            "message": "Internal server error!",
            error: error.message


        })
    }


}
const updateUser = async (req, res) => {
    try {
        // Handle profile image upload if provided
        if (req.files && req.files.profileImage) {
            const { profileImage } = req.files;
            const fileName = profileImage.name;
            const path = `${__dirname}/../public/profile/${fileName}`;

            // Move uploaded file to specified path
            await profileImage.mv(path);

            // Update req.body with profileImage field
            req.body.profileImage = fileName;

            // Remove previous profile image if exists
            const existingUser = await userModel.findById(req.params.id);
            if (existingUser.profileImage) {
                const oldPath = `${__dirname}/../public/profile/${existingUser.profileImage}`;
                fs.unlinkSync(oldPath);
            }
        }

        // Update user information in the database
        const updatedUser = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Return success response with updated user data
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            updateUser: updatedUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}


// get all user 
const getAllUser = async (req, res) => {
    try {
        const users = await userModel.find()
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

// delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        await userModel.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: "User deleted"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

// exporting 
module.exports = {
    createUser,
    loginUser:  [loginLimiter, loginUser], 
    profileUser,
    updateUser,
    getAllUser,
    deleteUser
}