"use client";

import axios from "axios";
import * as z from "zod";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Course } from "@prisma/client";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formShema = z.object({
  imageUrl: z.string().min(1, "image required"),
});

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formShema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course image
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing && <>Cancel</>}

          {!isEditing &&
            (!initialData.imageUrl ? (
              <>
                <PlusCircle className="w-4 h-4 mr-2" />
                add image
              </>
            ) : (
              <>
                <Pencil className="w-4 h-4 mr-2" />
                Edit Image
              </>
            ))}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="w-12 h-12 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload image"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:0 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageForm;
