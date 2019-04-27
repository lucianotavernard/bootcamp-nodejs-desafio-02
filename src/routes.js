const express = require('express')
const multerConfig = require('./config/multer')
const upload = require('multer')(multerConfig)

const routes = express.Router()

const authMiddleware = require('./app/middlewares/auth')
const guestMiddleware = require('./app/middlewares/guest')

const controllers = require('./app/controllers')

routes.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success')
  res.locals.flashError = req.flash('error')

  return next()
})

routes.get('/files/:file', controllers.FileController.show)

routes.get('/', guestMiddleware, controllers.SessionController.create)
routes.post('/signin', controllers.SessionController.store)

routes.get('/signup', guestMiddleware, controllers.UserController.create)
routes.post(
  '/signup',
  upload.single('avatar'),
  controllers.UserController.store
)

routes.use('/app', authMiddleware)

routes.get('/app/logout', controllers.SessionController.destroy)

routes.get('/app/dashboard', controllers.DashboardController.index)

routes.get(
  '/app/appointments/new/:provider',
  controllers.AppointmentController.create
)
routes.post(
  '/app/appointments/new/:provider',
  controllers.AppointmentController.store
)

routes.get('/app/available/:provider', controllers.AvailableController.index)

routes.get('/app/schedule', controllers.ScheduleController.index)

module.exports = routes
