import { Link } from "@tanstack/react-router";

const Hero = () => {
  return (
    <>
      {/* Hero Text */}
      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-12 pt-16 text-center font-inter">
        <h1 className="text-5xl font-bold leading-tight text-black sm:text-6xl lg:text-7xl">
          Welcome to Prep
        </h1>

        <p className="mt-4 text-xl text-slate-700 sm:text-2xl">
          Your exam mastered
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            to="/register"
            className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-center font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Full-bleed mountain banner — keeps the image's native 3:1 aspect */}
      <img
        src="/prep_mountain.png"
        alt="Snow-capped mountains reflected in a lake"
        className="block w-full bg-slate-200"
      />
    </>
  );
};

export default Hero;
