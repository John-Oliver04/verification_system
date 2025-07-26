"use client";

export default function Unauthorized401() {
  return (
    <div className="text-center mt-20 text-red-600">
      <h1 className="text-3xl font-bold">401 - Unauthorized</h1>
      <p className="mt-2 text-lg">
        Please{" "}
        <a href="/pages/login" className="text-blue-600 underline">
          login
        </a>{" "}
        to continue.
      </p>
    </div>
  );
}
