import { unknown } from 'zod';
import {env} from '../config/env';

const MODEL = 'facebook/bart-large-mnli'
const HF_URL= `https://router.huggingface.co/hf-inference/models/${MODEL}`;

const TIMEOUT_MS =6000;
const MAX_CHARS =2000;

const Scam_Label = 'job scam';
const Genuine_Label = 'genuine job offer';

export  interface AiResult{
    model : string;
    label : string;
    scamScore : number;
}

type LabelScore = { label : string;
    score : number;};

function toLabelScores(data: unknown): LabelScore[] {
  if (Array.isArray(data)) return data as LabelScore[];
  const d = data as { labels?: string[]; scores?: number[] };
  if (d?.labels && d?.scores) return d.labels.map((label, i) => ({ label, score: d.scores![i] }));
  return [];
}

export async function getAiScamScore(jobText: string): Promise<AiResult | null> {
  if (!env.hfApiKey) return null;
   try {
    const res = await fetch(HF_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.hfApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: jobText.slice(0, MAX_CHARS),
        parameters: {
          candidate_labels: [Scam_Label, Genuine_Label],
          // hypothesis_template: 'This job post is a {}.',
        },
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
      if (!res.ok) {
      // 401 = bad token, 402 = free credits over, 503 = model loading
      const errText = await res.text();
      console.warn(`HF failed ${res.status}: ${errText.slice(0, 300)}`);
      // console.warn(`HF inference failed with status ${res.status} - using rules only`);
      return null;
    }

    const results = toLabelScores(await res.json());
    const scam = results.find((r) => r.label === Scam_Label);
    if (!scam) return null;

    const top = results.reduce((best, r) => (r.score > best.score ? r : best));
    return { model: MODEL, label: top.label, scamScore: Math.round(scam.score * 100) / 100 };
  } catch (err) {
    
    console.warn('HF inference skipped:', err instanceof Error ? err.message : err);
    return null;
  }
}
       