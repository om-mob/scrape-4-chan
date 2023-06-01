import path from "path"

export const DATA_PATH = path.join(__dirname, "..", ".." , "data")
export const ARCHIVE_PATH = path.join(DATA_PATH, "archive.txt")

export const MAX_REQUEST_TIMEOUT = 100000