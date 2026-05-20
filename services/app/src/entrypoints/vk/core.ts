import { cheackOrCreateInitFoldersAndFiles } from "../../utils/paths.util"
import { setupGlobalErrorHandlers } from "../../pkg/errors/error-handler"
import { initializeDatabase } from "../../pkg/db/db.init"
import vkService from "../../modules/vk/vk.service"

(async () => {
  try {
    await cheackOrCreateInitFoldersAndFiles()
    setupGlobalErrorHandlers()
    await initializeDatabase()
     vkService
  } catch (err) {
    process.exit(1)
  }
})()
