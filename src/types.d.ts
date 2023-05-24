import { Response, ResponseError } from "superagent";
import { SingleBar } from "cli-progress"

export type TData = {
  thread_stats: TThreadStats;
  thread_title: string;
  thread_url: string;
  posts: TPost2[];
};

export type TSelector = {
  id: string;
  name: string;
  attr?: string;
};

// export type TPost = {
//   [key: string]: string | number | undefined | boolean | any;
//   id: string;
//   title: string;
//   thumbnailUrl: string;
//   videoUrl: string;
//   selected: boolean;
//   date: string;
// };

type TPostImage = {
  post_id: string;
  title: string;
  resolution: string;
  size: string;
  title_extended: string;
  thumbnailUrl: string;
  videoUrl: string;
  thumbnailBase64?: string
};

export type TPost2 = {
  post_id: string;
  post_info: string;
  poster_name: string;
  body: string;
  date: string;
  quoteLinks: string[];
  replies: string[];
  full_body: {
    // all: string;
    blockquote: string;
    post_info: string;
    file: string | null;
  };
  image: TPostImage;
};

export type ThreadArgs = {
  url: string;
  exclude?: (string | number)[];
  include?: (string | number)[];
  // urls?: string[]
};

type TThreadStats = {
  replies: number;
  images: number;
  posters: number;
  page: number;
  total_size: string;
};

export type ThreadNotFoundError = {
  status: number;
  message: string;
  name: string;
  url: string;
};

/**** Function Types ****/

export type WriteImageData = (
  post: TPostImage,
  thread_dir: string,
  results: { errors: string[]; success: string[] },
  idx: number,
  waitingQueue: any[],
  progressBar: SingleBar
) => Promise<void>;

export type WriteThumbnail = (post: TPostImage, thumbnail_dir: string, idx: number, waitingQueue: any[]) => void;

export type FormatLogLine = (idx: number, status: string, filename: string, type: string, message: string) => string;

export type CreateFilesAndFolders = (
  board: string,
  thread_title: string,
  thread_id: string
) => [board_dir: string, data_dir: string, thread_dir: string, data_file_name: string, thumbnail_dir: string, replies_path: string];

export type GetHtml = (url: string) => Promise<[html: string, null] | [null, ThreadNotFoundError | ResponseError]>;
export type GetData = (url: string) => Promise<[TData, null] | [null, ThreadNotFoundError | ResponseError]>;

export type WriteThreadLog = (
  thread_url: string,
  thread_title: string,
  replies_count: string,
  image_count: string,
  total_size: string
) => [false, Error] | [true, null];
