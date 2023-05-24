import pug from "pug";
import fs from "fs";
import path from "path";
import { TData } from "../types";
import add_base64_thumb from "./add_base64_thumb";

const GREEN_BOARDS = ["gif"];
const BLUE_BOARDS = ["wsg"];

const compiledFunction = pug.compileFile(path.join(__dirname, "template.pug"));

export default function gen_html(data: TData, thread_dir: string) {

  const board = data.thread_url.split("/")[3];
  const pageTitle = `/${board}/ - ${data.thread_title}`;
  const stylesFile = get_styles_path(board)
  
  add_base64_thumb(thread_dir, data)
  
  const styleString = fs.readFileSync(stylesFile, "utf-8");
  
  
  const html = compiledFunction({ ...data, pageTitle, styleString, board });
  
  // console.log(html);
  fs.writeFile(path.join(thread_dir, `${data.thread_title.trim().replace(/[|@"<>\\\/?:]/g, "-")}.html`), html, (err) => {
    if (err) console.error(err);
  });
}

function get_styles_path(board: string) {
  let stylesFile = "";
  if (GREEN_BOARDS.includes(board)) stylesFile = "green-styles.css";
  else stylesFile = "blue-styles.css";

  return path.join(__dirname, "styles", stylesFile)
}
