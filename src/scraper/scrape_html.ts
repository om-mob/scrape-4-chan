// import packages
import cheerio from "cheerio";
// import html from "./html";

// Import Types
import { TData, TPost2, TPostImage } from "../types";

// function getPostData($: CheerioAPI, selectors: TSelector[], context: Element): TPost {
//   const post = {} as TPost;

//   selectors.forEach((selector) => {
//     // handle id
//     if (selector.name === "id") return post[selector.name as string] = $(context).attr("id");

//     if (selector.attr) {
//       post[selector.name as string] = $(context).find(selector.id).attr(selector.attr);
//       if (!post[selector.name]) // handle empty title
//         post[selector.name as string] = $(context).find(selector.id).text();
//     }
//     else  // handle no attr in selector obj, just store text content
//         post[selector.name as string] = $(context).find(selector.id).first().text();
//   });

//   post.selected = false;
//   return post;
// }

function get_one_size(acc: number, image: TPostImage): number {
  // console.log(image)
  const [size_str, unit] = image.size.split(" "); // 884 KB, 1 MB
  if (unit.toLocaleLowerCase() === "kb") return parseFloat(size_str) / 1024 + acc;
  return parseFloat(size_str) + acc;
}

function size_to_string(size: number): string {
  if (size > 1024) return (size / 1024).toFixed(2) + " GB";
  if (size > 1) return Math.ceil(size).toString() + " MB";

  return Math.ceil(size).toString() + " KB";
}

function get_total_size(posts: TPost2[]): string {
  const total_size = posts.reduce((acc: number, post: TPost2) => {
    if (!post.image?.size) return acc;
    return get_one_size(acc, post.image);
    // const [size_str, unit] = post.image.size.split(' ') // 884 KB, 1 MB
    // if (unit.toLocaleLowerCase() === 'kb') return (parseFloat(size_str) / 1024) + acc
    // return parseFloat(size_str) + acc
  }, 0);

  return size_to_string(total_size);
}

export default function getPostsData(html: string, thread_id: string): TData {
  // const postList: TPost[] = [];
  const $ = cheerio.load(html);

  const thread_title = $(".desktop .subject").first().text().trim() || $(`#m${thread_id}`).text().trim();
  // console.log(thread_title)

  let img_count: number = 0;
  let total_size = 0;
  const all_posts = $(".post")
    .toArray()
    .map((el) => {
      const post: TPost2 = {
        post_id: $(el).attr("id")!,
        post_info: $(el).find("div.postInfo.desktop").text(),
        poster_name: $(el).find("div.postInfo.desktop span.name").text(),
        body: ($(el).find("blockquote.postMessage").html() || $(el).find("blockquote.postMessage").text())
          .replace(/<br>/g, "\n")
          .replace(/&gt;/g, ">")
          .replace(/<a [a-z 0-9 = \\ " #]*>/g, "")
          .replace(/<\/a>/g, ""),
        date: $(el).find("div.postInfo.desktop span.dateTime").text(),
        quoteLinks: $(el)
          .find("blockquote.postMessage a.quotelink")
          .toArray()
          .map((el) => $(el).text()),
        replies: [],
        full_body: {
          // all: $(el).html()!,
          blockquote: $(el).find("blockquote.postMessage").html() || $(el).find("blockquote.postMessage").text(),
          post_info: $(el).find("div.postInfo.desktop").html()!,
          file: $(el).find("div.file").html() || null
        },
        image: {} as TPostImage,
      };
      if ($(el).find("img").attr("src")) {
        if ($(el).find("img").attr("class")?.includes("fileDeletedRes")) return post; // Check if the image file was deleted
        img_count++;
        post.image = {
          post_id: $(el).attr("id")!,
          title:
            $(el).find("div.file .fileText a").first().attr("title")?.trim() ||
            $(el).find("div.file .fileText a").first().text().trim(),
          resolution: $(el).find("div.file .fileText").first().text().trim().split(" ").slice(-1)[0].slice(0, -1),
          size: $(el).find("div.file .fileText").first().text().trim().split(" ").slice(-3).slice(0, -1).join(" ").slice(1, -1),
          title_extended: $(el).find("div.file .fileText").first().text().trim(),
          thumbnailUrl: $(el).find("div.file .fileThumb img").attr("src")!,
          videoUrl: $(el).find("div.file .fileText a").attr("href")!,
        };
        total_size = get_one_size(total_size, post.image);
      }
      return post;
    });

  // Get post Replies
  all_posts.forEach((post) => (post.replies = get_replies(post, all_posts)));

  const thread_stats = {
    replies: all_posts.length,
    images: img_count,
    posters: 0,
    page: 0,
    total_size: size_to_string(total_size),
  };

  // $(".post").each(function () {
  //   const self = this;
  //   // check if post contains image
  //   if (!($(this).find("img").attr("src"))) return
  //   // postList.push(getPostData($, selectors, self));
  // });
  return { thread_title, thread_stats, posts: all_posts } as TData;
}

const get_replies = (post: TPost2, allPosts: TPost2[]) => {
  return allPosts.filter((p) => p.quoteLinks.includes(">>" + post.post_id.substring(1))).map((p) => p.post_id.substring(1));
};

const get_replies_by_id = (postId: string, allPosts: TPost2[]) => {
  return allPosts.filter((p) => p.quoteLinks.includes(">>" + postId.substring(1))).map((p) => p.post_id.substring(1));
};
