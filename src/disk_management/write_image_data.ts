// import libraries
import fs from "fs";
import path from "path";

// import packages
// import superagent from "superagent";

// import modules
import format_log_line from "./format_log_line";
import write_image_ref from "./write_image_ref";
import { get_request } from "../send_requests/send_requests";

// Import types
import { WriteImageData } from "../types";

// import utils
// import { catch_errors } from "../utils/catch_errors";

let logLine: string;

/**
 * Writes Image to disk
 * @param img_obj
 * @param thread_dir
 * @param results
 * @param idx
 * @param waitingQueue
 * @returns void
 */

const write_image_data: WriteImageData = async (img_obj, thread_dir, results, idx, waitingQueue, progressBar) => {
  /***** prepare video names *****/
  const [, , host, board, file_hash_and_ext] = img_obj.videoUrl.split("/");
  const [file_hash, ext] = file_hash_and_ext.split(".");

  const url = `https://${host}/${board}/${file_hash_and_ext}`;
  const video_name =
    img_obj.title
      .split(".")
      .slice(0, -1)
      .join(".")
      .replace(/[|@"<>\\\/?:*]/g, "-") + ` - ${img_obj.post_id}.${ext}`;

  // const ext = file_hash_and_ext.split(".")[1];

  const video_path = path.join(thread_dir, video_name);

  /***** check if video already exist (downloaded) *****/
  if (fs.existsSync(video_path)) {
    waitingQueue.pop();
    progressBar.increment(1)
    write_image_ref(thread_dir, img_obj)
    // print_logs(idx, "Skip", video_name, ext, "Already Exists")
    return;
  }

  /***** send superagent request - get video data *****/
  // const TRIES = 2;
  let i = 1;
  logLine = format_log_line(idx, `Getting Url (${i})`, video_name, ext, `${img_obj.size}`);
  // console.log(logLine);
  const [image_data, err] = await get_request(url);

  /***** handle superagent request error *****/
  if (err) {
    waitingQueue.pop();
    logLine = format_log_line(idx, `Error (${i})`, video_name, ext, err.message);
    // console.error(logLine);
    results.errors.push(logLine);
    return;
  }

  /***** write video data to disk *****/
  // logLine = format_log_line(idx, `Downloading (${i})`, video_name, ext, `${img_obj.size}`);
  // console.log(logLine)

  fs.writeFileSync(video_path, image_data.body, "binary");
  logLine = format_log_line(idx, `success (${i})`, video_name, ext, `${img_obj.size}`);
  // console.log(logLine);
  results.success.push(logLine);

  waitingQueue.pop();
  write_image_ref(thread_dir, img_obj)
  progressBar.increment(1)
};

export default write_image_data;
