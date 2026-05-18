import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify'
import { User } from '../../models/User.model'
import { errorResponse } from '../../pkg/request/response.handler'
import signService from './sign.service'
import { ErrorBadRequest, ErrorNotAuth } from '../../pkg/errors/errors'
import appInstance from '../../pkg/appInstance/appInstance'

class SignController {
  async signin(req: FastifyRequest<{ Body: { email: string, psw: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { email, psw } = req.body
      if (!email || !psw) throw new ErrorBadRequest("Неверные данные")
      const user = await User.findOne({ email })
      if (!user) throw new ErrorNotAuth("Пользователь не найден")
      //проверка на совподения пароля

     const access = appInstance.getInstance().jwt.sign({ id: String(user._id), role: user.role, rate: "0" }, { expiresIn: "15d" })
      const refresh = appInstance.getInstance().jwt.sign({ id: String(user._id), role: user.role, rate: "0" }, { expiresIn: "30d" })

      return reply
        .setCookie(
          'refreshToken',
          refresh,
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 30 * 24 * 60 * 60
          }
        )
        .status(200)
        .send({
          status: 'success',
          auth: true, accessToken: access, refreshToken: refresh
        })

    } catch (e) {
      console.error(e)
      return errorResponse(e, reply)
    }
  }

  async signup(req: FastifyRequest<{ Body: { name: string, email: string, psw: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const { name, email, psw } = req.body
      const user = await signService.signup({ name, email, psw })
      const access = appInstance.getInstance().jwt.sign({ id: String(user._id), role: user.role, rate: "0" }, { expiresIn: "15d" })
      const refresh = appInstance.getInstance().jwt.sign({ id: String(user._id), role: user.role, rate: "0" }, { expiresIn: "30d" })
      
      return reply
        .setCookie(
          'refreshToken',
          refresh,
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 30 * 24 * 60 * 60
          }
        )
        .status(200)
        .send({
          msg: "Пользователь успешно зарегистрирован",
          status: 'success',
          auth: true, accessToken: access, refreshToken: refresh, user: { ...user, psw: undefined }
        })
    } catch (e) {
      return errorResponse(e, reply, "Пользователь уже существует")
    }
  }
}

export default new SignController()
