import { Button } from "@/components/ui/button";
import LoginForm from "@/components/ui/form/loginForm";
import RegisterForm from "@/components/ui/form/registerForm";
import { Input } from "@/components/ui/input";
import LetterGlitch from "@/components/ui/letterGlitch/letterglitch";
import Orb from "@/components/ui/orbe/orbe";

const RegisterPage = () => {


  return (
    <div
      className="grid grid-cols-6 h-[70vh] justify-center gap-6 items-center"
    >
      <div className="h-full col-span-3">
        <div className="rounded-lg h-full border-2 border-gray-200 flex justify-center items-center">
          <Orb />
        </div>
      </div>
      <div className="col-span-3">
        <h3 className="text-4xl font-medium text-left">
          Ingresar a tu cuenta
        </h3>
        {/* Formulario con Formik */}
        <LoginForm />
      </div>
    </div>
  );
};

export default RegisterPage;
