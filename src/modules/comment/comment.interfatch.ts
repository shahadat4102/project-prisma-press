
import { commentStataus } from "../../../generated/prisma/enums";



export interface ICreateCommentPayload {
    postId: string;
    authorId: string;
    content: string
}

export interface IUpdateCommentPayload {
    content ?: string,
    statuse ?: commentStataus
}

export interface IModerateCommentPayload {
    status: commentStataus
}