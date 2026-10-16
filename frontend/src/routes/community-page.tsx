import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/community-page')({
  component: CommunityPage,
})

function CommunityPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#7eb1f5]">
      <div className="mx-auto max-w-7xl px-8 py-12">

      <div className="absolute right-16 top-10 text-5xl text-white opacity-40">
        ∿∿
      </div>

      <div className="absolute left-10 bottom-10 text-5xl text-white opacity-40">
        ∿∿
      </div>

      <div className="absolute bottom-24 left-1/2 grid grid-cols-4 gap-3 opacity-30">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-white"
          />
        ))}
      </div>


        <div className="grid lg:grid-cols-2 gap-16 items-center">
 
          <div>

            <div className="mb-8 flex items-center gap-3">
              <span className="text-3xl">🎓</span>
              <span className="text-2xl font-semibold">
                Prep
              </span>
            </div>

            <h1 className="mb-6 text-7xl font-black text-slate-900">
              Community
            </h1>

            <p className="mb-8 max-w-md text-lg text-slate-800">
              Connect with other Prep students, join study groups,
              share study tips, get updates, and stay motivated
              throughout your learning journey.
            </p>

            <div className="space-y-4 max-w-md">

              <a
                href="https://discord.gg/"
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl bg-indigo-600 py-4 text-center font-semibold text-white hover:bg-indigo-700"
              >
                Join our Discord
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl bg-white py-4 text-center shadow-sm"
              >
                Instagram
              </a>

              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl bg-white py-4 text-center shadow-sm"
              >
                TikTok
              </a>

            </div>

          </div>

          <div className="flex justify-center">

            <div className="grid grid-cols-2 gap-6">

              <img
                src="/community1.png"
                alt="Community"
                className="h-[420px] w-[280px] rounded-full object-cover"
              />

              <div className="flex flex-col gap-6">

                <img
                  src="/community2.png"
                  alt="Community"
                  className="h-[220px] w-[220px] rounded-[40px] object-cover"
                />

                <img
                  src="/community3.png"
                  alt="Community"
                  className="h-[220px] w-[220px] rounded-full object-cover"
                />

              </div>

            </div>

          </div>

        </div>

      </div>
    </main>
  )
}