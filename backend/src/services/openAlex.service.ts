import axios from "axios";

const OPENALEX_BASE_URL = "https://api.openalex.org";

export interface OpenAlexWork {
  id: string;
  doi?: string;
  title?: string;
  publication_year?: number;
  cited_by_count?: number;
  abstract_inverted_index?: Record<string, number[]>;
  primary_location?: {
    landing_page_url?: string;
    source?: {
      display_name?: string;
      host_organization_name?: string;
    };
  };
  authorships?: Array<{
    author?: {
      display_name?: string;
    };
  }>;
  concepts?: Array<{
    display_name?: string;
  }>;
}

export const fetchOpenAlexWorks = async (keyword: string, perPage = 10) => {
  const response = await axios.get(`${OPENALEX_BASE_URL}/works`, {
    params: {
      search: keyword,
      per_page: perPage,
    },
    headers: {
      "User-Agent": "Trend-Tracking/1.0.0 (mailto:admin@example.com)",
    },
  });

  return response.data.results as OpenAlexWork[];
};

export const convertInvertedIndexToText = (
  invertedIndex?: Record<string, number[]>
): string | null => {
  if (!invertedIndex) return null;

  const words: Array<{ word: string; position: number }> = [];

  Object.entries(invertedIndex).forEach(([word, positions]) => {
    positions.forEach((position) => {
      words.push({ word, position });
    });
  });

  return words
    .sort((a, b) => a.position - b.position)
    .map((item) => item.word)
    .join(" ");
};