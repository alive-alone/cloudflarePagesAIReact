const defaultModel = '@cf/google/gemma-7b-it-lora';
const otherModels = ['']

export async function onRequest(context: any) {
  const { request, env } = context;

  if (request.method.toUpperCase() === "POST") {
    const body = await readRequestBody(request);
    const model = body['model'] || defaultModel;
    const messages = body['messages'];

    const response = await env.AI.run(
      model,
      { messages },
    );
    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
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