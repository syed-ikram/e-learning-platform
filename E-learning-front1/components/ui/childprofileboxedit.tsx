"use client";

import React from "react";

import { useRouter } from "next/navigation";
import { AddChildSchema, AddChildValues } from "@/schemas";
import { Student } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { Edit } from "lucide-react";
import { useCookies } from "next-client-cookies";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import apiUrl from "@/config";

interface EditChildFormProps {
  child: Student;
}

export function EditChildForm({ child }: EditChildFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const [open, setOpen] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  //give me a static table of classes from class 1 to class 6 in arabic
  const classes = [
    "الصف الأول",
    "الصف الثاني",
    "الصف الثالث",
    "الصف الرابع",
    "الصف الخامس",
    "الصف السادس",
  ];

  const cookies = useCookies();
  const email = cookies.get("email");

  const addChildForm = useForm<AddChildValues>({
    resolver: zodResolver(AddChildSchema),
    defaultValues: {
      firstname: child.firstname,
      lastname: child.lastname,
      school_level: child.school_level,
    },
  });

  const onSubmit = async (values: AddChildValues) => {
    try {
      console.log(values);
      console.log(addChildForm.getValues());
      startTransition(async () => {
        await axios
          .put(
            `${apiUrl}/api/parents/${email}/updateStudent/${child.id}`,
            values,
          )
          .then((res) => {
            setSuccess("تم تعديل الحساب بنجاح");
            setTimeout(() => {
              setSuccess(null);
              setOpen(false);
              router.refresh();
            }, 2000);
          });
      });
    } catch (error) {
      setError("حدث خطأ ما");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Edit className="h-6 w-6 text-gray-400" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          {/* it for edit child  */}
          <DialogTitle>تعديل بيانات الطالب</DialogTitle>
          <DialogDescription>
            يمكنك تعديل بيانات الطالب من هنا
          </DialogDescription>
        </DialogHeader>

        <Form {...addChildForm}>
          <form
            className="grid gap-4"
            onSubmit={addChildForm.handleSubmit(onSubmit)}
          >
            <FormField
              control={addChildForm.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <div className="mr-auto inline-block text-sm"></div>
                    <FormLabel>الاسم</FormLabel>
                  </div>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addChildForm.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <div className="mr-auto inline-block text-sm"></div>
                    <FormLabel>اللقب</FormLabel>
                  </div>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addChildForm.control}
              name="school_level"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <div className="mr-auto inline-block text-sm"></div>
                    <FormLabel>المستوى الدراسي</FormLabel>
                  </div>
                  <FormControl>
                    <Select
                      {...field}
                      disabled={isPending}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المستوى الدراسي" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((level, index) => (
                          <SelectGroup key={index}>
                            <SelectItem value={level}>{level}</SelectItem>
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <Button variant="primary" type="submit" disabled={isPending}>
              تأكيد
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
