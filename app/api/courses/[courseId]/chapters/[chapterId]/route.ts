import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID as string,
  process.env.MUX_TOKEN_SECRET as string
);

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: { id: params.courseId, userId: userId },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized course", { status: 401 });
    }

    const chapter = await db.chapter.findFirst({
      where: { id: params.chapterId, courseId: params.courseId },
      include: { muxData: true },
    });

    if (!chapter) {
      return new NextResponse("chapter not found", { status: 404 });
    }

    if (chapter.videoUrl) {
      const existingMuxVideo = await db.muxData.findFirst({
        where: { chapterId: params.chapterId },
      });

      if (existingMuxVideo) {
        await Video.Assets.del(existingMuxVideo.assetId);
        await db.muxData.delete({ where: { id: existingMuxVideo.id } });
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: { id: params.chapterId },
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: { courseId: params.courseId, isPublished: true },
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: { id: params.courseId },
        data: { isPublished: false },
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.error("[COURSE_CHAPTER_ID_DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: { id: params.courseId, userId: userId },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized course", { status: 401 });
    }

    const chapter = await db.chapter.update({
      where: { id: params.chapterId, courseId: params.courseId },
      data: { ...values },
    });

    // TODO: handle video upload
    if (values.videoUrl) {
      const existingMuxVideo = await db.muxData.findFirst({
        where: { chapterId: params.chapterId },
      });

      if (existingMuxVideo) {
        await Video.Assets.del(existingMuxVideo.assetId);
        await db.muxData.delete({ where: { id: existingMuxVideo.id } });
      }

      const asset = await Video.Assets.create({
        input: values.videoUrl,
        playback_policy: "public",
        test: false,
      });

      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("[COURSE_CHAPTER_ID]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
