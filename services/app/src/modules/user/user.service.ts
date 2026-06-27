import bcrypt from "bcrypt"
import { IUser, User } from "../../models/User.model";
import { ErrorBadRequest } from "../../pkg/errors/errors";

class UserService {
    async find() {
        return await User.find()
    }

    async getMe(id: string) {
        return User.findOne({ _id: id }, { password: 0, __v: 0 });
    }

    public async updateUser({ id, name, psw, featuredServices }: { id: string, name?: string, psw?: string, featuredServices?: string[] }) {
        if (!name && !psw && !featuredServices) throw new ErrorBadRequest("data empty")
        let hashedPsw
        if (psw) {
            hashedPsw = await bcrypt.hash(psw, 6)
        }
    
        return await User.updateOne({ _id: id }, { "$set": { name, psw: hashedPsw, 
            featuredServices: featuredServices
            ? featuredServices
            : undefined
        } })
    }

    public async rootUpdate({ id, payload }: { id: string, payload: Partial<IUser> }) {
        let hashedPsw
        if (payload.psw) {
            hashedPsw = await bcrypt.hash(payload.psw, 6)
        }

        return await User.updateOne({ _id: id }, { "$set": { ...payload, 
            psw: hashedPsw, 
            featuredServices: payload.featuredServices
            ? payload.featuredServices
            : undefined
        } })
    }
}

export default new UserService()