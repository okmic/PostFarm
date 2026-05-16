import { logger } from "../../../pkg/logger/logger.service"

export default class ExtractPhone {
    logPrefix
    text

    constructor(text: string) {
        this.logPrefix = `EXTRACT-PHONE-MODULE-${new Date().toDateString()}`
        this.text = text
    }

    public async handlePhoneNumberInput(): Promise<string | null> {
        try {
            logger.log(`[START-${this.logPrefix}] - Начало анализа текста: "${this.text}"`)
            
            const phoneNumber = this.extractPhoneNumberFromText()

            if (phoneNumber) {
                logger.log(`[FOUND-${this.logPrefix}] - Найден номер: ${phoneNumber}`)
                const normalizedPhone = this.normalizePhoneNumber(phoneNumber)
                logger.log(`[NORMALIZE-${this.logPrefix}] - Нормализованный номер: ${normalizedPhone}`)

                if (this.isValidPhoneNumber(normalizedPhone)) {
                    logger.log(`[SUCCESS-${this.logPrefix}] - Валидный номер: ${normalizedPhone}`)
                    return normalizedPhone
                } else {
                    logger.log(`[ERROR-${this.logPrefix}] - Невалидный номер: ${normalizedPhone}`)
                    return null
                }
            } else {
                logger.log(`[SKIP-${this.logPrefix}] - Номер телефона не найден в тексте`)
                return null
            }
        } catch (e) {
            logger.log(`[ERROR-${this.logPrefix}] - Критическая ошибка при обработке номера`)
            return null
        }
    }

    private extractPhoneNumberFromText(): string | null {
        logger.log(`[SEARCH-${this.logPrefix}] - Поиск номера в тексте: "${this.text}"`)

        // Убираем ВСЕ возможные разделители перед поиском
        const cleanedText = this.text.replace(/[\s\-\(\)\.\_\,]/g, '')
        logger.log(`[CLEAN_TEXT-${this.logPrefix}] - Текст после очистки: "${cleanedText}"`)

        // Упрощенное регулярное выражение для поиска номеров
        const phoneRegex = /(\+7|8|7)?[489]\d{9,12}/g

        const matches = cleanedText.match(phoneRegex)
        logger.log(`[MATCH-${this.logPrefix}] - Найдены совпадения:`, matches)

        if (matches && matches.length > 0) {
            let cleanedNumber = matches[0]
            logger.log(`[INITIAL_MATCH-${this.logPrefix}] - Исходное совпадение: ${cleanedNumber}`)

            // Обработка различных форматов
            if (cleanedNumber.startsWith('8')) {
                cleanedNumber = '+7' + cleanedNumber.slice(1)
            }
            else if (cleanedNumber.startsWith('7') && !cleanedNumber.startsWith('+7')) {
                cleanedNumber = '+' + cleanedNumber
            }
            else if (cleanedNumber.startsWith('9') && cleanedNumber.length === 10) {
                cleanedNumber = '+7' + cleanedNumber
            }
            else if (/^\d{10}$/.test(cleanedNumber)) {
                cleanedNumber = '+7' + cleanedNumber
            }
            // Если номер начинается с +7 но содержит лишние цифры
            else if (cleanedNumber.startsWith('+7') && cleanedNumber.length > 12) {
                cleanedNumber = cleanedNumber.substring(0, 12)
            }

            logger.log(`[FINAL-${this.logPrefix}] - Извлеченный номер: ${cleanedNumber}`)
            return cleanedNumber
        }

        // Альтернативный поиск для номеров с разделителями
        const alternativeRegex = /(\+7|8|7)[\s\-\(\)\.]*[489][\s\-\(\)\.]*[0-9]{2,3}[\s\-\(\)\.]*[0-9]{2,3}[\s\-\(\)\.]*[0-9]{2,3}[\s\-\(\)\.]*[0-9]{2,3}/g
        const altMatches = this.text.match(alternativeRegex)
        
        if (altMatches && altMatches.length > 0) {
            let cleanedNumber = altMatches[0].replace(/[^\d\+]/g, '')
            logger.log(`[ALT_MATCH-${this.logPrefix}] - Найден через альтернативный поиск: ${cleanedNumber}`)
            
            // Нормализация альтернативного совпадения
            return this.normalizePhoneNumber(cleanedNumber)
        }

        logger.log(`[NOT_FOUND-${this.logPrefix}] - Номер не найден в тексте`)
        return null
    }

    private isValidPhoneNumber(phone: string): boolean {
        const isValid = /^\+7\d{10}$/.test(phone)
        logger.log(`[VALIDATION-${this.logPrefix}] - Результат валидации ${phone}: ${isValid ? 'VALID' : 'INVALID'}`)
        return isValid
    }

    private normalizePhoneNumber(phone: string): string {
        logger.log(`[NORMALIZE_START-${this.logPrefix}] - Начало нормализации: ${phone}`)
        
        // Убираем все нецифровые символы кроме +
        let normalized = phone.replace(/[^\d\+]/g, '')
        logger.log(`[CLEAN-${this.logPrefix}] - Очищенный номер: ${normalized}`)

        // Приводим к формату +7XXXXXXXXXX
        if (normalized.startsWith('8')) {
            normalized = '+7' + normalized.slice(1)
        } else if (normalized.startsWith('7') && !normalized.startsWith('+7')) {
            normalized = '+' + normalized
        } else if (normalized.startsWith('9') && normalized.length === 10) {
            normalized = '+7' + normalized
        } else if (/^\d{10}$/.test(normalized)) {
            normalized = '+7' + normalized
        }

        // Обрезаем до 12 символов если нужно
        if (normalized.startsWith('+7') && normalized.length > 12) {
            normalized = normalized.substring(0, 12)
        }

        logger.log(`[NORMALIZE_RESULT-${this.logPrefix}] - Результат нормализации: ${normalized}`)
        return normalized
    }
}