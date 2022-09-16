import { Post, Prisma, PrismaClient, User } from "@prisma/client"

export const getPostById = async (db: PrismaClient, postId: number): Promise<Post> => {
    return db.post.findUniqueOrThrow({
        where: { id: postId, },
        include: {
            Comment: {
                include: {
                    user: { select: { email: true, name: true, }, },
                },
            },
        },
    });
};

export const getPublishedAndUserPosts = async (db: PrismaClient, currentUser?: User): Promise<Post[]> => {
    return db.post.findMany({
        where: {
            OR: { published: currentUser ? undefined : true, userId: currentUser?.id },
        },
        orderBy: { published: 'asc', },
        include: {
            User: { select: { email: true, name: true, } },
        },
    });
};

export const publishPostById = async (db: PrismaClient, currentUser: User, postId: number): Promise<Post> => {
    return db.post.update({
        where: { id_userId: { id: postId, userId: currentUser.id } },
        data: { published: true },
    });
};

export const createPost = async (db: PrismaClient, post: Prisma.PostUncheckedCreateInput): Promise<Post> => {
    return db.post.create({ data: post });
};

/**
 * - user is allowed to view published posts or their own unpublished posts
 * 
 * - users can't view unpublished posts of other users
 */
export const userAllowedToViewPost = (post: Post, currentUser?: User): boolean => {
    return post.published || post.userId === currentUser?.id;
};

export const postComment = async (db: PrismaClient, comment: Prisma.CommentUncheckedCreateInput) => {
    return db.comment.create({
        data: comment,
    });
};
