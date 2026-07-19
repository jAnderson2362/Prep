import { Link } from "@tanstack/react-router";

const Hero = () => {
  return (
    <main className="bg-gradient-to-b from-[#81A3F8] to-[#F0F3FE] text-slate-900">
      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col items-center justify-center px-6 py-16 text-center lg:px-8 xl:px-[8%]">
        {/* Hero Text */}
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Welcome to Prep
          </h1>

          <p className="mt-6 text-lg text-slate-700 sm:text-xl">
            Your exam mastered
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="rounded-lg bg-blue-600 px-6 py-3 text-center font-medium text-white transition hover:bg-blue-700"
            >
              Get Started
            </Link>

            <Link
              to="/about"
              className="bg-slate-50 rounded-lg border border-slate-300 px-6 py-3 text-center font-medium text-slate-900 transition hover:bg-slate-100"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Screenshots */}
        <div className="mt-14 w-full max-w-4xl">
          <div className="flex h-72 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-lg sm:h-96 lg:h-[500px]">
            <div className="text-center">
              <p className="mt-2 text-sm text-slate-500">
                Replace with screenshots later
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Hero;
