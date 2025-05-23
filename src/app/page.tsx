"use client";
export default function Home() {
  return (
    <main className="hero min-h-[84vh] bg-base-100 rounded-xl shadow flex flex-col gap-6 justify-center items-center p-8 mt-8">
      <div className="hero-content flex flex-col items-center">
        <h1 className="text-5xl font-bold text-primary mb-2 text-center">
          League of Legends ARAM Dashboard
        </h1>
        <p className="text-lg text-base-content/80 text-center max-w-xl">
          View your ARAM match history, stats, and favorite champions. Update
          your data in real time and explore your performance!
        </p>
        <div className="mt-4">
          <span className="badge badge-primary badge-lg">Work in progress</span>
        </div>
      </div>
    </main>
  );
}
