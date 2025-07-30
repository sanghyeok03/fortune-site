require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/fortune', async (req, res) => {
  const { name, birthdate, gender, birthtime, mbti, category } = req.body;

  const prompt = `
당신은 운세 전문가 AI입니다.
다음 정보를 바탕으로 운세를 한국어로 재미있고 신뢰감 있게 설명해주세요.

이름: ${name}
생년월일: ${birthdate}
성별: ${gender}
태어난 시간: ${birthtime || '정보 없음'}
MBTI: ${mbti || '미입력'}
운세 카테고리: ${category}

[운세 시작]
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: '당신은 한국 운세 전문가로서 점성술과 사주, MBTI를 종합하여 운세를 설명하는 AI입니다.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.9,
      max_tokens: 500,
    });

    const fortune = completion.choices[0].message.content;
    res.json({ fortune });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '운세 생성 실패' });
  }
});

app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));
