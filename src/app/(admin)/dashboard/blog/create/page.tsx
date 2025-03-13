"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import MDEditor from "@uiw/react-md-editor";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import * as Yup from "yup";
import { toast, Toaster } from "sonner";
import { generateSlugByTitle } from "@/lib/generate-slug-by-title";

const CreateBlog = () => {
  const [formValues, setFormValues] = useState({
    title: "",
    imagePreview: "",
    resumen: "",
    content: "**Hello world!!!**"
  });

  const [errors, setErrors] = useState({
    title: "",
    imagePreview: "",
    resumen: "",
    content: ""
  });

  const [slugValue, setSlugValue] = useState("")

  useEffect(() => {
    setSlugValue(generateSlugByTitle(formValues.title))
  }, [formValues.title])

  const [isSubmitting, setIsSubmitting] = useState(false);

  const notifySuccess = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // Esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(5, "El título debe tener al menos 5 caracteres")
      .required("El título es obligatorio"),
    imagePreview: Yup.string().url("Debe ser una URL válida").required("La URL de la imagen es obligatoria"),
    resumen: Yup.string()
      .min(10, "El resumen debe tener al menos 10 caracteres")
      .required("El resumen es obligatorio"),
    content: Yup.string()
      .min(20, "El contenido debe tener al menos 20 caracteres")
      .required("El contenido es obligatorio")
  });

  // Manejo de cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Manejo de cambios en el campo de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormValues({
      ...formValues
    });
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({
      title: "",
      imagePreview: "",
      resumen: "",
      content: ""
    });

    try {
      // Validar los valores del formulario con Yup
      await validationSchema.validate(formValues, { abortEarly: false });
      const slug = generateSlugByTitle(formValues.title);

      console.log({ slug })
      // Crear un objeto FormData y agregar los valores del formulario
      const formData = new FormData();
      formData.append("title", formValues.title);
      formData.append("photo", formValues.imagePreview);
      formData.append("resumen", formValues.resumen);
      formData.append("content", formValues.content);
      formData.append("authorId", "cm83z53wi000050dev843tvzw");
      formData.append("slug", slugValue);



      // Enviar los datos a la API
      await sendData(formData);

      // Mostrar notificación de éxito y redirigir
      notifySuccess("Post creado correctamente");
      setFormValues({
        title: "",
        imagePreview: "",
        resumen: "",
        content: "**Hello world!!!**"
      });
    } catch (validationErrors: any) {
      // Manejo de errores de validación
      const errorMessages: any = {};
      validationErrors.inner.forEach((error: any) => {
        errorMessages[error.path] = error.message;
      });
      setErrors(errorMessages);
      console.log("Errores de validación:", errorMessages);
      notifyError("Error al crear el post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendData = async (formData: FormData) => {
    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        body: formData
      });

      console.log("Respuesta:", response);

      if (!response.ok) {
        throw new Error("No se pudo crear el post");
      }
    } catch (error) {
      console.error("Error al enviar datos:", error);
      throw error;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold">Crear un nuevo Post</h1>
      <Toaster />
      <form className="flex flex-col gap-4 mt-5" onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <Input
            name="title"
            type="text"
            placeholder="Título"
            value={formValues.title}
            onChange={handleChange}
          />
          {errors.title && <div className="text-red-500 text-sm">{errors.title}</div>}
        </div>
        <div>
          <label>Imagen de portada (URL):</label>
          <Input
            name="imagePreview"
            type="text"
            placeholder="URL de la imagen"
            value={formValues.imagePreview}
            onChange={handleChange}
          />
          {errors.imagePreview && (
            <div className="text-red-500 text-sm">{errors.imagePreview}</div>
          )}
        </div>
        <div>
          <label>Resumen:</label>
          <Textarea
            name="resumen"
            placeholder="Resumen"
            value={formValues.resumen}
            onChange={handleChange}
          />
          {errors.resumen && (
            <div className="text-red-500 text-sm">{errors.resumen}</div>
          )}
        </div>
        <div
          className="max-w-[1200px] border border-gray-200 rounded-lg p-4"
        >
          <label>Contenido:</label>
          <MDEditor
            value={formValues.content}
            style={{ height: "600px" }}
            onChange={(val) => setFormValues({ ...formValues, content: val! })}
          />
          {errors.content && <div className="text-red-500 text-sm">{errors.content}</div>}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creando..." : "Crear"}
        </Button>
      </form>
    </div>
  );
};

export default CreateBlog;
