"use client";
import { useRouter } from "next/navigation"
import { useUser } from "@/context/UserContext"
import { PlatformRegion } from "@/types/platformregion";

export default function Home() {
  const { user, setUser } = useUser()
  const router = useRouter()

  const handleSubmit = () => {
    router.push(`/${user.region}/summoner/${user.summonerName}/${user.tagline}`)
  }

  return (
    <main className="flex flex-col gap-2 min-h-screen items-center p-24">
      <div className="flex gap-1">
        <input
          type="text"
          placeholder="Summoners Name"
          className="input"
          value={user.summonerName}
          onChange={(e) => setUser({ ...user, summonerName: e.target.value })}
        />
        <input
          type="text"
          placeholder="#1234"
          className="input w-20"
          value={user.tagline}
          onChange={(e) => setUser({ ...user, tagline: e.target.value })}
        />
        <select
          name="region"
          id="region"
          className="select w-28"
          value={user.region}
          onChange={(e) => setUser({ ...user, region: e.target.value })}
        >
         {Object.entries(PlatformRegion).map(([key, value]) => (
            <option key={key} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button
          className="btn btn-outline p-2 w-96"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </main>
  );
}
