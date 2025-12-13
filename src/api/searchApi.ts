type SearchType = 'student' | 'teacher' | 'group' | 'discipline';

export interface SearchResult {
  type: SearchType;
  results: unknown[];
}

export const searchApi = async (type: SearchType, query: string): Promise<unknown[]> => {
  try {
    const params = new URLSearchParams({
      type,
      query,
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API}search?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }

    return await response.json() as unknown[];
  }
  catch (err) {
    console.log('>>> searchApi', err);
    return [];
  }
};
