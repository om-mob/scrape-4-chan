// import libraries
import fs from "fs";

// import packages

// import types
import { WriteThreadLog } from "../types";

// import modules
import format_log_line from "./format_log_line";
import duplicate_log_line_check from "./duplicate_line_check";

// import utils
import { format_date } from "../utils/utils";
import { get_log_header } from "./utils";

// import configs
import { LEN_BOARD, LEN_DATE, LEN_HOST, LEN_IMAGE_COUNT, LEN_REPLY_COUNT, LEN_SIZE, LEN_THREAD_ID, LEN_TITLE } from "./consts";
import { ARCHIVE_PATH } from "../config/consts";

const write_thread_log: WriteThreadLog = (thread_url, thread_title, replies_count, image_count, total_size) => {
  const filePath = ARCHIVE_PATH;
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, get_log_header());

  const archive = fs.readFileSync(filePath, "utf8");
  // const threadUrls = archive.split("\n").filter((_, index) => index % 2 !== 0)
  // if (threadUrls.includes(thread_url)) return console.info(`${thread_title} already saved before`)
  // console.log(archive.split("\n"))

  const [, , host, board, , thread_id] = thread_url.split("/");

  const logLineArr: [string, number][] = [
    [format_date(new Date()), LEN_DATE],
    [thread_title, LEN_TITLE],
    [board, LEN_BOARD],
    [thread_id, LEN_THREAD_ID],
    [host, LEN_HOST],
    [replies_count, LEN_REPLY_COUNT],
    [image_count, LEN_IMAGE_COUNT],
    [total_size, LEN_SIZE],
    ["F", 1],
    ["F", 1],
    ["F", 1],
  ]
  const logLine = format_log_line(logLineArr);

  if (duplicate_log_line_check(archive, logLine)) { // connection or timeout errors that resulted in undownloaded images is handled here
    return [false, new Error("no change in archive")]; // [successStatus, Reason]
  }

  // console.log(archive.split("\n").slice(-2)[0]);
  // // log thread previous status vs new status
  // const oldLogLineArr: [string, number][] | undefined = archive.split("\n").slice(2,-1).map(line => line.split("|").map(f => f.trim())).find(lineArr => lineArr[4] === thread_id)?.slice(1, -1).map((f, idx) => [f, logLineArr[idx][1]])
  // console.log((oldLogLineArr ? format_log_line(oldLogLineArr).trim() : ""))
  // console.log(logLine)

  // Remove old Log Line
  remove_old_log_line(archive, thread_id);
  // Add New Log Line
  const stream = fs.createWriteStream(filePath, { flags: "a" });
  stream.write(logLine, (err) => {
    if (err) {
      stream.end();
      return [false, err]; // [successStatus, Error]
    }
    // console.info(`${thread_title} saved`);
    stream.end();
  });
  return [true, null];
};

export default write_thread_log;

const remove_old_log_line = (archive_string: string, t_id: string) => {
  // 1. save archive to memory
  // 2. cast archive from string to array , split archive lines by \n
  // Note on 2. each element of the array  is a line of the form "| 2023/01/06 | title | <board> | <thread_id> | host | 312 | 83 | 392 MB | F |"
  // 3. for each log line, split on "|", and trim
  // Ps on 3. each line now is a tuple of the form ["", "2023/01/06", "title", "<board>", "<thread_id>", "host", 312, 83, size, ""]
  // 4. search for the thread and remove it. hint: use index = 4 in the tuple from 3
  // 5. reconstruct log line
  // 6. write archive file. (Now it's without the outdated line)

  const new_archive = archive_string
    .split("\n") // cast archive from string to array , split archive lines by \n
    .map((line) => line.split("|").map((entry) => entry.trim()))
    .filter((line) => {
      // console.log(line)
      // console.log(line[4] !== t_id)
      return line[4] !== t_id
    })
    .slice(0,-1)
    .map((line) => {
      // console.log(line)
      return format_log_line([
        [line[1], LEN_DATE],
        [line[2], LEN_TITLE],
        [line[3], LEN_BOARD],
        [line[4], LEN_THREAD_ID],
        [line[5], LEN_HOST],
        [line[6], LEN_REPLY_COUNT],
        [line[7], LEN_IMAGE_COUNT],
        [line[8], LEN_SIZE],
        [line[9], 1],
        [line[10], 1],
        [line[11], 1],
      ]);
    })
    .join("");
  fs.writeFileSync(ARCHIVE_PATH, new_archive);

  return new_archive;
};

//https://stackoverflow.com/questions/24468830/node-js-writestream-synchronous

const writeToLocalDisk = (stream: fs.ReadStream, path: string) => {
  return new Promise((resolve) => {
    const istream = stream;
    const ostream = fs.createWriteStream(path);
    istream.pipe(ostream);
    istream.on("end", () => {
      console.log(`Fetched ${path} from elsewhere`);
      resolve("");
    });
    istream.on("error", (err) => {
      console.log(JSON.stringify(err, null, 2));
      resolve("");
    });
  });
};
