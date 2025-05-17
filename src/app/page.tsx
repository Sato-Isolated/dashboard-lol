'use client';
import { useUser } from "@/context/UserContext";

export default function Home() {
  const { user, setUser } = useUser();

  return (
    <main className="flex flex-col min-h-screen items-center p-24">
      <div className="flex gap-1">
        <input
          type="text"
          placeholder="Summoners Name"
          className="border p-2"
          value={user.summonerName}
          onChange={(e) => setUser({ ...user, summonerName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tag ex: #1234"
          className="border p-2"
          value={user.tagline}
          onChange={(e) => setUser({ ...user, tagline: e.target.value })}
        />
        <select
          name="region"
          id="region"
          className="border p-2"
          value={user.region}
          onChange={(e) => setUser({ ...user, region: e.target.value })}
        >
          <option value="euw1">euw1</option>
          <option value="na1">na1</option>
        </select>
      </div>
    </main>
  );
}