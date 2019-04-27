const moment = require('moment')
const { Op } = require('sequelize')
const { Appointment, User } = require('../models')

class ScheduleController {
  async index (req, res) {
    const currentDate = moment()
    const initialDate = currentDate.startOf('day')
    const finalDate = currentDate.endOf('day')

    const appointments = await Appointment.findAll({
      include: [{ model: User, as: 'user' }],
      where: {
        provider_id: req.session.user.id,
        date: {
          [Op.between]: [initialDate.format(), finalDate.format()]
        }
      }
    })

    return res.render('schedule/index', { appointments })
  }
}

module.exports = new ScheduleController()
