import type { APIRoute } from "astro";

export const get: APIRoute = async ({ request }) => {
  const time = Date.now();
    const response = {
      time,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=21600',
      },
    });
};