export interface KeywordInsight {
  keyword: string;
  monthlySearchVolume: number;
  keywordDifficulty: number; // 0 - 100
  cpcUsd: number;
  searchIntent: 'INFORMATIONAL' | 'COMMERCIAL' | 'TRANSACTIONAL' | 'NAVIGATIONAL';
  globalVolume: number;
  parentTopic: string;
  generatedPrompts: Array<{
    prompt: string;
    targetPlatform: 'ChatGPT' | 'Claude' | 'Gemini' | 'Perplexity' | 'Google AI Overviews';
    funnelStage: 'Top of Funnel' | 'Middle of Funnel' | 'Bottom of Funnel';
    triggerIntent: string;
  }>;
}

export function exploreKeyword(keyword: string): KeywordInsight {
  const cleanKeyword = keyword.trim().toLowerCase();

  // Synthetic deterministic estimation based on keyword string hash
  let hash = 0;
  for (let i = 0; i < cleanKeyword.length; i++) {
    hash = (hash << 5) - hash + cleanKeyword.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const monthlySearchVolume = 450 + (absHash % 28500);
  const keywordDifficulty = Math.min(94, Math.max(14, (absHash % 70) + 18));
  const cpcUsd = Number(((absHash % 850) / 100 + 0.95).toFixed(2));
  const globalVolume = Math.round(monthlySearchVolume * 2.4);

  let searchIntent: KeywordInsight['searchIntent'] = 'INFORMATIONAL';
  if (cleanKeyword.includes('buy') || cleanKeyword.includes('pricing') || cleanKeyword.includes('cost')) {
    searchIntent = 'TRANSACTIONAL';
  } else if (cleanKeyword.includes('best') || cleanKeyword.includes('vs') || cleanKeyword.includes('review') || cleanKeyword.includes('platform')) {
    searchIntent = 'COMMERCIAL';
  } else if (cleanKeyword.includes('login') || cleanKeyword.includes('app') || cleanKeyword.includes('official')) {
    searchIntent = 'NAVIGATIONAL';
  }

  // Prompt Fanout Engine: Expands keyword into conversational questions asked to AI models
  const generatedPrompts: KeywordInsight['generatedPrompts'] = [
    {
      prompt: `What are the leading tools and platforms for ${cleanKeyword}?`,
      targetPlatform: 'Perplexity',
      funnelStage: 'Top of Funnel',
      triggerIntent: 'Comprehensive platform comparison with cited sources'
    },
    {
      prompt: `How to implement ${cleanKeyword} in enterprise production architectures?`,
      targetPlatform: 'ChatGPT',
      funnelStage: 'Middle of Funnel',
      triggerIntent: 'Technical implementation steps and architectural guidance'
    },
    {
      prompt: `Best alternatives and pricing models for ${cleanKeyword}`,
      targetPlatform: 'Claude',
      funnelStage: 'Bottom of Funnel',
      triggerIntent: 'Commercial buyer evaluation and vendor trade-offs'
    },
    {
      prompt: `What is the difference between ${cleanKeyword} and legacy analytics?`,
      targetPlatform: 'Gemini',
      funnelStage: 'Middle of Funnel',
      triggerIntent: 'Conceptual disambiguation and feature contrast'
    },
    {
      prompt: `Top rated solutions for ${cleanKeyword} 2026`,
      targetPlatform: 'Google AI Overviews',
      funnelStage: 'Top of Funnel',
      triggerIntent: 'Search-backed overview triggering Google AI Mode snippet'
    }
  ];

  return {
    keyword: cleanKeyword,
    monthlySearchVolume,
    keywordDifficulty,
    cpcUsd,
    searchIntent,
    globalVolume,
    parentTopic: cleanKeyword.split(' ')[0] || 'software',
    generatedPrompts
  };
}
