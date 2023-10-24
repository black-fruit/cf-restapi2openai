addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
});

async function run(model, input) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/1e027582f21e6db396e575b379a8f233/ai/run/${model}`,
    {
      headers: { Authorization: "Bearer {API_TOKEN}" },
      method: "POST",
      body: JSON.stringify(input),
    }
  );
  const result = await response.json();
  return result;
}

async function handleRequest(request) {
  const requestBody = await request.text();
  const requestData = JSON.parse(requestBody);

  const redata = {
    message: requestData.message
  }

  run("@cf/meta/llama-2-7b-chat-int8", {
    messages: redata
  }).then(async (response) => {
    console.log(JSON.stringify(response));
    const requestBody2 = await request.text();
    const requestData2 = JSON.parse(requestBody2);
  });

  // @ts-ignore
  const need = requestData2.result;

  const back = {
    "id": "chatcmpl-abc123",
    "object": "chat.completion",
    "created": 1677858242,
    "model": "llama-2-7b-chat",
    "usage": {
        "prompt_tokens": 13,
        "completion_tokens": 7,
        "total_tokens": 20
    },
    "choices": [
        {
            "message": {
                "role": "assistant",
                "content": need.response
            },
            "finish_reason": "stop",
            "index": 0
        }
    ]
  }

  return new Response(JSON.stringify(back));
}
