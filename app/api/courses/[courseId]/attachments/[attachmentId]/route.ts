import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId: userId },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await db.attachment.findUnique({
      where: { id: params.attachmentId },
    });

    if (!attachment) {
      return new NextResponse("Not found", { status: 404 });
    }

    await db.attachment.delete({
      where: { id: params.attachmentId },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENT_ID", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
