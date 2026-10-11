import { PostStatus } from "../../../generated/prisma/enums";




export interface ICreatePostpayload {
    title : string;
    content : string;
    thumbnail?: string;
    isFeatured?: boolean;
    isPremium?: boolean;
    status?: PostStatus;
    tags: string[];
}

export interface IupdatePostpalyload {
    title?: string;
    content?: string;
    thumbnail?: string;
    isFeatured?: boolean;
    status?: PostStatus;
    tags?: string[];
}


export interface IPostQuery {
    searchTerm?: string;
    page?: string;
    limit?: string;
    SortOrder?: string;
    sortBy?: string;
    title?: string;
    content?: string;
    authorId?: string;
    isFeatured?: boolean;
    tags?: string;
    status?: PostStatus;
}