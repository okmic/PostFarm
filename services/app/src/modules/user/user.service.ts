import bcrypt from "bcrypt"
import { User } from "../../models/User.model";
import { ErrorBadRequest } from "../../pkg/errors/errors";

class UserService {
    async getMe(id: string) {
        return User.findOne({ _id: id }, { password: 0, __v: 0 });
    }

    public async updateUser({ id, name, psw }: { id: string, name?: string, psw?: string }) {
        if (!name && !psw) throw new ErrorBadRequest("data empty")
        let hashedPsw
        if (psw) {
            hashedPsw = await bcrypt.hash(psw, 6)
        }
    
        return await User.updateOne({ _id: id }, { "$set": { name, psw: hashedPsw } })
    }
}

export default new UserService()