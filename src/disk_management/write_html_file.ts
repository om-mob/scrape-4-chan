import gen_html from "../gen_html";
import { TData } from "../types";

const write_html_file = (data: TData, thread_dir: string) => {
  gen_html(data, thread_dir)
}


export default write_html_file