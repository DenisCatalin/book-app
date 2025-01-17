import React from "react";

const Page = () => {
  return (
    <main className="root-container flex min-h-screen flex-col items-center justify-center">
      <h1 className="font-bebas-neue text-5xl font-bold text-light-100">Slow down</h1>
      <p className="mt-3 max-w-xl text-center text-lg text-light-100">
        You are trying to sign in too fast. Please wait a minute and try again.
      </p>
    </main>
  );
};

export default Page;
