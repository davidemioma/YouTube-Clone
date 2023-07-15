import prisma from "@/libs/prismadb";
import { getCurrentUser } from "./getCurrentUser";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";

export const getWatchLaterPosts = async () => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    const posts = await prisma.post.findMany({
      where: {
        savedIds: {
          has: currentUser.id,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
      take: INFINITE_SCROLL_PAGINATION_RESULTS,
    });

    return posts;
  } catch (err) {
    return [];
  }
};
