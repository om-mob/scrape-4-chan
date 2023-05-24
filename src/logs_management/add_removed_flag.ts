import fs from "fs";
import { LEN_BOARD, LEN_DATE, LEN_HOST, LEN_IMAGE_COUNT, LEN_REPLY_COUNT, LEN_SIZE, LEN_THREAD_ID, LEN_TITLE } from "./consts";
import { ARCHIVE_PATH } from "../config/consts";
import format_log_line from "./format_log_line";

// const ARCHIVE_PATH = "path\\to\\data\\archive - Copy.txt"

const add_removed_flag = (url: string) => {
  if (!fs.existsSync(ARCHIVE_PATH)) return [null, { message: "archive file doesn't exist" }];
  const [schema, , host, board, thread, thread_id] = url.split("/"); // https://boards.4channel.org/<board>/thread/<thread_id>
  const archive_string = fs.readFileSync(ARCHIVE_PATH, "utf-8");

  // console.log(board,thread_id)
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
    .slice(0, -1)
    .map((line) => line.split("|").map((entry) => entry.trim()))
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
        line[4] === thread_id && line[3] === board ? ["T", 1] : [line[9], 1],
        [line[10], 1],
      ]);
    })
    .join("");
  // console.log(new_archive)
  fs.writeFileSync(ARCHIVE_PATH, new_archive);

  return [true, null];
  // return new_archive;
};

// add_removed_flag("https://boards.4channel.org/<board>/thread/<thread_id>")

export default add_removed_flag;
