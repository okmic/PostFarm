import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import appconfig from '../../pkg/config/appconfig'

interface MailOptions {
  to: string
  subject: string
  text?: string
  html?: string
}

let transporter: Transporter | null = null

const getTransporter = (): Transporter => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.yandex.ru',
      port: 465,
      secure: true,
      auth: {
        user: appconfig.mail.user,
        pass: appconfig.mail.pass,
      },
    })
  }
  return transporter
}

export const sendYandexEmail = async (options: MailOptions): Promise<boolean> => {
  try {
    const transport = getTransporter()

    const info = await transport.sendMail({
      from: appconfig.mail.user,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    })

    return info
  } catch (error) {
    return false
  }
}
