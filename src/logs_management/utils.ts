import {
  HEADER_CELLS,
  LEN_BOARD,
  LEN_DATE,
  LEN_HOST,
  LEN_IMAGE_COUNT,
  LEN_REPLY_COUNT,
  LEN_SIZE,
  LEN_THREAD_ID,
  LEN_TITLE,
} from "./consts";

import format_log_line from "./format_log_line";

export const get_ruler = (lenCells: number[]) =>
  "| " + lenCells.map((lenCell) => "-".repeat(lenCell)).join(" | ") + " |";

export const get_log_header = () => {
  return (
    format_log_line(HEADER_CELLS) +
    get_ruler([
      LEN_DATE,
      LEN_TITLE,
      LEN_BOARD,
      LEN_THREAD_ID,
      LEN_HOST,
      LEN_REPLY_COUNT,
      LEN_IMAGE_COUNT,
      LEN_SIZE,
      1,1,1
    ]) +
    "\n"
  );
};
