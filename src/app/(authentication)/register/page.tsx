import { Button } from "@/components/ui/button";
import RegisterForm from "@/components/ui/form/registerForm";
import { Input } from "@/components/ui/input";
import LetterGlitch from "@/components/ui/letterGlitch/letterglitch";

const RegisterPage = () => {


  return (
    <div
      className="grid grid-cols-6 h-[70vh] justify-center gap-6 items-center"
    >
      <div className="h-full col-span-3">
        <div className="rounded-lg h-full">
          <LetterGlitch />
        </div>
      </div>
      <div className="col-span-3">
        <h3 className="text-4xl font-medium text-left">
          Regístrate y comparte tus Posts con el mundo
        </h3>
        {/* Formulario con Formik */}
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
