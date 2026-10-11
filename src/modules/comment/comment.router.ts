import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { commertController } from "./comment.contoller";


const router = Router();

router.post("/",
    auth(Role.USER, Role.AUTHOR, Role.ADMIN),
    commertController.createComment
);

router.get("/author/:authorId",
commertController.getCommentByAuthorId
);

router.get("/:postId",
     commertController.getCommentBypostId 
);

router.patch("/:commentId",
    auth(Role.USER, Role.AUTHOR, Role.ADMIN),
   commertController.updateComment
);


router.delete("/:commentId",
    auth(Role.USER, Role.ADMIN, Role.AUTHOR),
    commertController.deleteComment
);

router.put("/:commentId/moderate",
    auth(Role.ADMIN),
     commertController.moderateComment
    
)

export const commentRouters = router