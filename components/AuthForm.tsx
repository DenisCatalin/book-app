"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { z, ZodType } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import FileUpload from "./FileUpload";

interface Props<T extends FieldValues> {
  type: "SIGN_IN" | "SIGN_UP";
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
}

const AuthForm = <T extends FieldValues>({ type, schema, defaultValues, onSubmit }: Props<T>) => {
  const router = useRouter();
  const isSignIn = type === "SIGN_IN";

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async data => {
    const result = await onSubmit(data);
    if (result.success) {
      toast({
        title: "Success",
        description: isSignIn ? "You are signed in" : "You are signed up",
      });
      router.push("/");
    } else {
      toast({
        title: `Error ${isSignIn ? "signing in" : "signing up"}`,
        description: result.error ?? "Something went wrong",
      });
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">
        {isSignIn ? "Welcome back to BookWise" : "Create your library account"}
      </h1>
      <p className="text-light-100">
        {isSignIn && "Access the vast collection of resources, and stay updated"}
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full">
          {Object.keys(defaultValues).map(field => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                  </FormLabel>
                  <FormControl>
                    {field.name === "universityCard" ? (
                      <FileUpload
                        onFileChange={field.onChange}
                        type="image"
                        accept="image/*"
                        placeholder="Upload your ID"
                        folder="ids"
                        variant="dark"
                      />
                    ) : (
                      <Input
                        required
                        type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                        {...field}
                        className="form-input"
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className="form-btn">
            {isSignIn ? "Sign in" : "Sign up"}
          </Button>
        </form>
      </Form>
      <p className="text-center text-base font-medium">
        {isSignIn ? "Don't have an account? " : "Already have an account? "}
        <Link className="text-bold text-primary" href={isSignIn ? "/sign-up" : "/sign-in"}>
          {isSignIn ? "Sign up" : "Sign in"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
