"use client"

import { useState } from "react";

import * as Yup from "yup";

import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { signIn } from "next-auth/react";
import { LogOut } from "lucide-react";




interface IProps {
  email: string;
  password: string;
}


const LoginForm = () => {
  // Estado para almacenar los valores del formulario y errores
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const router = useRouter()
  const notifySucces = (message: string) => toast.success(message)
  const notifyError = (message: string) => toast.error(message)

  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });

  // Esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("El email no es válido")
      .required("El email es obligatorio"),
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("La contraseña es obligatoria")
  });

  // Manejo de cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Validar valores del formulario con Yup
      await validationSchema.validate(formValues, { abortEarly: false });
      console.log("Formulario enviado:", formValues);
      const restSignIn = await signIn("credentials", {
        redirect: false,
        email: formValues.email,
        password: formValues.password
      });

      console.log({ restSignIn })

      if (restSignIn?.error) {
        notifyError("Usuario o contraseña incorrectos");
        return;
      }


      sendData({
        email: formValues.email,
        password: formValues.password
      });
      // Aquí puedes agregar la lógica para enviar los datos al backend
      setErrors({

        email: "",
        password: "",
      });
    } catch (validationErrors: any) {
      // Manejo de errores de validación
      const errorMessages: any = {};
      validationErrors.inner.forEach((error: any) => {
        errorMessages[error.path] = error.message;
      });
      notifyError("Error al registrar el usuario");
      setErrors(errorMessages);
    }
  };


  const sendData = async ({ email, password }: IProps) => {
    try {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();


      console.log(data);
      if (res.status === 401) {
        notifyError("Usuario o contraseña incorrectos");
        return;
      }
      notifySucces("Usuario logueado correctamente");
      setTimeout(() => {
        Cookies.set("user", JSON.stringify(data));
        router.push("/dashboard/blog");
      }
        , 2000);

    } catch (error) {
      console.error("Error:", error);
      notifyError(error as string);
    }
  }


  return (
    <form className="flex flex-col space-y-2 mt-5" onSubmit={handleSubmit}>
      {/* Campo Nombre */}
      <div>
        <Toaster />

      </div>

      {/* Campo Email */}
      <div>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={formValues.email}
          onChange={handleChange}
        />
        {errors.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )}
      </div>

      {/* Campo Contraseña */}
      <div>
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={formValues.password}
          onChange={handleChange}
        />
        {errors.password && (
          <div className="text-red-500 text-sm">{errors.password}</div>
        )}
      </div>
      {/* Botón de enviar */}
      <Button type="submit">Ingresar</Button>
    </form>
  )
}
export default LoginForm