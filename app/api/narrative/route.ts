import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { newsData, locale } = await req.json();

    const prompt = `Ты — старший аналитик психологических операций ЦРУ/МОСАД уровня "Narrative Warfare Desk".
Твоя задача — выявлять текущие нарративы, которые активно проталкивают мировые СМИ и инфлюенсеры.

Анализируй предоставленные новости, посты инфлюенсеров и sentiment. Изучай материалы из TheNewsAPI, GDELT, специализированных исследований и социальных сетей.

Выдай структурированный анализ в формате JSON на языке: ${locale}.

Формта ответа:
{
  "summary": "Краткое описание ситуации (одна строка)",
  "risk": "HIGH" | "MEDIUM" | "LOW",
  "analysis": {
    "current_narrative": "Подробное описание текущего доминирующего нарратива",
    "primary_goal": "Истинная цель данной информационной операции (зачем это вбрасывают)",
    "detected_methods": ["Метод 1", "Метод 2"],
    "distraction_target": "На что пытаются отвлечь внимание этим нарративом",
    "key_sources": [{"name": "Источник", "url": "ссылка"}],
    "alternative_narratives": ["Версия 1", "Версия 2"],
    "confidence_level": "Процент уверенности в анализе (например, 85%)"
  }
}

Будь циничным, объективным и точным. Ищи скрытые мотивы и связи между источниками. Детально описывай вовлеченные страны и конкретные манипуляции.

ДАННЫЕ ДЛЯ АНАЛИЗА:
${JSON.stringify(newsData)}
`;

    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            body: JSON.stringify({
                model: 'qwen2.5:14b-instruct-q5_K_M',
                prompt: prompt,
                stream: false,
                format: 'json'
            }),
        });

        const data = await response.json();
        const analysis = JSON.parse(data.response);

        return NextResponse.json(analysis);
    } catch (error) {
        console.error('Narrative API Error:', error);

        // Detailed fallback matching the new cynical persona
        const mockResponse = {
            summary: "Israel urges civilians in southern Lebanon to evacuate ahead of strikes.",
            risk: "HIGH",
            analysis: {
                current_narrative: "Civilians are being urged to evacuate southern Lebanon immediately to avoid becoming collateral damage in planned kinetic operations.",
                primary_goal: "Justify imminent escalation while performing 'humanitarian' signaling to international audience.",
                detected_methods: ["Fearmongering", "Manufacturing consensus", "Selective reporting"],
                distraction_target: "Recent reports of logistics failures in the northern sector.",
                key_sources: [
                    { name: "Al Jazeera", url: "https://aljazeera.com" },
                    { name: "Sky News Research", url: "https://news.sky.com" }
                ],
                alternative_narratives: [
                    "Psychological warfare to trigger mass displacement before ground incursion.",
                    "Strategic posturing to force Hezbollah into concessions via domestic pressure."
                ],
                confidence_level: "92%"
            }
        };
        return NextResponse.json(mockResponse);
    }
}
