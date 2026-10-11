import { title } from 'node:process';
import { PostWhereInput } from './../../../generated/prisma/models/Post';
import { commentStataus, PostStatus } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';
import { ICreatePostpayload, IPostQuery, IupdatePostpalyload } from './post.interface';


const createPost = async(payload: ICreatePostpayload, userId : string ) =>{
    const user = await prisma.user.findUniqueOrThrow({
        where:{
            id: userId
        },
        include: {
            subscription : true
        }
    })
    if(payload.isPremium && user.subscription?.status !== "ACTIVE"){
        throw new Error("You are Not a preium user . So You Can not create Preium user")
    }
   const result = await prisma.post.create({
    data:{
        ...payload,
        authorId: userId
    }
   })
   return result
}


const getAllPosts = async(query: IPostQuery) => {

    const limit = query.limit? Number(query.limit) :10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1)* limit;
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder = query.SortOrder ? query.SortOrder : "desc"

    const tags = query.tags ? JSON.parse(query.tags as string) : null
    const tagsArray =  Array.isArray(tags) ? tags : []

    const andCondition  : PostWhereInput [] = []

    if(query.searchTerm){
        andCondition.push({
              OR:[
                {
                    title:{
                        contains : query.searchTerm,
                        mode: "insensitive"
                    },   
                },
                {
                     content:{
                        contains : query.searchTerm,
                        mode: "insensitive"
                    }
                }
            ]
        })
    }
      if(query.title){
            andCondition.push({
                title: query.title
            })
        }
      if(query.content){
        andCondition.push({
            content : query.content
        })
      }  
     if(query.authorId){
        andCondition.push({
            authorId: query.authorId
        })
     } 
    if(query.isFeatured){
        andCondition.push({
            isFeatured : Boolean(query.isFeatured)
        })
    } 
   if(query.tags){
    andCondition.push({
        tags : {
            hasSome: tagsArray
        }
    })
   } 
  if(query.status){
    andCondition.push({
        status: query.status
    })
  } 
  andCondition.push({
    isPremium : false
  })

  const posts = await prisma.post.findMany({
    //filtiring meta opertion
//    where:{
//     title: "My food Post",
//     content: "Ronaldo"
//    },
    //   where:{
    //     AND:[
    //         {
    //             title: "My food Post",
    //         },
    //         {
    //             content: "Ronaldo",
    //         }
    //     ]
    // },
  //____________-------------------------------____
  //serching partial match  
    //  where:{
    //     OR: [
    //      {
    //         title:{
    //             contains: "Ro",
    //             mode: "insensitive"
    //         },
    //      },
    //      {
    //         content:{
    //             contains: "Ro",
    //             mode: "insensitive"
    //         }
    //      }
    //     ]
    //  },
//_-------------_________--_______--___-__-___
// where:{
//     AND:[
//         {
//          OR:[
//             {
//                 title:{
//                     contains: "Ron",
//                     mode: "insensitive"
//                 }
//             },
//             {
//                content:{
//                 contains: "Ron",
//                 mode : "insensitive"
//                }
//             }
//          ]

//         },
//         {
//             title: "Ronaldo Nazraio"
//         },
//         {
//             content: "Ronaldo"
//         }
//     ]
// },
//-_-------------------___________---________________
    // where:{
    //     AND:[
    //        query.searchTerm ? {
    //         OR:[
    //             {
    //                 title:{
    //                     contains : query.searchTerm,
    //                     mode: "insensitive"
    //                 },   
    //             },
    //             {
    //                  content:{
    //                     contains : query.searchTerm,
    //                     mode: "insensitive"
    //                 }
    //             }
    //         ]
    //        } : {},

    //         //title filtering 
    //        query.title ? {title: query.title} : {},

    //        //content filtering
    //        query.content ? {content: query.content} : {}
    //     ]
    // },



    where :{
        AND: andCondition
    },


    take: limit,
    skip: skip,

    orderBy:{
        [sortBy] : sortOrder
    },


    include: {
        author: {
            omit:{
                password: true
            }
        },
        comments: true
    }
  })

  const totalpostcomment = await prisma.post.count({
    where:{
        AND: andCondition
    }
  })
  
  return {
    data: posts,
    meta: {
        page : page,
        limit: limit,
        total: totalpostcomment,
        totalPages : Math.ceil(totalpostcomment / limit)
    }
  }
}

const getPostById =async (postId: string) =>{

//   const post = await prisma.post.findUniqueOrThrow({
//     where:{
//         id: postId,
//     },

//   })

// const updatedPost = 

//  await prisma.post.update({
//     where:{
//         id: postId,
//     },
//     data:{
//         views : {
//             increment : 1
//         },
//     },
//     // include: {
//     //     author: {
//     //         omit:{
//     //             password: true
//     //         }
//     //     },
//     //     comments: true
//     // }
// })  
// const post = await prisma.post.findUniqueOrThrow({
//     where: {
//         id: postId
//     },
//     include: {
//         author:{
//             omit:{
//                 password: true
//             }
//         },
//         comments:{
//             where:{
//                 status : commentStataus.APPROVED
//             },
//             orderBy:{
//                 createdAt: "desc"
//             }
//         },
//         _count : {
//             select: {
//                 comments : true
//             }
//         }
//     }

// })
//  return post


 //trenjsion ID 
 
 
 const transactionResult = await prisma.$transaction(
    async(tx)=>{
        await tx.post.update({
             where:{
        id: postId,
    },
    data:{
        views : {
            increment : 1
        },
    }
        });
     // throw new Error("fake error")
        const post = await tx.post.findUniqueOrThrow({
                where: {
                   id: postId,
                   isPremium: false
              },
    include: {
        author:{
            omit:{
                password: true
            }
        },
        comments:{
            where:{
                status : commentStataus.APPROVED
            },
            orderBy:{
                createdAt: "desc"
            }
        },
        _count : {
            select: {
                comments : true
             }
         }
      }
   })
   return post

    }
  );
  return transactionResult

}

const updatePost = async(postId: string, payload: IupdatePostpalyload, authorId: string, isAdmin: boolean) =>{

    const post = await prisma.post.findFirstOrThrow({
        where : {
            id : postId
        }
    })
    if(!isAdmin && post.authorId !== authorId){
        throw new Error("YOu are not the ownet of this Post!")
    }

    const result = await prisma.post.update({
        where : {
            id : postId
        },
        data : payload,
        include : {
            author : {
                omit: {
                    password : true
                }
            },
            comments: true
        }
    })
    return result;
}

const deletePost = async (postId: string, authorId: string, isAdmin: boolean) =>{
   const post = await prisma.post.findFirstOrThrow({
        where : {
            id : postId
        }
    })
    if(!isAdmin && post.authorId !== authorId){
        throw new Error("YOu are not the ownet of this Post!")
    }

    await prisma.post.delete({
        where : {
            id: postId
        }
    })
  

}

const getPostsStats =async () =>{
 const transactinResult = await prisma.$transaction(
  async(tx)=>{

    // const totalPost = await tx.post.count();

    // const totalpublicPost = await tx.post.count({
    //     where:{
    //         status: PostStatus.PUBLISHED
    //     }
    //   })

    //     const totalDrafPost = await tx.post.count({
    //     where:{
    //         status: PostStatus.DRAFT
    //     }
    //   })

    //     const totalAchivePost = await tx.post.count({
    //     where:{
    //         status: PostStatus.ARCHIVED
    //     }
    //   })

    //   const totalComment = await tx.comment.count();

    //   const totalAporatcomment = await tx.comment.count({
    //     where:{
    //         status: commentStataus.APPROVED
    //     }
    //   });

      
    //      const totalrejectcomment = await tx.comment.count({
    //     where:{
    //         status: commentStataus.REJECT
    //     }
    //   });
    // //____________---------------________________-------___ 
    // //  const allPost = await tx.post.findMany();
    // //  let totalPostViews = 0;
    // //  allPost.forEach((post)=>{
    // //   totalPostViews = totalPostViews + post.views
    // //  })
    // const totalPostViewaggreate = await tx.post.aggregate({
    //     _sum : {
    //         views : true
    //     }   
    // })
    // const totalPostViews = totalPostViewaggreate._sum.views
    //  //________________--------------------_______________
    //    return  {
    //      totalPost,
    //      totalpublicPost,
    //      totalDrafPost,
    //      totalAchivePost,
    //      totalComment,
    //      totalAporatcomment,
    //      totalrejectcomment,
    //      totalPostViews
    //    }
      
    const [
        totalPost,
        totalpublicPost,
        totalDrafPost,
        totalAchivePost,
        totalComment,
        totalAporatcomment,
         totalrejectcomment,
        totalPostViews
    ] = await Promise.all([

       await tx.post.count(),
       await tx.post.count({
           where:{
         status: PostStatus.PUBLISHED
         }
      }),
    await tx.post.count({
         where:{
         status: PostStatus.DRAFT
        }
      }),
     await tx.post.count({
         where:{
           status: PostStatus.ARCHIVED
        }
     }),
    await tx.comment.count(),
    await tx.comment.count({
        where:{
        status: commentStataus.APPROVED
        }
     }),
     await tx.comment.count({
        where:{
        status: commentStataus.REJECT
       }
   }),
   await tx.post.aggregate({
        _sum : {
        views : true
      }   
    })

 ]);

      return  {
         totalPost,
         totalpublicPost,
         totalDrafPost,
         totalAchivePost,
         totalComment,
         totalAporatcomment,
         totalrejectcomment,
         totalPostViews: totalPostViews._sum.views 
       }

    }
  )
  return transactinResult
}

const getMYPosts = async (authorId : string)=>{
 const result = await prisma.post.findMany({
    where : {
        authorId
    },
    orderBy : {
        createdAt: "desc"
    }, 
    include : {
        comments : true,
        author : {
            omit : {
                password : true
            }
        },
        _count : {
            select : {
                comments : true
            }
        }
    }
 });
 return result;
}

export const postservice ={
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getPostsStats,
    getMYPosts
}