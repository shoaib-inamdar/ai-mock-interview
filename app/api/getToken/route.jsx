// app/api/getToken/route.js
export async function GET() {
  try {
    const API_KEY =
      process.env.ASSEMBLYAI_API_KEY || process.env.ASSEMBLY_API_KEY;
    if (!API_KEY) {
      console.error("Missing AssemblyAI API key env var");
      return new Response(
        JSON.stringify({ error: "Missing AssemblyAI API key" }),
        { status: 500 }
      );
    }

    // ✅ Use the new universal streaming token endpoint
    const url = new URL("https://streaming.assemblyai.com/v3/token");
    url.searchParams.set("expires_in_seconds", "60"); // token lifespan (1–600 sec)

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: API_KEY,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("AssemblyAI token fetch failed:", res.status, data);
      return new Response(JSON.stringify({ error: "Failed to get token" }), {
        status: 502,
      });
    }

    // ✅ Return token as JSON
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in /api/getToken route:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
