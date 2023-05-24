// import libraries

// import packages
import superagent, { Response, ResponseError } from "superagent";

// import types

// import modules

// import utils
import { catch_errors } from "../utils/catch_errors";

// import configs

/**** Module ****/

type GetRequest = (url: string) => Promise<[Response, ResponseError]>;
type GetRequestRaw = (url: string) => Promise<Response>;

export const get_request: GetRequest = catch_errors<GetRequestRaw, GetRequest>(
  async (url) => await superagent.get(url).timeout(60000)
);

type PostRequest = <TPayload>(url: string, payload: TPayload) => Promise<[Response, ResponseError]>;
type PostRequestNoErrorHandle = <T extends string | object>(url: string, payload: T) => Promise<Response>;

const post_request: PostRequest = catch_errors<PostRequestNoErrorHandle, PostRequest>(
  async <T extends string | object>(url: string, payload: T) => {
    return await superagent.post(url).send(payload);
  }
);
