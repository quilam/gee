import User from '../models/user'
import extend from 'lodash/extend'
import errorHandler from './error.controller'

const create = async (req, res) => {
    const user = new User(req.body)
    try {
      await user.save()
      return res.status(200).json({
        message: "Successfully signed up!"
      })
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}
const list = async (req, res) => {
    try {
        let users = await User.findAll({
            attributes: [
              'id', 'name', 'username', 'email','createdAt','updatedAt']})
      res.json(users)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  }
  const userByID = async (req, res, next, id) => {
    try {
        let user = await User.findAll({
            where: {
              id: id}})
      if (!user)
        return res.status('400').json({
          error: "User not found"
        })
        req.profile = user
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve user"
    })
  }
}
const read = (req, res) => {
    req.profile.password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
  }
  const update = async (req, res) => {
    try {
      let user = req.profile
      user = extend(user, req.body)
      user.updatedAt = Date.now()
      await user.save()
      user.password = undefined
      user.salt = undefined
      res.json(user)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          })
        }
      }
const remove = async (req, res) => {
        try {
          let user = req.profile
          let deletedUser = await user.remove()
          deletedUser.password = undefined
          deletedUser.salt = undefined
          res.json(deletedUser)
        } catch (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
  }

export default { create, userByID, read, list, remove, update }