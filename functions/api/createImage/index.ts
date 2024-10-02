export async function onRequest(context: any) {
  const { request, env } = context;

  if (request.method.toUpperCase() === "POST") {
    const body = await readRequestBody(request);
    const response = await env.AI.run(
      "@cf/stabilityai/stable-diffusion-xl-base-1.0",
      body
    );
  
    return new Response(response, {
      headers: {
        "content-type": "image/png",
      },
    });
  }
  return new Response('Hello World');
}

async function readRequestBody(request: any) {
  const contentType = request.headers.get("content-type");
  if (contentType.includes("application/json")) {
    return await request.json();
  } else if (contentType.includes("application/text")) {
    return request.text();
  } else if (contentType.includes("text/html")) {
    return request.text();
  } else if (contentType.includes("form")) {
    const formData = await request.formData();
    const body = {} as any;
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1];
    }
    return body;
  } else {
    return {};
  }
}