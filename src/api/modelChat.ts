// 调用大模型
export const text2text = async (describe: string, model: string) => {
  if (describe) {
    const messages = [
      { role: "system", content: "You are a friendly assistant" },
      {
        role: "user",
        content: describe,
      },
    ];
    const datas = {
      messages: messages,
      model: model,
    };
    const result = await fetch(`/api/text2text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datas),
    });
    console.error(result);

    const response = {
      error: false,
      errorMsg: '',
      imgUrl: '',
      response: ''
    };
    if (result && result.status === 200) {
      const data = await result.json() as any;
      response.response = data?.response
    } else {
      response.error = true;
      response.errorMsg = 'error';
    }
    return response;
  }
};