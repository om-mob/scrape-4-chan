import fs from "fs";
import path from "path";

// import types
import { CreateFilesAndFolders } from "../types";

// import configs
import { DATA_PATH } from "../config/consts";

/**
 * Creates Necessary folders for the data - path is: "/data/*" - (root is the project root)
 * every board has its own folder.
 * every thread has its own folder.
 * Note: This function doesn't save the data.json file, it returns the path for it
 * @param board - [wsg, hr, gif, ...]
 * @param thread_title
 * @param thread_id extracted from url (or from first post id)
 * @returns tuple(board_dir, data_dir, thread_dir, data_file_name, thumbnail_dir)
 */
const create_files_and_folders: CreateFilesAndFolders = (board, thread_title, thread_id) => {
  /***** prepare dir names *****/
  const data_dir = DATA_PATH;
  const board_dir = path.join(data_dir, board);
  const thread_dir = path.join(
    board_dir,
    thread_title.trim().replace(/[|@"<>\\\/?:]/g, "_") + " - " + thread_id
  );
  const thumbnail_dir = path.join(thread_dir, "thumbnails");
  const data_file_name = path.join(thread_dir, "meta.json");
  const replies_path = get_thread_replies_path(thread_dir)
  // const downloaded_file = path.join(thread_dir, "downloaded.txt")

  /***** create dirs *****/
  if (!fs.existsSync(data_dir)) fs.mkdirSync(data_dir);
  if (!fs.existsSync(board_dir)) fs.mkdirSync(board_dir);
  if (!fs.existsSync(thread_dir)) fs.mkdirSync(thread_dir);
  if (!fs.existsSync(thumbnail_dir)) fs.mkdirSync(thumbnail_dir);
  // fs.appendFileSync(downloaded_file, ``)

  return [board_dir, data_dir, thread_dir, data_file_name, thumbnail_dir, replies_path];
};

export default create_files_and_folders;

function get_thread_replies_path(thread_dir: string) { 
  let i = 1;
  let replies_path = thread_dir + `\\replies-${i}.txt`
  while (true) {
    if (!fs.existsSync(replies_path)) return replies_path;
    i++;
    replies_path = thread_dir + `\\replies-${i}.txt`
  }
}
