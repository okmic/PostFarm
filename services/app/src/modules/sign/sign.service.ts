import { IUser, User } from "../../models/User.model"
import bcrypt from "bcrypt"
import { ErrorBadRequest, ErrorForbidden } from "../../pkg/errors/errors"
import { ReferralLink } from "../../models/ReferralLink.model"

class SignService {

  public async signup({ name, email, psw, refCode }: { name: string, email: string, psw: string, refCode?: string }): Promise<IUser> {
    try {
      const findUser = await User.findOne({ email })
      if(findUser) throw new ErrorForbidden("Пользователь уже существует")
      const hashedPsw = await bcrypt.hash(psw, 6)
      let user
      if(refCode) {
        const referralCode = await ReferralLink.findOne({ code: refCode })
        if(
          referralCode 
          && referralCode.active
          && referralCode.createdByLink < referralCode.creationLimit
        ) {
          user = await User.create({
            name, email, psw: hashedPsw, role: referralCode.role, rate: referralCode.rate,
          })
          await ReferralLink.updateOne({ _id: referralCode._id }, { "$set": { createdByLink: referralCode.createdByLink + 1 } })
        } else {
          throw new ErrorBadRequest("Реферальная ссылка недействительна или устарела")
        }
      } else {
        user = await User.create({
          name, email, psw: hashedPsw
        })
      }

      return user
    } catch (e) {
      throw e
    }
  }
}

export default new SignService()

