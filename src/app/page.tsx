"use client";
import { useUser } from "@/context/UserContext";

export default function Home() {
  const { user, setUser } = useUser();

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
          <option value="euw1">euw1</option>
          <option value="na1">na1</option>
        </select>
      </div>
      <div>
        <button
          className="btn btn-outline p-2 w-96"
          onClick={() => console.log(user)}
        >
          Submit
        </button>
      </div>
    </main>
  );
}
