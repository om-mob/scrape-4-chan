import * as cliProgress from "cli-progress"

const format = `{bar} {percentage}% | {total_size} | {value}/{total} | {replies_count} | {thread_id} | {board} | {thread} | Elapsed: {duration}s`

const multibar = new cliProgress.MultiBar({
    clearOnComplete: false,
    hideCursor: true,
    format,
}, cliProgress.Presets.shades_grey)

export default multibar


/*

    [`{thread}`, LEN_TITLE],
    [`{bar}`, LEN_BAR],
    [`{percentage}%`, LEN_PERCENTAGE],
    [`{board}`, LEN_BOARD],
    [`{value}/{total}`, LEN_IMAGE_COUNT + 2],
    [`{thread_id}`, LEN_THREAD_ID],
    [`{replies_count}`, LEN_REPLY_COUNT],
    [`{total_size}`, LEN_SIZE],
*/