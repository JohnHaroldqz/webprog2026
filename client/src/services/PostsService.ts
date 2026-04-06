import type { PostType } from "../pages/Posts";
import httpClient from "./HttpCommon";

export const listPosts = (params: any) => {
    //console.log(authHeader())
    return httpClient.get('/posts', {
        params: params,
        //headers: authHeader()
    })
};

export const createPost = (product: PostType) => {
    return httpClient.post('/posts', product, { 
        //headers: authHeader()
    });
}

export const updatePost = (id: string, product: PostType) => {
    return httpClient.put(`/posts/${id}`, product, { 
        //headers: authHeader()
    });
}