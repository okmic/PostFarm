import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios'
import appconfig from '../../appconfig'
import store from '../../store/store'
import { logout } from '../../store/slices/auth.slice'
import { getAuthHeader, handlerError } from './api.util'

export interface IReferralLink {
  _id: string
  date: string
  code: string
  creationLimit: number
  createdByLink: number
  active: boolean
  source: string
  rate: number
  role: string
}

class ApiReferralLinkService {
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
      `/api/root/referral-links`,
      { headers: getAuthHeader() },
    )
      .then(r => r.data.links)
      .catch(e => handlerError(e))
  }

  public async create(data: {
    code: string
    creationLimit: number
    source: string
    rate: number
    role: string
  }) {
    return await this.axiosInstance.post(
      `/api/root/referral-links`,
      data,
      { headers: getAuthHeader() },
    )
      .then(r => r.data.link)
      .catch(e => handlerError(e))
  }

  public async update(id: string, data: Partial<IReferralLink>) {
    return await this.axiosInstance.put(
      `/api/root/referral-links/${id}`,
      data,
      { headers: getAuthHeader() },
    )
      .then(r => r.data.link)
      .catch(e => handlerError(e))
  }

  public async remove(id: string) {
    return await this.axiosInstance.delete(
      `/api/root/referral-links/${id}`,
      { headers: getAuthHeader() },
    )
      .then(r => r.data)
      .catch(e => handlerError(e))
  }
}

export default new ApiReferralLinkService()
