"use client"

import { useState } from "react";
import { Input } from "../input"
import { Button } from "../button";
import * as Yup from "yup";

import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";

interface IProps {
  name: string;
  email: string;
  password: string;
  role: string;
}


const RegisterForm = () => {
  // Estado para almacenar los valores del formulario y errores
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter()
  const notifySucces = (message: string) => toast.success(message)
  const notifyError = (message: string) => toast.error(message)

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .required("El nombre es obligatorio"),
    email: Yup.string()
      .email("El email no es válido")
      .required("El email es obligatorio"),
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("La contraseña es obligatoria"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Las contraseñas no coinciden")
      .required("Confirma tu contraseña"),
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
      sendData({
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
        role: "USER",
      });
      // Aquí puedes agregar la lógica para enviar los datos al backend
      setErrors({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
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


  const sendData = async ({ name, email, password, role }: IProps) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      console.log(data);
      notifySucces("Usuario registrado correctamente");
      setTimeout(() => {
        router.push("/login");
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
        <Input
          name="name"
          type="text"
          placeholder="Name"
          value={formValues.name}
          onChange={handleChange}
        />
        {errors.name && (
          <div className="text-red-500 text-sm">{errors.name}</div>
        )}
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

      {/* Campo Confirmar Contraseña */}
      <div>
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={formValues.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <div className="text-red-500 text-sm">
            {errors.confirmPassword}
          </div>
        )}
      </div>

      {/* Botón de enviar */}
      <Button type="submit">Crear</Button>
    </form>
  )
}
export default RegisterForm