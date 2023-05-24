// import libraries
import fs from "fs";
import path from "path";

// import packages
// import superagent from "superagent";

// import modules
import format_log_line from "./format_log_line";
import { get_request } from "../send_requests/send_requests";

// Import types
import { WriteThumbnail } from "../types";

// import utils
import { catch_errors } from "../utils/catch_errors";

// import configs

let logLine: string;

const write_thumbnails: WriteThumbnail = async (img_obj, thumbnail_dir, idx, waitingQueue) => {
  /***** prepare thumbnail names *****/
  const [, , host, board, file_hash_and_ext] = img_obj.thumbnailUrl.split("/");
  const url = `https://${host}/${board}/${file_hash_and_ext}`; // //i.4cdn.org/<board>/<file_id>.<ext>
  const ext = file_hash_and_ext.split(".")[1];
  const file_hash = file_hash_and_ext.split(".")[0];
  const thumbnail =
    img_obj.title
      .split(".")
      .slice(0, -1)
      .join(".")
      .replace(/[|@"<>\\\/?:*]/g, "-") + ` - ${img_obj.post_id} - thumbnail.${ext}`;

  const thumbnail_path = path.join(thumbnail_dir, thumbnail);

  /***** check if thumbnail exist *****/
  if (fs.existsSync(thumbnail_path)) {
    waitingQueue.pop();
    return;
  }

  /***** send superagent request - get thumbnail data *****/
  const [image_data, err] = await get_request(url);

  /***** handle superagent request error *****/
  if (err) {
    waitingQueue.pop();
    logLine = format_log_line(idx, "Error", thumbnail, "thumbnail", err.message);
    // console.log(logLine);
    return;
  }

  /***** save image base64 *****/
  // console.log(image_data.body)
  // img_obj.thumbnailBase64 = image_data.body.toString("base64");

  /***** write thumbnail data to disk *****/
  // const [, err2] = (await catch_errors2(fs.writeFileSync, ...[thumbnail_path, image_data.body, "binary"])) as [null, Error];
  const [, err2] = await write_file_bin(thumbnail_path, image_data.body);

  /***** handle write thumbnail to disk error *****/
  if (err2) {
    waitingQueue.pop();
    logLine = format_log_line(idx, "Error", thumbnail, "thumbnail", err2.message);
    // console.log(logLine);
    return;
  }

  logLine = format_log_line(idx, "Done", thumbnail, "thumbnail", `${img_obj.resolution}`);
  // console.log(logLine);

  waitingQueue.pop();
};

export default write_thumbnails;

type WriteFileBin = (thumbnail_path: string, data: Buffer) => Promise<[null, NodeJS.ErrnoException]>;
const write_file_bin: WriteFileBin = catch_errors((thumbnail_path: string, data: Buffer) =>
  fs.writeFileSync(thumbnail_path, data, "binary")
);
