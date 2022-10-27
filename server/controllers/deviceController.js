const uuid = require('uuid')
const path = require('path')
const { Device } = require('../models/models')
const ApiError = require('../error/ApiError')

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = req.body
      const { img } = req.files
      let fileName = uuid.v4() + ".jpg"
      img.mv(path.resolve(__dirname, '..', 'static', fileName))
      const device = await Device.create({ name, price, brandId, typeId, img: fileName })
      return res.json(device)
    } catch (err) {
      next(ApiError.badRequest(err.message))
    }

  }
  async getAll(req, res) {
    let { brandId, typeId, limit, page } = req.query
    let devices;
    page = page || 1;
    limit = limit || 9;
    let offeset = page * limit - limit
    if (!brandId && !typeId) {
      devices = await Device.findAll()
    }
    if (brandId && !typeId) {
      devices = await Device.findAll({ where: { brandId } })
    }
    if (!brandId && typeId) {
      devices = await Device.findAll({ where: { typeId } })
    }
    if (brandId && typeId) {
      devices = await Device.findAll({ where: { typeId, brandId } })
    }
    return res.json(devices)
  }
  async getOne(req, res) {
    const device = await Device.findOne()
    return res.json
  }
}

module.exports = new DeviceController()
