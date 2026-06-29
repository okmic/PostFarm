import { IUser, User } from "../../models/User.model"
import bcrypt from "bcrypt"
import { v4 } from "uuid"
import { ErrorBadRequest } from "../../pkg/errors/errors"
import { ReferralLink } from "../../models/ReferralLink.model"
import { SignupCode } from "../../models/SignupCode.model"
import { sendYandexEmail } from "../mailer/yandex.mailer.util"
import appconfig from "../../pkg/config/appconfig"
class SignService {

  public async signup({ name, email, psw, refCode }: { name: string, email: string, psw: string, refCode?: string }): Promise<IUser> {
    try {
      const findUser = await User.findOne({ email })
      let user
      if (!findUser) {
        const hashedPsw = await bcrypt.hash(psw, 6)
        user = await this.createUser({ email, name, hashedPsw, refCode })
      } else {
        user = findUser
      }
      const verifyCode = v4()
      console.log(
              await SignupCode.create({
        userId: user._id,
        code: verifyCode
      })
      )

      const verifyUrl = `${appconfig.adminClientURI}/signup/verify/${verifyCode}`
      const html = `
<div style="font-family: 'Inter', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #1E3A1E; border-radius: 16px; color: #fff;">
  <div style="text-align: center; margin-bottom: 32px;">
    <h1 style="font-size: 24px; font-weight: 300; margin: 0; color: #fff;">
      Пост<span style="color: #FFA726;">Ф</span>ерма
    </h1>
  </div>
  <h2 style="font-size: 20px; font-weight: 400; margin: 0 0 12px; color: #fff;">
    Привет, ${name}!
  </h2>
  <p style="font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.6); margin: 0 0 24px;">
    Остался последний шаг — подтвердите вашу почту чтобы начать пользоваться AI-инструментами для создания контента.
  </p>
  <div style="text-align: center; margin-bottom: 32px;">
    <a href="${verifyUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #4CAF50, #FFA726); color: #fff; text-decoration: none; border-radius: 12px; font-size: 14px; font-weight: 500;">
      Подтвердить почту
    </a>
  </div>
  <p style="font-size: 12px; line-height: 1.6; color: rgba(255,255,255,0.3); margin: 0 0 8px;">
    Если кнопка не работает, скопируйте ссылку:
  </p>
  <p style="font-size: 11px; line-height: 1.6; color: rgba(255,255,255,0.2); margin: 0 0 24px; word-break: break-all; font-family: monospace;">
    ${verifyUrl}
  </p>
  <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 24px;">
    <p style="font-size: 11px; color: rgba(255,255,255,0.2); margin: 0;">
      Ссылка действительна 24 часа. Если вы не регистрировались в ПостФерма, просто проигнорируйте это письмо.
    </p>
    <p style="font-size: 11px; color: rgba(255,255,255,0.15); margin: 8px 0 0;">
      ПостФерма • Выращиваем контент автоматически
    </p>
  </div>
</div>`

      await sendYandexEmail({
        to: email,
        subject: 'Подтвердите почту в ПостФерма 🌱',
        text: `Привет, ${name}!\n\nПодтвердите почту перейдя по ссылке:\n${verifyUrl}\n\nСсылка действительна 24 часа.\n\nПостФерма • Выращиваем контент автоматически`,
        html: html.replace(/\n/g, '')
      })

      return user
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async createUser({ email, hashedPsw, name, refCode }: { email: string, hashedPsw: string, name: string, refCode?: string }) {
    let user
    if (refCode) {
      const referralCode = await ReferralLink.findOne({ code: refCode })
      if (
        referralCode
        && referralCode.active
        && referralCode.createdByLink < referralCode.creationLimit
      ) {
        user = await User.create({
          name, email, psw: hashedPsw, role: referralCode.role, rate: referralCode.rate, userCheckEnteredMail: true
        })
        await ReferralLink.updateOne({ _id: referralCode._id }, { "$set": { createdByLink: referralCode.createdByLink + 1 } })
      } else {
        throw new ErrorBadRequest("Реферальная ссылка недействительна или устарела")
      }
    } else {
      user = await User.create({
        name, email, psw: hashedPsw, userCheckEnteredMail: true
      })
    }

    return user
  }

  async signupVerifyCode(code: string) {
    try {
      const signupCode = await SignupCode.findOne({ code })
      if (!signupCode) {
        throw new ErrorBadRequest("Неверный код регистрации")
      }

      const user = await User.findById(signupCode.userId)
      if (!user) {
        throw new ErrorBadRequest("Пользователь не найден")
      }

      await User.updateOne({ _id: user._id }, { "$set": { userCheckEnteredMail: false } })
      await SignupCode.deleteOne({ _id: signupCode._id })
      await SignupCode.deleteMany({ userId: user._id })

      return user
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}

export default new SignService()

