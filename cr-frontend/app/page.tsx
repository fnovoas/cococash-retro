async function getData() {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_BASEURL || "http://api-gateway:3001",
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("API error");
    }

    return await res.text();

  } catch (error) {
    return "API not available";
  }
}

export default async function Home() {

  const data = await getData();

  return (
    <main>
      <h1>CocoCash Retro</h1>
      <p>{data}</p>
    </main>
  );
}
