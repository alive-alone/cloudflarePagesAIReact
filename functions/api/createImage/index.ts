const defaultModel = '@cf/stabilityai/stable-diffusion-xl-base-1.0';
const otherModels = ['https://image.pollinations.ai/prompt']

export async function onRequest(context: any) {
  const { request, env } = context;

  if (request.method.toUpperCase() === "POST") {
    const body = await readRequestBody(request);
    const model = body['model'] || defaultModel;
    delete body['model'];
    if(otherModels.includes(model)) {
      const response: any = await fetch(`${model}/${encodeURIComponent(body['prompt'])}`, {
        method: 'GET',
        headers: {
          'pragma': 'no-cache',
          'Cache-Control': 'max-age=0'
        }
      })
      return new Response(response.body, {
        headers: {
          "Content-Type": response.headers.get('Content-Type'),
        },
      });
    } else {
      const response = await env.AI.run(
        model,
        body,
      );
      if(response instanceof ReadableStream) {
        return new Response(response, {
          headers: {
            "Content-Type": "image/png",
          },
        });
      } else {
        return new Response(JSON.stringify(response), {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    }
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