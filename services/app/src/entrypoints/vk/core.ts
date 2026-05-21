import { cheackOrCreateInitFoldersAndFiles } from "../../utils/paths.util"
import { setupGlobalErrorHandlers } from "../../pkg/errors/error-handler"
import { initializeDatabase } from "../../pkg/db/db.init"

(async () => {
  try {
    await cheackOrCreateInitFoldersAndFiles()
    setupGlobalErrorHandlers()
    await initializeDatabase()
  } catch (err) {
    process.exit(1)
  }
})()
