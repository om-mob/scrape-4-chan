import { FormatLogLine } from "../types";

const format_log_line: FormatLogLine = (idx, status, filename, type, message) => {
  /**** Prepare cell Lengths ****/
  const LEN_SATUS = 17 - 1; // -1 for the space
  const LEN_NAMES = 30 - 1; // -1 for the space
  const LEN_TYPE = 10 - 1; // -1 for the space
  const LEN_MESSAGE = 30 - 1; // -1 for the space
  const LEN_IDX = 6 - 1;

  /**** Prepare cell text ****/
  // const displayed_header = `| ${'-'.repeat(LEN_SATUS)} | ${'-'.repeat(LEN_NAMES)} | ${'-'.repeat(LEN_TYPE)} | ${'-'.repeat(LEN_MESSAGE)} |`
  const displayed_name =
    filename.length > LEN_NAMES - 3
      ? `${filename.slice(0, LEN_NAMES - 3)}...`
      : filename + " ".repeat(LEN_NAMES - filename.length);

  const displayed_status = status + " ".repeat(LEN_SATUS - status.length);
  const displayed_type = type + " ".repeat(LEN_TYPE - type.length);
  const displayed_message =
    message.length > LEN_MESSAGE - 3
      ? `${message.slice(0, LEN_MESSAGE - 3)}...`
      : message + " ".repeat(LEN_MESSAGE - message.length);

  const displayed_idx = // Center index
    " ".repeat(Math.floor((LEN_IDX - idx.toString().length) / 2)) +
    idx.toString() +
    " ".repeat(Math.round((LEN_IDX - idx.toString().length) / 2));

  // console.log("| status           | filename                      | type      | message                  |")
  // console.log(displayed_header)

  /**** Construct log line ****/
  const logLine = `| ${displayed_idx} | ${displayed_status} | ${displayed_name} | ${displayed_type} | ${displayed_message} |`
  // console.log(logLine);
  return logLine;
};

export default format_log_line;
