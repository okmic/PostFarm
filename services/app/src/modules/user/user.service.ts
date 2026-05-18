import { User } from "../../models/User.model";

class UserService {
    async getMe(id: string) {
        return User.findOne({ _id: id }, { password: 0, __v: 0 });
    }
}

export default new UserService()