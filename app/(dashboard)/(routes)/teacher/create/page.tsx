"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

const CreatePage = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", values);
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success("Course created successfully");
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto md:items-center md:justify-self-center h-full p-6">
      <div>
        <h1 className="text-2xl font-bold">Create Course</h1>
        <p className="text-gray-500">
          Create a new course and start adding lessons, don&apos;t worry you can
          always come back and edit it later.
        </p>
        <Form {...form}>
          <form
            className="space-y-8 mt-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Advanced web development' "
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The title of your course, make it short and descriptive.
                  </FormDescription>
                  <FormMessage>
                    {form.formState.errors.title?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Create Course
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
