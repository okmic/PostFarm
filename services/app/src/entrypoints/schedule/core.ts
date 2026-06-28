import schedule from 'node-schedule'
import { ReferralLink } from "../../models/ReferralLink.model"
import { User } from "../../models/User.model"
import { logger } from '../../pkg/logger/logger.service'

export default class ScheduleCore {
    private job: schedule.Job | null = null

    constructor() {
        logger.info('[ScheduleCore] Initialized')
        this.initCore()
    }

    private async initCore() {
        this.job = schedule.scheduleJob('0 0 * * *', async () => {
            await this.processExpiredLinks()
            await this.processExpiredUserRates()
        })
        logger.info('[ScheduleCore] Started. Checking expired links and user rates daily at 00:00')
    }

    private async processExpiredLinks() {
        const now = new Date()

        const expiredLinks = await ReferralLink.find({
            active: true,
            'linkExpirationDate.date': { $ne: null, $lte: now }
        })

        if (expiredLinks.length === 0) {
            logger.info('[ScheduleCore] No expired links found')
            return
        }

        logger.info(`[ScheduleCore] Found ${expiredLinks.length} expired link(s)`)

        let updatedUsers = 0
        let skippedLinks = 0

        for (const link of expiredLinks) {
            const users = await User.find({ refCode: link.code })

            if (users.length === 0) {
                skippedLinks++
                logger.info(`[ScheduleCore] No users found for link: ${link.code}`)
                continue
            }

            const updateData: Record<string, any> = {}

            if (link.linkExpirationDate.role) {
                updateData.role = link.linkExpirationDate.role
            }

            if (link.linkExpirationDate.rate !== null && link.linkExpirationDate.rate !== undefined) {
                updateData.rate = link.linkExpirationDate.rate
            }

            if (Object.keys(updateData).length === 0) {
                skippedLinks++
                logger.info(`[ScheduleCore] No updates to apply for link: ${link.code}`)
                continue
            }

            const result = await User.updateMany(
                { refCode: link.code },
                { $set: updateData }
            )

            updatedUsers += result.modifiedCount

            logger.info(
                `[ScheduleCore] Link ${link.code}: ` +
                `${result.modifiedCount} user(s) updated ` +
                `(${JSON.stringify(updateData)})`
            )

            link.active = false
            await link.save()
        }

        logger.info(
            `[ScheduleCore] Links completed. ` +
            `Processed: ${expiredLinks.length} link(s), ` +
            `Users updated: ${updatedUsers}, ` +
            `Skipped: ${skippedLinks}`
        )
    }

    private async processExpiredUserRates() {
        const now = new Date()

        const expiredUsers = await User.find({
            'expirationRateDate.date': { $ne: null, $lte: now }
        })

        if (expiredUsers.length === 0) {
            logger.info('[ScheduleCore] No expired user rates found')
            return
        }

        logger.info(`[ScheduleCore] Found ${expiredUsers.length} user(s) with expired rates`)

        let updatedUsers = 0

        for (const user of expiredUsers) {
            const updateData: Record<string, any> = {}

            if (user.expirationRateDate.role) {
                updateData.role = user.expirationRateDate.role
            }

            if (user.expirationRateDate.rate !== null && user.expirationRateDate.rate !== undefined) {
                updateData.rate = user.expirationRateDate.rate
            }

            if (Object.keys(updateData).length === 0) {
                logger.info(`[ScheduleCore] No updates for user: ${user.email}`)
                continue
            }

            await User.updateOne(
                { _id: user._id },
                {
                    $set: {
                        ...updateData,
                        'expirationRateDate.date': null,
                        'expirationRateDate.role': null,
                        'expirationRateDate.rate': null
                    }
                }
            )

            updatedUsers++

            logger.info(
                `[ScheduleCore] User ${user.email}: ` +
                `updated (${JSON.stringify(updateData)})`
            )
        }

        logger.info(
            `[ScheduleCore] User rates completed. ` +
            `Users updated: ${updatedUsers}`
        )
    }

    public stopJob() {
        if (this.job) {
            this.job.cancel()
            logger.info('[ScheduleCore] Stopped')
        }
    }

    public async runManually() {
        logger.info('[ScheduleCore] Manual run started')
        await this.processExpiredLinks()
        await this.processExpiredUserRates()
        logger.info('[ScheduleCore] Manual run completed')
    }
}