
import { NextFunction, Request, response, Response } from "express";
import { catchAsync } from "../../utlis/catchasync";
import { postservice } from "./post.server";
import { sendRespones } from "../../utlis/sendResposes";
import httpStatus from "http-status"


const createPost = catchAsync(async(req: Request, res: Response, next: NextFunction )=>{
     const id = req.user?.id

     const payload = req.body;

     const result = await postservice.createPost(payload, id as string)

     sendRespones(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Post created SuccessFully",
        data: result

     })
})

const getAllPosts = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
   const qury = req.query
   console.log(qury)
    const result = await postservice.getAllPosts(qury);

    sendRespones(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Post Revied SuccessFully",
        data: result
    })

})

const getPostById = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
     const postId = req.params.postId;
     if(!postId){
        throw new Error("Post Id Requied In Params")
     }
     const result = await postservice.getPostById(postId as string);
     sendRespones(res, {
        success : true,
        statusCode : httpStatus.OK,
        message : "post retrieved Successfull ",
        data: result
     })
    
})

const updatePost = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
     const authorId = req.user?.id
     const isAdmin = req.user?.role === "ADMIN";

     const postId = req.params.postId;
      if(!postId){
        throw new Error("Post Id Requied In Params")
     }
     const payload = req.body;
     
     const result = await postservice.updatePost(postId as string, payload, authorId as string, isAdmin)
       sendRespones(res, {
        success : true,
        statusCode : httpStatus.OK,
        message : "post updated Successfully ",
        data: result
     })
    
})

const deletePost = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
       const authorId = req.user?.id
     const isAdmin = req.user?.role === "ADMIN";

     const postId = req.params.postId;
      if(!postId){
        throw new Error("Post Id Requied In Params")
     }
    
     
    await postservice.deletePost(postId as string,  authorId as string, isAdmin)
       sendRespones(res, {
        success : true,
        statusCode : httpStatus.OK,
        message : "post dedete Successfully ",
        data: null
     })
    
})

const getPostsStats = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const result = await postservice.getPostsStats();
    
    sendRespones(res, {
      success : true,
        statusCode : httpStatus.OK,
        message : "post state retrievid Successfully ",
        data: result
    })
    
})

const getMyPosts = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
     const authorId = req.user?.id;
     const result = await postservice.getMYPosts(authorId as string)

      sendRespones(res, {
        success : true,
        statusCode : httpStatus.OK,
        message : " My posts retrieved Successfull ",
        data: result
     })

})


export const postController = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost, 
    deletePost,
    getPostsStats,
    getMyPosts
}