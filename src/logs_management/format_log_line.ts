const get_displayed_cell = (cellText: string, lenCell: number) => {
    return lenCell - cellText.length >= 0 ? cellText + ' '.repeat(lenCell - cellText.length) : cellText.slice(0, lenCell-3) + "..."
    // return cellText + ' '.repeat(lenCell - cellText.length)
}


const format_log_line = (cells: [string, number][]) => {
    
    const f = "| " + cells
        .map(([cell, lenCell]) => get_displayed_cell(cell, lenCell))
        .join(" | ")
        + " |\n"

    return f
}
// const format_log = (date: string, title: string, url: string, repliesCount: string, imageCount: string) => {
//     // const displayed_date = get_displayed_cell(date, LEN_DATE)
//     // const displayed_title = get_displayed_cell(title, LEN_TITLE)
//     // const displayed_url = get_displayed_cell(url, LEN_URL)
//     // const displayed_repliesCount = get_displayed_cell(repliesCount, LEN_REPLY_COUNT)
//     // const displayed_imageCount = get_displayed_cell(imageCount, LEN_IMAGE_COUNT)
//     // const formated_log = `| ${displayed_date} | ${displayed_title} | ${displayed_url} | ${displayed_repliesCount} | ${displayed_imageCount} |\n`

//     const f = "| " + [
//         [date, LEN_DATE], 
//         [title, LEN_TITLE], 
//         [url, LEN_URL], 
//         [repliesCount, LEN_REPLY_COUNT], 
//         [imageCount, LEN_IMAGE_COUNT]
//     ]
//         .map(([cell, lenCell]) => get_displayed_cell((cell as string), (lenCell as number)))
//         .join(" | ")
//         + " |\n"

//     return f
// }

export default format_log_line