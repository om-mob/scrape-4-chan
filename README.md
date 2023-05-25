# scrape-4-chan
4 chan scrapper to download threads posts and images

## Screenshots and Demo

TODO: Include and example run and demonstrate application features.

## to install
```bash
git clone https://github.com/om-mob/scrape-4-chan.git
cd scrape-4-chan
npm install
```

## to Run (basic)
```bash
npx ts-node src <thread_url>
```
if you run the command again, the thread is going to be updated (all recent posts and images will be pulled)

**Note:** each thread can be uniquely identified by its board and its ID. So instead of using the full url, you can:
```bash
npx ts-node src <thread_board>/<thread_id>
## for example
npx ts-node src g/93641433
```

### download multiple threads at once
```bash
npx ts-node src <thread_url_1> <thread_url_2> <thread_url_3> <thread_url_4>
```

### skip images/videos
There is no way to skip posts, but you can skip images. Use:
```bash
npx ts-node src <thread_url> -e <post_id_that_has_image_file_you_want_to_skip>
```
**Note:** 
- this will skip only the image/video file, but post text will be downloaded
- This also works with multiple threads
```bash
npx ts-node src <thread_url_1> -e <post_id_1_from_thread_1> <post_id_2_from_thread_1> <post_id_1_from_thread_2>
```

### (Select) Include Only these images/videos
You can also select some images/videos to be downloaded. **Note** this will download all text.
```bash
npx ts-node src <thread_url> -i <post_id_1> <post_id_2> <post_id_3>
```
**Note:**
- This also works with multiple threads
- the `-i` flag over writes the `-e` flag
- if `-i` flag is used and the image/video was downloaded, the image will be re-downloadeded.

### Update all threads
to update all the threads you downloaded use:
```bash
npx ts-node src -u
```
this will pull all recent posts and images from all threads that are recorded in the archive.

## Archive file
Archive file has the following columns
```
| date | title | board | thread id | host | replies | image | size | A | E | R |
```
- **date:** the date you downloaded the thread or the date it was last updated
- **title:** Original title of the thread
- **board:** the board of the thread
- **thread id:** the thread id
- **host:** could be `boards.4channel.org` or `boards.4chan.org`
- **replies:** replies count. (number of posts)
- **image:** images/videos count. (number of images). How many images are in the thread, not how many images you included using `-i` flag.
- **size:** Total size of images + videos in the threads (in MB)
- **A:** a flag to know if the thread still up or not. Takes either "T" or "F". Used when you use`-u` to exclude threads that has the been removed
- **R:** a flag to know if the thread encountered errors while downloading. some times you have jerky internet connections some images are skipped. you want to re-run the program to retry downloading these images. since there is no change in the archive, the request is not going to be made. This flag forces the request to be made of set to "T".
- **E:** This flag is for you to set to "T". If a thread is set to T, it will not be updated any more when using `-u`!

## Data folder
You can change the data path by changing the consts file inside the config folder `\src\config\consts.ts`
It's currently set to this:
```ts
import path from "path"

export const DATA_PATH = path.join(__dirname, "..", ".." , "data")
export const ARCHIVE_PATH = path.join(DATA_PATH, "archive.txt")
```
You can change it to this if you like:
```ts
import path from "path"

export const DATA_PATH = path.join(process.env.HOMEPATH!,"Videos" , "4_chan_data")
export const ARCHIVE_PATH = path.join(DATA_PATH, "archive.txt")
```
Don't forget the `!` after `process.env.HOMEPATH`
You can also make it any other path

The data folder is organized like so:
```
data
├───archive.txt
└───<board>
    ├─── <thread_title> - <thread_id>
        ├─── [images and videos]
        ├─── image_ref.txt
        ├─── replies-<count>.txt
        ├─── meta.json
        ├─── <thread_title>.html
        └───thumbnails
              └─── [thumbnails]
```
### `image_ref.txt`

This folder holds a list post ids of images downlaoded. Used to exclude downloaded images from being downloaded again. So you are able to change the image/video name without worrying.
**Note:**
- If `-i` the image will be downloaded nonetheless.
- If the thumbnail is not downloaded but the image/video itself is downloaded, the thumbnail will be disregarded unless you use `-i`
- 
### replies-1.txt

This file is on the form:
```
🔗 <thread_url>
🧵 <thread_title>
💬 <reply_count>
🖼️ <image_count>
💾 <size> MB
--------------------
[posts]
```

Posts are on the form:
```
📋 <poster> <date> No.<id> ▶ >> <reply_id_1> [...replies>
🎞️ File: file_title (<file_size> MB, <file_dimensions>)
📄 Posts text.
```

