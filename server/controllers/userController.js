const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Basket } = require('../models/models')

const genetateJwt = (id, email, role) => {
  return jwt.sign(
    { id, email, role },
    process.env.SECRET_KEY,
    { expiresIn: '24h' }
  )
}
class UserController {
  async registration(req, res, next) {
    const { email, password, role } = req.body
    if (!email || !password) {
      return next(ApiError.badRequest('Email or password is not correct'))
    }
    const candidate = await User.findOne({ where: { email } })
    if (candidate) {
      return next(ApiError.badRequest('This user is already registered in the database'))
    }
    const hashPassword = await bcrypt.hash(password, 5)
    const user = await User.create({ email, role, password: hashPassword })
    const basket = await Basket.create({ userId: user.id })
    const token = genetateJwt(user.id, user.email, user.role)
    return res.json({ token })
  }
  async login(req, res, next) {
    console.log("====================================>");
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return next(ApiError.internal('User not found'))
    }
    let comparePassword = bcript.compareSync(password, user.password)
    if (!comparePassword) {
      return next(ApiError.internal('Password is not correct'))
    }
    const token = genetateJwt(user.id, user.email, user.role)
    return res.json({ token })
  }
  async check(req, res, next) {
    const { id } = req.query
    if (!id) {
      return next(ApiError.badRequest('ID not found'))
    }
    res.json(id)
  }
}

module.exports = new UserController()
