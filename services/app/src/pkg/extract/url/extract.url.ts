import { logger } from "../../../pkg/logger/logger.service"

export default class ExtractUrl {

    logPrefix
    text

    constructor(text: string) {
        this.logPrefix = `EXTRACT-URLS-MODULE-${new Date().toDateString()}`
        this.text = text
    }

    public async handleUrlInput(): Promise<string | null> {
        try {
            logger.log(`[START-${this.logPrefix}] - 🔍 Начало анализа текста: "${this.text.substring(0, 100)}..."`)
            
            const url = this.extractUrlFromText()

            if (url) {
                logger.log(`[FOUND-${this.logPrefix}] - 🌐 Найдена ссылка: ${url}`)
                const normalizedUrl = this.normalizeUrl(url)
                logger.log(`[NORMALIZE-${this.logPrefix}] - 🛠️ Нормализованная ссылка: ${normalizedUrl}`)

                if (this.isValidUrl(normalizedUrl)) {
                    logger.log(`[SUCCESS-${this.logPrefix}] - ✅ Валидная ссылка: ${normalizedUrl}`)
                    return normalizedUrl
                } else {
                    logger.log(`[ERROR-${this.logPrefix}] - ❌ Невалидная ссылка: ${normalizedUrl}`)
                    return null
                }
            } else {
                logger.log(`[SKIP-${this.logPrefix}] - ⚠️ Ссылка не найдена в тексте`)
                return null
            }
        } catch (e) {
            logger.log(`[ERROR-${this.logPrefix}] - 💥 Критическая ошибка при обработке ссылки`)
            return null
        }
    }

    private extractUrlFromText(): string | null {
        logger.log(`[SEARCH-${this.logPrefix}] - 🔎 Поиск ссылок в тексте`)

        // Комплексное регулярное выражение для поиска URL
        const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)|(www\.[^\s<>"{}|\\^`[\]]+)|([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s<>"{}|\\^`[\]]*)?)/gi

        const matches = this.text.match(urlRegex)
        logger.log(`[MATCH-${this.logPrefix}] - 📊 Найдены совпадения:`, matches)

        if (matches && matches.length > 0) {
            let extractedUrl = matches[0].trim()
            logger.log(`[EXTRACT-${this.logPrefix}] - 🎯 Извлеченная ссылка: ${extractedUrl}`)

            // Очистка и подготовка URL
            extractedUrl = this.cleanUrl(extractedUrl)
            logger.log(`[CLEAN-${this.logPrefix}] - 🧹 Очищенная ссылка: ${extractedUrl}`)

            return extractedUrl
        }

        logger.log(`[NOT_FOUND-${this.logPrefix}] - ❌ Ссылки не найдены в тексте`)
        return null
    }

    private cleanUrl(url: string): string {
        let cleaned = url.trim()
        
        // Удаление запятых, точек и других знаков препинания в конце
        cleaned = cleaned.replace(/[.,;:!?)]+$/, '')
        
        // Удаление открывающих скобок в начале
        cleaned = cleaned.replace(/^[(]+/, '')
        
        // Удаление лишних пробелов
        cleaned = cleaned.replace(/\s+/g, '')
        
        logger.log(`[CLEAN_DETAILS-${this.logPrefix}] - 🧹 Детальная очистка: ${url} -> ${cleaned}`)
        return cleaned
    }

    private isValidUrl(url: string): boolean {
        try {
            // Проверка базовой валидности URL
            const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/
            const isValidFormat = urlRegex.test(url)
            
            logger.log(`[VALIDATION-${this.logPrefix}] - 📋 Проверка формата ${url}: ${isValidFormat ? 'VALID' : 'INVALID'}`)

            if (!isValidFormat) {
                return false
            }

            // Дополнительные проверки
            const urlObj = new URL(this.ensureProtocol(url))
            
            // Проверка домена
            const domain = urlObj.hostname
            if (domain.length < 3) {
                logger.log(`[ERROR-${this.logPrefix}] - ❌ Домен слишком короткий: ${domain}`)
                return false
            }

            // Проверка на локальные адреса
            if (domain.includes('localhost') || domain.includes('127.0.0.1') || domain.includes('::1')) {
                logger.log(`[WARNING-${this.logPrefix}] - ⚠️ Обнаружен локальный адрес: ${domain}`)
            }

            // Проверка валидности TLD
            const tld = domain.split('.').pop()
            if (tld && tld.length < 2) {
                logger.log(`[ERROR-${this.logPrefix}] - ❌ Невалидный TLD: ${tld}`)
                return false
            }

            logger.log(`[VALIDATION_DETAILS-${this.logPrefix}] - ✅ Дополнительные проверки пройдены`)
            return true

        } catch (error) {
            logger.log(`[ERROR-${this.logPrefix}] - ❌ Ошибка валидации URL: ${url}`)
            return false
        }
    }

    private normalizeUrl(url: string): string {
        logger.log(`[NORMALIZE_START-${this.logPrefix}] - 🛠️ Начало нормализации: ${url}`)
        
        let normalized = url.trim().toLowerCase()
        logger.log(`[NORMALIZE_CASE-${this.logPrefix}] - 🔄 Приведение к нижнему регистру: ${normalized}`)

        // Удаление пробелов
        normalized = normalized.replace(/\s+/g, '')
        logger.log(`[NORMALIZE_SPACES-${this.logPrefix}] - 🔄 Удаление пробелов: ${normalized}`)

        // Добавление протокола если отсутствует
        normalized = this.ensureProtocol(normalized)
        logger.log(`[NORMALIZE_PROTOCOL-${this.logPrefix}] - 🔄 Добавление протокола: ${normalized}`)

        // Нормализация пути
        normalized = this.normalizePath(normalized)
        logger.log(`[NORMALIZE_PATH-${this.logPrefix}] - 🔄 Нормализация пути: ${normalized}`)

        // Удаление слешей в конце для consistency
        normalized = normalized.replace(/\/+$/, '')
        logger.log(`[NORMALIZE_SLASHES-${this.logPrefix}] - 🔄 Удаление конечных слешей: ${normalized}`)

        if (this.isValidUrl(normalized)) {
            logger.log(`[SUCCESS-${this.logPrefix}] - ✅ Успешная нормализация: ${normalized}`)
        } else {
            logger.log(`[WARNING-${this.logPrefix}] - ⚠️ Нормализованная ссылка может быть невалидной: ${normalized}`)
        }

        return normalized
    }

    private ensureProtocol(url: string): string {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url
        }
        
        // Для URL начинающихся с www добавляем https
        if (url.startsWith('www.')) {
            return 'https://' + url
        }
        
        // Для остальных случаев добавляем https://
        return 'https://' + url
    }

    private normalizePath(url: string): string {
        try {
            const urlObj = new URL(url)
            
            // Нормализация пути (удаление двойных слешей, кроме протокола)
            let path = urlObj.pathname
            path = path.replace(/\/+/g, '/')
            
            // Сборка нормализованного URL
            const normalized = `${urlObj.protocol}//${urlObj.hostname}${urlObj.port ? ':' + urlObj.port : ''}${path}${urlObj.search}${urlObj.hash}`
            
            return normalized
        } catch (error) {
            return url
        }
    }

    // Дополнительный метод для получения всех ссылок из текста
    public async extractAllUrls(): Promise<string[]> {
        try {
            logger.log(`[START-${this.logPrefix}] - 🔍 Поиск всех ссылок в тексте`)
            
            const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)|(www\.[^\s<>"{}|\\^`[\]]+)|([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s<>"{}|\\^`[\]]*)?)/gi
            const matches = this.text.match(urlRegex) || []
            
            logger.log(`[FOUND_ALL-${this.logPrefix}] - 📊 Найдено ссылок: ${matches.length}`)
            
            const validUrls: string[] = []
            
            for (const match of matches) {
                const normalized = this.normalizeUrl(match)
                if (this.isValidUrl(normalized)) {
                    validUrls.push(normalized)
                    logger.log(`[VALID_URL-${this.logPrefix}] - ✅ Добавлена валидная ссылка: ${normalized}`)
                } else {
                    logger.log(`[INVALID_URL-${this.logPrefix}] - ❌ Пропущена невалидная ссылка: ${normalized}`)
                }
            }
            
            logger.log(`[COMPLETE-${this.logPrefix}] - 🎯 Завершено извлечение ссылок. Найдено валидных: ${validUrls.length}`)
            return validUrls
            
        } catch (e) {
            logger.log(`[ERROR-${this.logPrefix}] - 💥 Ошибка при извлечении всех ссылок`)
            return []
        }
    }

    // Метод для фильтрации по доменам
    public async extractUrlsByDomain(domainFilter: string): Promise<string[]> {
        try {
            logger.log(`[FILTER-${this.logPrefix}] - 🎯 Поиск ссылок для домена: ${domainFilter}`)
            
            const allUrls = await this.extractAllUrls()
            const filteredUrls = allUrls.filter(url => {
                try {
                    const urlObj = new URL(url)
                    return urlObj.hostname.includes(domainFilter)
                } catch {
                    return false
                }
            })
            
            logger.log(`[FILTER_RESULT-${this.logPrefix}] - 📊 Найдено ссылок для домена ${domainFilter}: ${filteredUrls.length}`)
            return filteredUrls
            
        } catch (e) {
            logger.log(`[ERROR-${this.logPrefix}] - 💥 Ошибка при фильтрации ссылок по домену`)
            return []
        }
    }
}