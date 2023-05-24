// Local Modules
import getPostsData from "./scrape_html";
import { get_request } from "../send_requests/send_requests";

// import types
import { TData, GetData, GetHtml } from "../types";

// utils
// import { catch_errors } from "../utils/catch_errors";


// const selectors: TSelector[] = [
//   { name: "id", id: "id", attr: "id" },
//   { name: "title", id: "div.fileText a", attr: "title" },
//   { name: "thumbnailUrl", id: "img", attr: "src" },
//   { name: "videoUrl", id: "a.fileThumb", attr: "href" },
//   { name: "date", id: "span.dateTime" },
// ];

const get_html: GetHtml = async (url) => {
  // const [res, err] = await catch_errors(superagent.get, ...[url]) as [Response, ResponseError];
  const [res, err] = await get_request(url);

  if (err) {
    // If the server has responded, and the page is allowed to see the response, there will be e.response.
    const errObj = err.response
      ? {
          status: err.response.status,
          name: err.name,
          message: err.message,
          url,
        }
      : err;
    return [null, errObj];
  }

  const html = res.text;
  return [html, null];
};

const get_data: GetData = async (url) => {
  const [html, err] = await get_html(url);
  if (err) return [null, err];

  const [, , , , , thread_id] = url.split("/");
  const data = getPostsData(html!, thread_id) as TData;
  data.thread_url = url;

  return [data, null];
};

export default get_data;
