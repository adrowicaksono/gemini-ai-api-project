import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";
import { getModelResponse, contentToGenerativePart } from './utils.js';

const app = express();
app.use(express.json());
dotenv.config();

//===generate model ===
const model = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
//=====================

const upload = multer({ dest: 'uploads/' });


const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/env', (req, res) => {
    res.send(`The value of MY_VARIABLE is: ${process.env.GEMINI_API_KEY}`);
});

app.post('/generate-text', async (req, res) => {
    const { prompt } = req.body
    try {
        const response = await getModelResponse({
            contents: prompt
        }, model)
        res.status(200).json({ prompt, output: response.text() })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})



app.post('/generate-from-image', upload.single('image'), async (req, res) => {
    const prompt = req.body.prompt || 'describe the image'

    try {
        const contents = contentToGenerativePart(req.file.path, req.file.mimetype, prompt)
        const response = await getModelResponse({
            contents
        }, model)
        res.status(200).json({ prompt, output: response.text })
    } catch (e) {
        res.status(500).json({ error: e.message })
    } finally {
        fs.unlinkSync(req.file.path)
    }
})

app.post('/generate-from-document', upload.single('document'), async (req, res) => {
    const prompt = req.body.prompt || 'analyze this document'

    try {
        const contents = contentToGenerativePart(req.file.path, req.file.mimetype, prompt)
        const response = await getModelResponse({
            contents
        }, model)
        res.status(200).json({ prompt, output: response.text })
    } catch (e) {
        res.status(500).json({ error: e.message })
    } finally {
        fs.unlinkSync(req.file.path)
    }
})

app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
    const prompt = req.body.prompt || 'transcribe or analyze the following audio'

    try {
        const contents = contentToGenerativePart(req.file.path, req.file.mimetype, prompt)
        const response = await getModelResponse({
            contents
        }, model)
        res.status(200).json({ prompt, output: response.text })
    } catch (e) {
        res.status(500).json({ error: e.message })
    } finally {
        fs.unlinkSync(req.file.path)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
