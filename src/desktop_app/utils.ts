export function validate_url(url: string, err: string[]) {

    if (url === "") {
        err.push("Error: Invalid Url")
        return [err, null]    
    }

    const japanese_culture = ["a", "c", "w", "m", ]
    const video_games = ["v"]
    const interests = ["co"]
    const creative = ["i", "wsg", "ic"]
    const other = ["biz"]
    const misc = ["pol"]
    const adult = ["s", "hc", "hm", "h", "hr", "gif", "t"]
    const valid_4chan_boards = [
        ...japanese_culture, 
        ...video_games, 
        ...interests, 
        ...creative, 
        ...other, 
        ...misc, 
        ...adult
    ]

    // ["https:", "", "boards.4channel.org", "wsg", "thread", "4857910"]
    const [schema, ,host, board, thread, thread_id, nothing] = url.split("/")
    if (schema !== "https:") err.push(`Error: invalid schema: ${schema}`)
    if (!["boards.4channel.org", "boards.4chan.org"].includes(host)) err.push(`Error: not 4chan url: ${host}`)
    if (!board) err.push(`Error: Please specify the board and the thread`)
    else if (!valid_4chan_boards.includes(board)) err.push(`Error: invalid 4chan board: ${board}`)
    if (thread !== "thread") err.push(`Error: Please specify valid thread`)
    if (nothing != undefined) err.push(`Error: Invalid thread ${nothing}`)
}


export function construct_valid_url(url: string): string {
    /**
     * valid url:
     * https://boards.4chan.org/<board>/thread/<thread_id>
     * https://boards.4chan.org/<board>/thread/<thread_id>/
     * http://boards.4chan.org/<board>/thread/<thread_id>
     * boards.4chan.org/<board>/thread/<thread_id>
     * boards.4chan.org/<board>/thread/<thread_id>#<post_id>
     * https://boards.4chan.org/<board>/thread/<thread_id>#<post_id>
     * https://boards.4chan.org/<board>/thread/<thread_id>#<post_id>/
     */
    const urlList = url.split("/")
    if (urlList.length === 2) {
        const [board, thread_id] = urlList
        let host = "boards.4channel.org"
        const misc = ["pol"]
        const adult = ["s", "hc", "hm", "h", "hr", "gif", "t"]
        
        if ([...adult, ...misc].includes(board)) host = "boards.4chan.org"

        return ["https:", "", host, board, "thread", thread_id].join("/")
    }
    if (urlList.length > 7) return ""
    if (urlList.length === 5 || urlList.length === 7) {
        const last_el = urlList.pop()
        if (last_el !== "") return ""
    }
    if (urlList.length === 4){
        const [thread_id, post_id] = urlList[3].split("#")
        return ["https:", "",urlList[0], urlList[1], "thread", thread_id].join("/")
    }
    if (urlList.length === 6){
        if (urlList[5] === "") return "" // This case: boards.4chan.org/<board>/thread/<thread_id>//
        // boards.4chan.org/<board>/thread/<thread_id>/garbage/
        const [thread_id, post_id] = urlList[5].split("#")
        if (isNaN(parseInt(thread_id))) return ""
        return ["https:", "",urlList[2], urlList[3], "thread", thread_id].join("/")
    }
    return url

}
