const CourseIdPage = ({ params }: { params: { courseId: string } }) => {
  return (
    <div>
      <h1>CourseIdPage : {params.courseId} </h1>
    </div>
  );
};

export default CourseIdPage;
