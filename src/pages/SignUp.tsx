// src/pages/SignUp.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SignUp.css"

const SignUp: React.FC = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const handleContinue = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Sign-up complete!\nEmail: ${email}\nPassword: ${password}\nName: ${name}\nHeight: ${height}\nWeight: ${weight}`
    );
    // Reset form or navigate somewhere
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold italic mb-8 text-gray-800">
        Sign-up to <span className="font-serif text-green-700">Æjenda</span>
      </h1>

      <form
        onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}
        className="bg-green-400 p-8 rounded-2xl w-80 flex flex-col gap-4 shadow-lg"
      >
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="What's your name?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="text"
              placeholder="Height (e.g., 5'6)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
            <input
              type="text"
              placeholder="Weight (e.g., 130 lbs)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </>
        )}

        {/* Continue button */}
        <div className="flex justify-end mt-4">
          <button
            type={step === 3 ? "submit" : "button"}
            onClick={step !== 3 ? handleContinue : undefined}
            className="bg-white text-green-600 font-bold px-4 py-2 rounded-full hover:bg-green-100 transition-all"
          >
            Continue →
          </button>
        </div>
      </form>

      <Link
        to="/"
        className="mt-6 text-sm text-gray-600 hover:text-green-700 underline"
      >
        ← Back to home
      </Link>
    </div>
  );
};

export default SignUp;
