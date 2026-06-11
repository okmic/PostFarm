import { IUser, User } from "../../models/User.model"
import bcrypt from "bcrypt"
import { ErrorForbidden } from "../../pkg/errors/errors"

class SignService {

  public async signup({ name, email, psw }: { name: string, email: string, psw: string }): Promise<IUser> {
      const findUser = await User.findOne({ email })
      if(findUser) throw new ErrorForbidden("Пользователь уже существует")

      const hashedPsw = await bcrypt.hash(psw, 6)

      const user = await User.create({
         name, email, psw: hashedPsw
      })

      return user
  }
}

export default new SignService()

