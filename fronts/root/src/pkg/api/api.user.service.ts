import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios'
import appconfig from '../../appconfig'
import store from '../../store/store'
import { logout } from '../../store/slices/auth.slice'
import { getAuthHeader, handlerError } from './api.util'
import type { IUser } from '../types/user'

class ApiTaxonomyService {
  private axiosInstance: AxiosInstance
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: appconfig.backendUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    this.setupInterceptors()
  }
  private setupInterceptors() {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config

        if (originalRequest && error.response?.status === 401 && !(originalRequest as any)._retry) {
          (originalRequest as any)._retry = true
          store.dispatch(logout())
        }
        return Promise.reject(error)
      }
    )
  }
  public async find() {
    return await this.axiosInstance.get(
      `/api/root/users`,
      { headers: getAuthHeader() },
    )
      .then(r => r.data.users)
      .catch(e => handlerError(e))
  }

  public async getMyInfo() {
    return await this.axiosInstance.get<any>(
      `/api/users/me`,
      { headers: getAuthHeader() },
    )
      .then(r => r.data.user)
      .catch(e => handlerError(e))
  }

  public async updateUser({ userId, payload }: { userId: string, payload: Partial<IUser>}) {
    return await this.axiosInstance.put(
      `/api/root/users/${userId}`,
      payload,
      { headers: getAuthHeader() },
    )
    .then(r => r.data.user)
    .catch(e => handlerError(e))
  }

}

export default new ApiTaxonomyService()
