import User from '../models/user'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from './../../config/config'

const signin = async (req, res) => {
    try {
      let user = await User.findOne({  where: {email : req.body.email }})
      if (!user)
        return res.status('401').json({ error: "User not found" })
  
      if (!user.authenticate(req.body.password)) {
        return res.status('401').send({ error: "Email and password don't match." })
      }
      const token = jwt.sign({ id: user.id }, config.jwtSecret)
      res.cookie('t', token, { expire: new Date() + 9999 })

      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      })
    } catch (err) {
      return res.status('401').json({ error: "Could not sign in" })
    }
  }
      
  const signout = (req, res) => {
    res.clearCookie("t")
    return res.status('200').json({
      message: "signed out"
    })
  }
//const requireSignin = … 
   const requireSignin = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'auth',
    algorithms: ['RS256']
  })


  const hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile.id ==  req.auth.id
    if (!(authorized)) {
      return res.status('403').json({
        error: "User is not authorized"
      })
    }
    next()
  }

 


export default { signin, signout, requireSignin, hasAuthorization }