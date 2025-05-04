import jwt from 'jsonwebtoken'


//this function will generate token

export const gentoken=(payload)=>{
return jwt.sign(payload , process.env.JWT_SECRET , {expiresIn:'14d'});
}


//this will verify the token 

export const vertoken = async (token)=>{
try {
    // console.log("vertoken ",token)
    const vt = jwt.verify(token , process.env.JWT_SECRET); 
    // console.log("result -->",vt)
    return vt; 
} catch (error) {
    throw new Error('your given token is invalid');
}
}

