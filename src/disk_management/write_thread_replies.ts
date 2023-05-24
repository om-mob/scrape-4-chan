import fs from "fs";
import { TData } from "../types";

const write_thread_replies = (replies_path: string, thread_data: TData) => {
  const write_stream = fs.createWriteStream(replies_path, { flags: "a" });

  // write stats
  write_stream.write(`\
🔗 ${thread_data.thread_url}
🧵 ${thread_data.thread_title}
💬 ${thread_data.thread_stats.replies}
🖼️ ${thread_data.thread_stats.images}
💾 ${thread_data.thread_stats.total_size}
--------------------
`);

  // write replies
  thread_data.posts.forEach((post) => {
    let img_prefix = "❎";
    if (post.image.title) img_prefix = post.image.videoUrl.slice(-4) === "webm" ? `🎞️` : `🖼️`;

    write_stream.write(`\
📋 ${post.post_info.trim()}${post.replies.length ? ` ▶ ${post.replies.map(reply => ">>" + reply).join(' ')}` : ""}
${img_prefix} ${post.image.title_extended}
📄 ${post.body}\n
`);
  });

  write_stream.end();
};

export default write_thread_replies

// `
// 🔗 https://boards.4chan.org/<borad>/thread/<thread_id>
// 🧵 <thread_title>
// 💬 303
// 🖼️ 94
// 💾 285 MB
// --------------------
// 📋 <thread_title> ▶ <reply_1> >><reply_2> Anonymous  <thread_datetime> No.<thread_id>
// 🎞️ <image_title>.webm
// 📄 another one of those
// `;
