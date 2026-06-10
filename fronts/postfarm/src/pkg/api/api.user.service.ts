import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios'
import appconfig from '../../appconfig'
import store from '../../store/store'
import { logout } from '../../store/slices/auth.slice'
import { getAuthHeader, handlerError } from './api.util'

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
      `/api/users`,
      { headers: getAuthHeader() },
    )
      .then(r => r.data.data.users)
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

  public async updateUser({ name, psw, featuredServices}: { name?: string, psw?: string, featuredServices?: string[] }) {
    return await this.axiosInstance.put(
      '/api/users/me',
      { name, psw, featuredServices },
      { headers: getAuthHeader() },
    )
    .then(r => r.data.user)
    .catch(e => handlerError(e))
  }

}

export default new ApiTaxonomyService()
