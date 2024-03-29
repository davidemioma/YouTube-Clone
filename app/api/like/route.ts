import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const { hasLiked, postId } = body;

    if (!postId) {
      return new NextResponse("Invalid credentials", { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return new NextResponse("Post does not exists", { status: 400 });
    }

    if (!hasLiked) {
      await prisma.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          likedPosts: {
            connect: {
              id: postId,
            },
          },
        },
      });

      await prisma.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          dislikedPosts: {
            disconnect: {
              id: postId,
            },
          },
        },
      });

      return NextResponse.json("Liked post successfull");
    } else {
      await prisma.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          likedPosts: {
            disconnect: {
              id: postId,
            },
          },
        },
      });

      return NextResponse.json("Unliked successfull");
    }
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
