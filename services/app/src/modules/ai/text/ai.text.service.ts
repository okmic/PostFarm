import axios from 'axios';
import { ErrorForbidden } from '../../../pkg/errors/errors'
import { Types } from 'mongoose';
import { Post } from '../../../models/Post.model';
import { AITokens } from '../../../models/AITokens.model';
import { ServicesTypeEnum } from '../../../../../../pkg/types/ai.text.types';
import { logger } from '../../../pkg/logger/logger.service';
import OpenAI from 'openai';
import appconfig from '../../../pkg/config/appconfig';

class YandexGptTextService {
  public async YGpt(
    props: {
      'prompt': string | null
      'msg': string
      "userId": Types.ObjectId | string
      "service": ServicesTypeEnum
    }
  ): Promise<{ text: string, usageTokens: number }> {
    const result = await this.toGpt(
      props.prompt, props.msg,
    );

    const post = await Post.create({
      content: result.text,
      isAI: true,
      userId: props.userId,
    })

    await AITokens.create({
      usageTokens: result.usageTokens,
      beforeText: props.msg,
      afterText: result.text,
      type: "text",
      ai: "yandex",
      userId: props.userId,
      postId: post._id,
      service: props.service
    })

    return result;
  }

  private async toGpt(prompt: string | null, msg: string): Promise<{ text: string, usageTokens: number }> {

    const client = new OpenAI({
      apiKey: appconfig.services.ai.text.yandex.openAIApiKey,
      baseURL: 'https://ai.api.cloud.yandex.net/v1',
      defaultHeaders: {
        'OpenAI-Project': appconfig.services.ai.text.yandex.openAIProjectId
      }
    });

    const response = await client.responses.create({
      instructions: prompt,
      prompt: {
        id: appconfig.services.ai.text.yandex.openAIPromptId
      },
      input: msg
    }).catch((e) => {
      logger.log('Yandex GPT error', e.response?.data);
      throw new ErrorForbidden(`HTTP error! status: ${e.response?.status}`);
    })

    if (!response) {
      throw new ErrorForbidden(`HTTP error! status: ${response}`);
    }
    return { text: response.output_text, usageTokens: response.usage?.total_tokens || 0 };
  }


}

export default new YandexGptTextService();
