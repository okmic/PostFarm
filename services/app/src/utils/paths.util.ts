import fs from "fs/promises"
import { join } from "path"

export async function checkedStorage(dirPath: string) {
    try {
        await fs.access(dirPath)
    } catch (e) {
        await fs.mkdir(dirPath, { recursive: true })
    }
}

export async function cheackOrCreateInitFoldersAndFiles() {
    await checkedStorage(getPath("storage"))
    await checkedStorage(getPath("static"))

}
export type TGetPath = "storage" | "views" | "static"

export function getPath(storageType?: TGetPath) {
    
    const storPath = join(__dirname, "..", "..", "storage") 

    switch(storageType) {
        case "views": return join(__dirname, "..", "..", "views")
        case "storage": return storPath
        case "static": return storPath + `/static`
        default: throw new Error("invalid key")
    }
}
