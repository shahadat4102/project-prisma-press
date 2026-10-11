import { Payload, Result } from './../../../generated/prisma/internal/prismaNamespace';
import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utlis/catchasync";
import { commentService } from "./comment.server";
import { sendRespones } from "../../utlis/sendResposes";



const createComment = catchAsync(async(req:Request, res: Response, next: NextFunction )=>{
   const authorId = req.user?.id as string;
   const result = await commentService.createComment(authorId, req.body);
   sendRespones(res,{
    success : true,
    statusCode : httpStatus.CREATED,
    message: "Comment created Successfully",
    data: result
   })
})

const getCommentByAuthorId = catchAsync(async(req:Request, res: Response, next: NextFunction )=>{
   const {authorId} = req.params
   const result = await commentService.getCommentByAuthorId(authorId as string)
   sendRespones(res, {
    success : true,
    statusCode: httpStatus.OK,
    message : "Comments retrieved successfully",
    data : result
   })
})

const getCommentBypostId = catchAsync(async(req:Request, res: Response, next: NextFunction )=>{
    const {postId} = req.params
 const result = await commentService.getCommentBycomentId(postId as string)
 sendRespones(res, {
    success : true,
    statusCode: httpStatus.OK,
    message : "Comments retrieved successfully",
    data : result
   })
})

const updateComment  = catchAsync(async(req:Request, res: Response, next: NextFunction )=>{
    const user = req.user;
    const {commentId} = req.params;
    const authorId = user?.id as string;
    const Payload = req.body;
    const result = await commentService.updateComment(commentId as string, Payload, authorId) 

     sendRespones(res, {
    success : true,
    statusCode: httpStatus.OK,
    message : "Comments retrieved successfully",
    data : result
   })
})

const deleteComment = catchAsync(async(req:Request, res: Response, next: NextFunction )=>{
   const user = req.user;
   const {commentId} = req.params;
   const authorId = user?.id as string
   const result = await commentService.deleteComment(commentId as string, authorId)
    sendRespones(res, {
    success : true,
    statusCode: httpStatus.OK,
    message : "Comments retrieved successfully",
    data : result
   })
})

const moderateComment = catchAsync(async(req:Request, res: Response, next: NextFunction )=>{
    const {commentId} = req.params;
    const payload = req.body;
    const result = await commentService.moderateComment(commentId as string, payload);
    sendRespones(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment moderated successfully",
        data: result
    })
})


export const commertController = {
    createComment,
    getCommentByAuthorId,
    getCommentBypostId ,
    updateComment,
    deleteComment,
    moderateComment
}