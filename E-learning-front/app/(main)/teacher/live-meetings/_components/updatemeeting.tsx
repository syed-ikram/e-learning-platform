"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { addLiveMeetingSchema, addLiveMeetingValues } from "@/schemas";
import { LiveMeeting } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Adjust the import based on your project's structure

const terms = ["الفصل الأول", "الفصل الثاني", "الفصل الثالث", "الفصل الرابع", "الفصل الخامس", "الفصل السادس"];
const subjects = [
  "اللغة العربية",
  "اللغة الفرنسية",
  "الرياضيات",
  "العلوم الطبيعية",
  "التاريخ",
  "الجغرافيا",
  "التربية الفنية",
  "التربية الرياضية",
  "الموسيقى",
  "التكنولوجيا",
];

interface AddGroupClassProps {
  meeting: LiveMeeting;
}

export function UpdateGroupClass({ meeting }: AddGroupClassProps) {
  const router = useRouter();
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const AddliveMeetingForm = useForm<addLiveMeetingValues>({
    resolver: zodResolver(addLiveMeetingSchema),
    defaultValues: {
      name: meeting.name,
      description: meeting.description,
      dateTime: new Date(meeting.dateTime).toISOString().split("T")[0],
      term: meeting.term,
      subject: meeting.subject,
    },
  });

  const onSubmit = async (values: addLiveMeetingValues) => {
    try {
      const parseDate = new Date(values.dateTime);
      console.log(parseDate);

      await axios
        .put(`http://localhost:8080/meetings/` + meeting.id, {
          name: values.name,
          description: values.description,
          dateTime: parseDate,
          term: values.term,
          subject: values.subject,
          teacher: meeting.teacher,
        })
        .then((res) => {
          console.log(res.data);
          setSuccess("تمت إضافة الدرس بنجاح");
          router.refresh();
        })
        .catch((error) => {
          console.error(error);
          setError("حدث خطأ ما");
        });
    } catch (error) {
      console.error(error);
      setError("حدث خطأ ما");
    }
  };
  console.log(AddliveMeetingForm.formState.errors);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">تعديل</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <h2>تعديل درس جماعي</h2>
          </DialogTitle>
          <DialogDescription>
            <p>أضف درسًا جماعيًا جديدًا للطلاب</p>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Form {...AddliveMeetingForm}>
            <form
              onSubmit={AddliveMeetingForm.handleSubmit(onSubmit)}
              className="grid gap-4"
            >
              <FormField
                control={AddliveMeetingForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <div className="mr-auto inline-block text-sm"></div>
                      <FormLabel>إسم الدرس الجماعي</FormLabel>
                    </div>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={AddliveMeetingForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <div className="mr-auto inline-block text-sm"></div>
                      <FormLabel>الوصف</FormLabel>
                    </div>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={AddliveMeetingForm.control}
                name="dateTime"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <div className="mr-auto inline-block text-sm"></div>
                      <FormLabel>اليوم</FormLabel>
                    </div>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={AddliveMeetingForm.control}
                name="term"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <div className="mr-auto inline-block text-sm"></div>
                      <FormLabel>الفصل</FormLabel>
                    </div>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الفصل" />
                        </SelectTrigger>
                        <SelectContent>
                          {terms.map((term) => (
                            <SelectItem key={term} value={term}>
                              {term}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={AddliveMeetingForm.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <div className="mr-auto inline-block text-sm"></div>
                      <FormLabel>المادة</FormLabel>
                    </div>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المادة" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" variant="primary">
                إضافة
              </Button>

              {error && (
                <div className="flex justify-end rounded-xl border-e-4 border-red-600 bg-red-200 p-4 px-6 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {success && (
                <div className="flex justify-end rounded-xl border-e-4 border-green-600 bg-green-200 p-4 px-6 text-sm font-medium text-green-600">
                  {success}
                </div>
              )}
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
