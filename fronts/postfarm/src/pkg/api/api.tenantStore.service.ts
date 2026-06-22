import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios'
import appconfig from '../../appconfig'
import store, { type RootState } from '../../store/store'
import { logout } from '../../store/slices/auth.slice'
import { getAuthHeader, handlerError } from './api.util'

class ApiTenantStoreService {
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

  public async getPosts(): Promise<RootState["tenantStore"]["posts"]> {
    return await this.axiosInstance.get(
      `/api/posts`,
      { headers: getAuthHeader() },
    )
      .then(r => r.data.posts)
      .catch(e => handlerError(e))
  }

  public async usageTokens(): Promise<RootState["tenantStore"]["usageTokens"]> {
    return await this.axiosInstance.get(
      `/api/ai/usage-tokens`,
      { headers: getAuthHeader() },
    )
      .then(r => r.data.usageTokens)
      .catch(e => handlerError(e))
  }
}

export default new ApiTenantStoreService()
