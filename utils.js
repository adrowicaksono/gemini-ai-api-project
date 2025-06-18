import fs from 'fs';
import path from 'path';

export async function getModelResponse(configs, model) {
    const response = await model.models.generateContent({
        model: "gemini-2.5-flash",
        ...configs
    });
    return response
}

export function contentToGenerativePart(path, mimeType, prompt) {
    const buffer = fs.readFileSync(path)
    const base64 = buffer.toString('base64')
    return [
        {
            inlineData: {
                mimeType,
                data: base64,
            },
        },
        { text: prompt },
    ];
}