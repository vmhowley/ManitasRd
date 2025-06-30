import React, { useState } from "react";

export const Register: React.FC = () => {
  const [role, setRole] = useState<"cliente" | "tecnico">("cliente");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    alert(`Rol: ${role}, Nombre: ${name}, Email: ${email}`);
    // Aquí podrías enviar los datos al backend
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-extrabold text-blue-700">
          Regístrate
        </h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Selección de rol */}
          <fieldset className="mb-6">
            <legend className="text-sm font-medium text-gray-700 mb-2">¿Quién eres?</legend>
            <div className="flex gap-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="cliente"
                  checked={role === "cliente"}
                  onChange={() => setRole("cliente")}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-gray-700">Cliente</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="tecnico"
                  checked={role === "tecnico"}
                  onChange={() => setRole("tecnico")}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-gray-700">Técnico</span>
              </label>
            </div>
          </fieldset>

          {/* Campos comunes */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre Completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirmar Contraseña
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md
              shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2
              focus:ring-offset-2 focus:ring-blue-500 transition"
          >
            Crear Cuenta
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <button className="font-medium text-blue-600 hover:underline">
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
};
