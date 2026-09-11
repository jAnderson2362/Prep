import { Link } from "@tanstack/react-router";

const Hero = () => {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center px-6 pb-8 pt-16 text-center font-inter lg:px-8 xl:px-[8%]">
      {/* Hero Text */}
      <div className="max-w-3xl">
        <h1 className="text-5xl font-bold leading-tight text-[#2f4272] sm:text-6xl lg:text-7xl">
          Welcome to Prep
        </h1>

        <p className="mt-4 text-xl text-slate-700 sm:text-2xl">
          Your exam mastered
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/register"
            className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-center font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Get Started
          </Link>

          <Link
            to="/about"
            className="rounded-lg bg-slate-900 px-6 py-2.5 text-center font-medium text-white transition hover:bg-slate-800"
          >
            Learn more
          </Link>
        </div>
      </div>

      {/* Mountain banner */}
      <div className="mt-14 w-full">
        <img
          src="/mountains.jpg"
          alt="Snow-capped mountains reflected in a lake"
          className="h-56 w-full rounded-2xl bg-slate-200 object-cover shadow-lg sm:h-72 lg:h-[380px]"
        />
      </div>
    </section>
  );
};

export default Hero;
