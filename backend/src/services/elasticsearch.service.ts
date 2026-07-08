import { Client } from '@elastic/elasticsearch';

const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';

// Initialize Elasticsearch client
const esClient = new Client({
  node: ELASTICSEARCH_URL,
  // Tắt kiểm tra SSL/TLS nội bộ cho môi trường dev
  tls: {
    rejectUnauthorized: false
  }
});

const INDEX_NAME = 'papers';

// Khởi tạo Index (nếu chưa có)
export const initElasticsearch = async () => {
  try {
    const indexExists = await esClient.indices.exists({ index: INDEX_NAME });
    if (!indexExists) {
      await esClient.indices.create({
        index: INDEX_NAME,
        mappings: {
          properties: {
            id: { type: 'keyword' },
            title: { type: 'text', analyzer: 'standard' },
            abstract: { type: 'text', analyzer: 'standard' },
            publicationYear: { type: 'integer' },
            citationCount: { type: 'integer' },
            authors: { type: 'keyword' },
            keywords: { type: 'keyword' },
            journal: { type: 'keyword' }
          }
        }
      });
      console.log(`[Elasticsearch] Index "${INDEX_NAME}" created.`);
    } else {
      console.log(`[Elasticsearch] Index "${INDEX_NAME}" already exists.`);
    }
  } catch (error) {
    console.error('[Elasticsearch] Initialization Error:', error);
  }
};

// Đồng bộ 1 bài báo lên ES
export const indexPaper = async (paper: any) => {
  try {
    await esClient.index({
      index: INDEX_NAME,
      id: paper.id,
      document: {
        id: paper.id,
        title: paper.title,
        abstract: paper.abstract,
        publicationYear: paper.publicationYear,
        citationCount: paper.citationCount,
        authors: paper.paperAuthors?.map((pa: any) => pa.author.name) || [],
        keywords: paper.paperKeywords?.map((pk: any) => pk.keyword.name) || [],
        journal: paper.journal?.name || null
      }
    });
    // refresh index to make it searchable immediately (for dev/testing)
    await esClient.indices.refresh({ index: INDEX_NAME });
  } catch (error) {
    console.error(`[Elasticsearch] Failed to index paper ${paper.id}:`, error);
  }
};

// Tìm kiếm bài báo bằng ES
export const searchPapersES = async (query: string, page: number = 1, limit: number = 10) => {
  try {
    const from = (page - 1) * limit;
    
    const searchOptions: any = {
      index: INDEX_NAME,
      from,
      size: limit,
      query: {
        match_all: {}
      },
      sort: [
        { citationCount: { order: 'desc' } }
      ]
    };

    if (query) {
      searchOptions.query = {
        multi_match: {
          query,
          fields: ['title^3', 'abstract', 'authors', 'keywords'], // title được nhân 3 trọng số
          fuzziness: 'AUTO' // Hỗ trợ tìm kiếm sai lỗi chính tả
        }
      };
    }

    const result = await esClient.search(searchOptions);

    const hits = result.hits.hits;
    const total = (result.hits.total as any).value || 0;

    return {
      papers: hits.map((hit: any) => hit._source),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('[Elasticsearch] Search Error:', error);
    return null;
  }
};

export default esClient;
