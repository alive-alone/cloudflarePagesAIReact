// 生成图片
export const createImage = async (describe: string, model: string) => {
  if (describe) {
    const datas = {
      prompt: describe,
      model: model,
    };
    const result = await fetch(`/api/createImage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datas),
    });
    const response = {
      error: false,
      errorMsg: '',
      imgUrl: '',
    };
    if (result && result.status === 200) {
      const contentType = result.headers.get('Content-Type') || '';
      if (contentType.includes('application/json')) {
        const datas = (await result?.json()) as { image: string };
        if (datas['image']) {
          response.imgUrl = `data:image/png;base64,${datas['image']}`;
        }
      } else {
        const blob = await result.blob();
        //再转为URL
        response.imgUrl = URL.createObjectURL(blob);
      }
    } else {
      response.error = true;
      response.errorMsg = 'error';
    }
    return response;
  }
};