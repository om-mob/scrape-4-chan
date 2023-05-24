// import packages

// import modules
import get_data from "./scraper/get_data";
import save_images_to_disk from "./disk_management/save_images_to_disk";
import { parse_input } from "./desktop_app/handle_command_line_args";
import write_thread_log from "./logs_management/write_logs";
import multibar from "./logs_management/progressBar"
import { set_archived_flag, set_update_flag, set_error_flag } from "./logs_management/set_flags";


// import types
import { ThreadArgs } from "./types";

// import utils
import { sleep } from "./utils/utils";



// main job
/**
 * Downloads a single thread from a given URL and saves the thread data and images to disk and handles some errors.
 * 
 * @note
 * [This JSDoc is generated using ChatGPT]
 * 
 * Prompt: Act as a typescript developer whose job is writing JSDocs for typescript functions. My prompt is going to be a typescript function. Your response should be a full documentation for that function. 
 * 
 * The format of your response: Your response should be a typescript code block contains only the documentation (without the function implementation).
    first prompt:
    "create a documentation for this function
    +Function_Implementation+
    "
 *
 * @param {ThreadArgs} threadArgs - an object conatins {url, included_images, excluded_images}.
 * @returns {Promise<string | { errors: string[], success: string[] }>} - Returns a log string in case of error, or an object containing errors and success arrays for downloaded images.
 *
 * @async
 * @function
 * @name download_one_thread
 *
 * @example
 * // Example usage of download_one_thread function
 * const threadTuple: [string[], null] | [null, ThreadArgs] = // ... initialize threadTuple
 * const result = await download_one_thread(threadTuple);
 * console.log(result);
 *
 * // Example return value in case of success
 * {
 *   errors: [], // array of error messages for failed image downloads
 *   success: [
 *    '|  33 | success (1) | video_file_name | jpg | 3.77 MB |',
 *    '|  29 | success (1) | video_file_name | jpg | 5.74 MB |',
 *   ] // array of filenames for successfully downloaded images
 * }
 *
 * // Example return value in case of error
 * 'Error Getting Json Data | Board/ThreadID | Thread Title\n'
 *
 * @see {@link ThreadArgs} for the structure of the threadArgs object
 * @see {@link get_data} for fetching thread JSON data
 * @see {@link write_thread_log} for writing thread log to archive file
 * @see {@link save_images_to_disk} for saving images to disk
 * @see {@link set_error_flag} for setting error flag in case of image download errors
 */
async function download_one_thread(threadArgs: ThreadArgs) {
  // console.log("========== Start ===========");
  // handle user input errors
  // const [err, threadArgs] = threadTuple;
  // if (err != null) {
  //   let log = ``
  //   err.forEach((e) => {log += `${e}\n`} /*console.error(e)*/);
  //   return log;
  // }

  // get thread JSON data
  const { url } = threadArgs as ThreadArgs;
  const [data, error] = await get_data(url);
  // handle error fetching thread data
  if (error) {
    let log = ``
    log += url // console.log(url);
    log += `\nError Getting Json Data` // console.error(`Error Getting Json Data`);
    log += `${error.name}: ${error.message}` // console.error(`${error.name}: ${error.message}`);
    if (error.message === "Not Found" && error.status === 404) {
      log += "Board Removed" // console.info("Board Removed");
      set_archived_flag(url);
    }
    log += "\n"
    return log;
  }

  // open archive file, write thread log
  const [successStatus, errLogs] = write_thread_log(
    url!,
    data!.thread_title,
    data!.thread_stats.replies.toString(),
    data!.thread_stats.images.toString(),
    data!.thread_stats.total_size
  );
  // handle writing thread log error (usually no change in archive)
  if (!successStatus) {
    // console.error(errLogs.name)
    const [, , host, board, , thread_id] = url.split("/")
    let log = ``
    log += errLogs.message + ` | ${board}/${thread_id} | ${data!.thread_title}` // console.error(errLogs.message);

    if (!threadArgs.include?.length) return log; // checks if it was explicitly instructed to download a video
    // connection or timeout errors that resulted in undownloaded images are handled in duplicate_line_check
  }

  await sleep(0.5); // From the previous step, writing to disk takes time. So we slow the program 1/2 sec to enable the archive write to finish
  if (threadArgs.include?.length || threadArgs.exclude?.length) {
    // if we didn't download the whole thread. We should set the exclude update flag. so the thread won't be added to the -u list
    // this is no longer needed since we made a file `image_ref.txt`. in it, there is a reference to downloaded image.
    // set_update_flag(url);
  }

  // console.log(data!.thread_title, "\n==============================");

  // save images to disk
  const selectedImages = { include: threadArgs.include, exclude: threadArgs.exclude };
  const res: { errors: string[]; success: string[] } = await save_images_to_disk(data!, selectedImages, multibar);
  // await sleep(5)
  // if error, reopen archive and set error flag to T
  if (res.errors.length) set_error_flag(url);

  // console.log("========== Done ==========");
  return res;
}

(
  // generate JSDoc for the following main function
  /**
   * @name main
   * @description Main function of the program.
   * @param {string[]} argv - Command line arguments.
   * @returns {Promise<void>} - Returns nothing.
   * 
   * @note
   * Generated by AWS CodeWhisperer
   */
  async function main() {
  const threadTuplesList = parse_input(process.argv.slice(2));
  
  const jobs = [];

  for (let threadTuple of threadTuplesList) {
    // handle user input error
    const [err, threadArgs] = threadTuple;
    if (err != null) {
      console.error(`== Error ==`)
      err.forEach((e) => console.error(e));
      continue;
    }
  
    jobs.push(download_one_thread(threadArgs));
  }

  const resluts = await Promise.all(jobs);
  multibar.stop()
  console.log("========================")
  resluts.forEach((res) => {
    if (res == null) return
    if (typeof res === "string") return console.log(res)
    if (typeof res === 'object' && res.errors.length) console.log(res.errors)
  })
  process.exit(0);
})();

/*********** Old main ***********/
// (async function main() {
//   const threadTuplesList = parse_input(process.argv.slice(2));

//   for (let threadTuple of threadTuplesList) {
//     console.log("\n========== Start ===========");
//     const [err, threadArgs] = threadTuple;
//     if (err != null) {
//       err.forEach((e) => console.log(e));
//       continue;
//     }

//     const { url } = threadArgs as ThreadArgs;
//     const [data, error] = await get_data(url);
//     if (error) {
//       console.log(url);
//       console.error(`Error Getting Json Data`);
//       console.error(`${error.name}: ${error.message}`);
//       if (error.message === "Not Found" && error.status === 404) {
//         console.log("Board Removed");
//         set_archived_flag(url);
//       }
//       continue;
//     }

//     const [successStatus, errLogs] = write_thread_log(
//       url!,
//       data!.thread_title,
//       data!.thread_stats.replies.toString(),
//       data!.thread_stats.images.toString(),
//       data!.thread_stats.total_size
//     );
//     if (!successStatus) {
//       // console.error(errLogs.name)
//       console.error(errLogs.message);

//       if (!threadArgs.include?.length) continue; // connection or timeout errors that resulted in undownloaded images are handled in duplicate_line_check
//     }

//     await sleep(0.5); // From the previous step, writing to disk takes time. So we slow the program 1/2 sec to enable the archive write to finish
//     if (threadArgs.include?.length || threadArgs.exclude?.length) {
//       // if we didn't download the whole thread. We should set the exclude update flag. so the thread won't be added to the -u list
//       // set_update_flag(url);
//     }

//     console.log(data!.thread_title, "\n==============================");

//     const selectedImages = { include: threadArgs.include, exclude: threadArgs.exclude };
//     const res = await save_images_to_disk(data!, selectedImages);
//     // await sleep(5)

//     if (res.errors.length) set_error_flag(url);

//     console.log("========== Done ==========");
//     console.log(res);
//   }
//   process.exit()
// })();
