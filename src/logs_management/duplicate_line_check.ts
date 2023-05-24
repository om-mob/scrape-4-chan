const get_logs = (archive: string) => {
  const logs = [
    ...new Set(
      archive
        .split("\n")
        .slice(2)
        .map((line) => {
          const thread = line
            .split("|")
            .map((cell) => cell.trim())
            .filter((cell) => cell);
          return `${thread[2]}/${thread[3]}/${thread[5]}/${thread[10]}`; //10 to handle images due to connection or timeout errors
        })
    ),
  ];

  return logs;
};

const duplicate_log_line_check = (archive: string, logLine: string) => {
  const logs = get_logs(archive);
  const logLineList = logLine
    .split("|")
    .map((cell) => cell.trim())
    .filter((cell) => cell);

  const logLineId = `${logLineList[2]}/${logLineList[3]}/${logLineList[5]}/${logLineList[10]}`; //10 to handle images due to connection or timeout errors

  if (logs.includes(logLineId)) return true;

  return false;

  //   if (archive.split("\n").slice(-2)[0] === logLine.slice(0, -1)) return true;
};

export default duplicate_log_line_check;
