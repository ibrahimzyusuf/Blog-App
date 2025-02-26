const jwt=require('jsonwebtoken')

const verifyToken=(req,res,next)=>{
    if (req.headers.authorization) {
        try {
            const token=req.headers.authorization.split(' ')[1]
            const decodedToken= jwt.verify(token,process.env.JWT_SECRET)
            req.user=decodedToken
            next()
        } catch (error) {
            return res.status(401).json({message:'Invalid token, Access denied'})
        }
    } else {
        return res.status(401).json({message:'No token provided, Access denied'})
    }
}

const verifyTokenAndAdmin=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if (req.user.isAdmin) {
            next()
        } else {
            return res.status(403).json({message:'Not allowed, only admin'})
        }
    })
}

const verifyTokenAndUserHimself=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if (req.user.id===req.params.id) {
            next()
        } else {
            return res.status(403).json({message:'Not allowed, only user himself'})
        }
    })
}

const verifyTokenAndAuthorization=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if (req.user.id===req.params.id||req.user.isAdmin) {
            next()
        } else {
            return res.status(403).json({message:'Not allowed, only user himself and admin'})
        }
    })
}

module.exports={verifyToken,verifyTokenAndAdmin,verifyTokenAndUserHimself,verifyTokenAndAuthorization}