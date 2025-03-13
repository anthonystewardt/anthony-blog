"use client"
import { notifyError, notifySuccess } from "@/lib/notifies";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Toaster } from "sonner";


type Inputs = {
  email: string;
}

const SubscriberForm = () => {

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Inputs>();
  const [isShowLoader, setIsShowLoader] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsShowLoader(true);
      const response = await fetch("/api/suscriber", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();

      console.log({ result });

      if (result.id) {
        reset();
        notifySuccess("Subscribed successfully");
        setIsShowLoader(false);
      }

    } catch (error) {
      notifyError("Failed to subscribe");
      setIsShowLoader(false);
    }
  }


  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="">
        <Toaster />
        <input
          type="email"
          placeholder="Your email"
          {
          ...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              message: "Invalid email address"
            }
          })
          }
          className="px-4 py-2 text-black/75 bg-white/50"
        />
        <button type="submit" className="px-4 py-2 text-white/75 bg-black/50 hover:bg-slate-950 transition-all ease">Subscribe</button>
      </form>
      {
        errors.email && <p className="text-red-500">{errors.email.message}</p>
      }
    </>
  )
}
export default SubscriberForm