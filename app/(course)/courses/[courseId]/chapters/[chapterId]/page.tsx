import { getChapter } from "@/actions/get-chapters";
import Banner from "@/components/banner";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    courseId: params.courseId,
    chapterId: params.chapterId,
  });

  if (!chapter || !course) {
    console.error("chapter or course not found");
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.completed;

  return (
    <div>
      {userProgress?.completed && (
        <Banner
          variant={"success"}
          label="you already completed this chapter"
        />
      )}
      {isLocked && (
        <Banner
          variant={"warning"}
          label="you need to purchase this course to view this chapter"
        />
      )}
    </div>
  );
};

export default ChapterIdPage;
