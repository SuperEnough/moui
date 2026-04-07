export const generateCode = async (
  prompt: string,
  currentContext: string
): Promise<any> => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, currentContext }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AI generation request failed: ${response.status} ${text}`);
  }

  return response.json();
};

export const generateBuildSteps = async (_prompt: string): Promise<string[]> => {
  return [];
};