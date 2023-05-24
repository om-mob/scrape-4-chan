import fs from "fs";

// import packages
import { SingleBar, MultiBar } from "cli-progress"

// import modules
import write_image_data from "./write_image_data";
import create_files_and_folders from "./create_files_and_folders";
import write_thumbnails from "./write_thumbnails";
import write_thread_replies from "./write_thread_replies";
import write_image_ref from "./write_image_ref";
import write_html_file from "./write_html_file";

// import { catch_errors } from "../utils/catch_errors";

// Import types
import { TData } from "../types";

// import utils
import { waitFor, WaitingQueue } from "../utils/utils";

type SelectedImages = {
  include?: (string | number)[];
  exclude?: (string | number)[];
};

export default async function save_images_to_disk(data: TData, selectedImages: SelectedImages, multibar: MultiBar) {
  /***** create necessary folders  *****/

  const [, , host, board, , thread_id] = data.thread_url.split("/");
  const [, , thread_dir, data_file_name, thumbnail_dir, replies_path] = create_files_and_folders(
    board,
    data.thread_title,
    data.posts[0].post_id
  );

  fs.writeFileSync(data_file_name, JSON.stringify(data));

  /***** Write replies file *****/
  write_thread_replies(replies_path, data);

  /***** download images *****/
  const progressBarPayload = {thread: data!.thread_title, board, thread_id, replies_count: data.thread_stats.replies, total_size: data.thread_stats.total_size } as const
  const progressBar = multibar.create(data!.thread_stats.images, 0, progressBarPayload)
  const results = await download_images(data, selectedImages, thumbnail_dir, thread_dir, progressBar);
  // console.log(results)

  
  /***** Write Html file *****/
  write_html_file(data, thread_dir);

  return results;
}

async function download_images(data: TData, selectedImages: SelectedImages, thumbnail_dir: string, thread_dir: string, progressBar: SingleBar) {
  const results: { errors: string[]; success: string[] } = { errors: [], success: [] };

  const wq = new WaitingQueue(9, 0);
  const wqThumbnails = new WaitingQueue(10);

  const downloadedArr = get_downloaded_arr(`${thread_dir}\\image_ref.txt`);

  // progress bar re-set total, if the user passed an include array
  if (selectedImages.include?.length) progressBar.setTotal(selectedImages.include.length)

  for (const post of data.posts) {
    const postId = parseInt(post.post_id.slice(1));
    // check includes list
    if (selectedImages.include?.length && !selectedImages.include?.includes(postId)) {
      if (post.image.post_id) write_image_ref(thread_dir, post.image);
      continue;
    }
    // check excludes list
    if (selectedImages.exclude?.length && selectedImages.exclude?.includes(postId)) {
      if (post.image.post_id) write_image_ref(thread_dir, post.image);
      continue;
    }
    if (!post.image.title) continue; // check if post is not an image
    if (file_already_exist(downloadedArr, post.post_id) && !selectedImages.include?.includes(postId)) {
      progressBar.increment(1)
      continue;
    }
    const idx = data.posts.indexOf(post) + 1; // for logging purpose

    await wq.add(post.image.title);
    await wqThumbnails.add(post.image.title);
    write_thumbnails(post.image, thumbnail_dir, idx, wqThumbnails.processes);
    write_image_data(post.image, thread_dir, results, idx, wq.processes, progressBar);
  }

  await waitFor(wq.processes);
  await waitFor(wqThumbnails.processes);

  return results;
}

const file_already_exist = (downloadedArr: string[], post_id: string): boolean => {
  if (downloadedArr.includes(post_id)) return true;
  return false;
};
const get_downloaded_arr = (imageRefLoc: string): string[] => {
  try {
    return fs.readFileSync(imageRefLoc, "utf-8").split("\n");
  } catch (e) {
    return [];
  }
};
