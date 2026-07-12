import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios'
import appconfig from '../../appconfig'
import store from '../../store/store'
import { logout } from '../../store/slices/auth.slice'
import { getAuthHeader, handlerError } from './api.util'
import type { EducationContentEnum, EducationLevelEnum, HeadlineContentEnum, HeadlineStyleEnum, PostChannelContentToneEnum, PostChannelContentTypeEnum, PostChronicleTypeEnum } from "../../../../../pkg/types/ai.text.types"
import { setAiLimitIsOver } from '../../store/slices/tenantStore.slice'

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
        } else if(originalRequest && error.response?.status === 469) {
          store.dispatch(setAiLimitIsOver(true))
        }
        return Promise.reject(error)
      }
    )
  }
  public async postChronicle(payload: { type: PostChronicleTypeEnum, text: string, userId: string, prompt?: string}): Promise<string> {
    return await this.axiosInstance.post(
      `/api/ai/text/post-chronicle`,
      { type: payload.type, text: payload.text, userId: payload.userId, prompt: payload.prompt },
      { headers: getAuthHeader() },
    )
      .then(r => r.data.text)
      .catch(e => handlerError(e))
  }

  public async chanelContent(payload: { text: string, type: PostChannelContentTypeEnum, tone: PostChannelContentToneEnum, userId: string, prompt: string }): Promise<string> {
    return await this.axiosInstance.post(
      `/api/ai/text/channel-content`,
      { text: payload.text, type: payload.type, tone: payload.tone, userId: payload.userId, prompt: payload.prompt },
      { headers: getAuthHeader() },
    )
      .then(r => r.data.text)
      .catch(e => handlerError(e))
  }

  public async viralHeadlines(payload: { topic: string, type: HeadlineContentEnum, style: HeadlineStyleEnum, userId: string, prompt?: string }): Promise<string> {
    return await this.axiosInstance.post(
      `/api/ai/text/viral-headlines`,
      { topic: payload.topic, type: payload.type, style: payload.style, userId: payload.userId, prompt: payload.prompt },
      { headers: getAuthHeader() },
    )
      .then(r => r.data.text)
      .catch(e => handlerError(e))
  }

  public async educationPost(payload: { topic: string, type: EducationContentEnum, level: EducationLevelEnum, userId: string, prompt?: string }): Promise<string> {
    return await this.axiosInstance.post(
      `/api/ai/text/education-post`,
      { topic: payload.topic, type: payload.type, level: payload.level, userId: payload.userId, prompt: payload.prompt },
      { headers: getAuthHeader() },
    )
      .then(r => r.data.text)
      .catch(e => handlerError(e))
  }
}

export default new ApiAiService()
