import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios'
import appconfig from '../../appconfig'
import store from '../../store/store'
import { logout } from '../../store/slices/auth.slice'
import { getAuthHeader, handlerError } from './api.util'
import type { PostChannelContentToneEnum, PostChannelContentTypeEnum, PostChronicleTypeEnum } from "../../../../../pkg/types/ai.text.types"

class ApiAiService {
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
  public async postChronicle(payload: { type: PostChronicleTypeEnum, text: string }): Promise<string> {
    return await this.axiosInstance.post(
      `/api/ai/text/post-chronicle`,
      { type: payload.type, text: payload.text },
      { headers: getAuthHeader() },
    )
      .then(r => r.data.text)
      .catch(e => handlerError(e))
  }

  public async chanelContent(payload: { text: string, type: PostChannelContentTypeEnum, tone: PostChannelContentToneEnum }): Promise<string> {
    return await this.axiosInstance.post(
      `/api/ai/text/channel-content`,
      { text: payload.text, type: payload.type, tone: payload.tone },
      { headers: getAuthHeader() },
    )
      .then(r => r.data.text)
      .catch(e => handlerError(e))
  }

}

export default new ApiAiService()
