import fs from "fs"
import { TPostImage } from "../types"

const write_image_ref = (thread_dir: string, image: TPostImage) => {
    const fileLoc = thread_dir + "\\image_ref.txt"
    fs.appendFileSync(fileLoc, image.post_id + "\n");
}

export default write_image_ref