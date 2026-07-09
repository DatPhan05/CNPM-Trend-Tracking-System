import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { fetchOpenAlexWorks, convertInvertedIndexToText } from './openAlex.service';
import prisma from '../helpers/prisma';
import { indexPaper } from './elasticsearch.service';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const connection = new IORedis(REDIS_URL, { maxRetriesPerRequest: null });

export const crawlerQueue = new Queue('crawler', { connection: connection as any });

export const initWorker = () => {
  const worker = new Worker('crawler', async job => {
    const { keyword, limit } = job.data;
    console.log(`[Worker] Started crawling for keyword: "${keyword}", limit: ${limit}`);

    try {
      const works = await fetchOpenAlexWorks(keyword, limit);
      let savedCount = 0;

      for (const work of works) {
        const title = work.title || "Untitled paper";
        const doi = work.doi || null;
        const abstract = convertInvertedIndexToText(work.abstract_inverted_index);
        const journalName = work.primary_location?.source?.display_name || "Unknown Journal";
        const sourceUrl = work.primary_location?.landing_page_url || work.id;

        let journal = await prisma.journal.findUnique({ where: { name: journalName } });
        if (!journal) {
          journal = await prisma.journal.create({
            data: {
              name: journalName,
              publisher: work.primary_location?.source?.host_organization_name || null,
            },
          });
        }

        const paper = await prisma.paper.upsert({
          where: { doi: doi || `openalex:${work.id}` },
          update: {
            title, abstract, publicationYear: work.publication_year || null,
            citationCount: work.cited_by_count || 0, sourceUrl, sourceProvider: "OpenAlex",
            journalId: journal.id,
          },
          create: {
            title, abstract, doi: doi || `openalex:${work.id}`,
            publicationYear: work.publication_year || null, citationCount: work.cited_by_count || 0,
            sourceUrl, sourceProvider: "OpenAlex", journalId: journal.id,
          },
        });

        const authors = work.authorships?.map((item: any) => item.author?.display_name).filter((name: any): name is string => Boolean(name)) || [];
        for (const authorName of authors) {
          let author = await prisma.author.findFirst({ where: { name: authorName } });
          if (!author) {
            author = await prisma.author.create({ data: { name: authorName } });
          }
          await prisma.paperAuthor.upsert({
            where: { paperId_authorId: { paperId: paper.id, authorId: author.id } },
            update: {},
            create: { paperId: paper.id, authorId: author.id },
          });
        }

        const keywords = work.concepts?.slice(0, 5).map((item: any) => item.display_name).filter((name: any): name is string => Boolean(name)) || [];
        for (const keywordName of keywords) {
          let keywordRecord = await prisma.keyword.findUnique({ where: { name: keywordName } });
          if (!keywordRecord) {
            keywordRecord = await prisma.keyword.create({ data: { name: keywordName } });
          }
          await prisma.paperKeyword.upsert({
            where: { paperId_keywordId: { paperId: paper.id, keywordId: keywordRecord.id } },
            update: {},
            create: { paperId: paper.id, keywordId: keywordRecord.id },
          });
        }

        // Lấy lại data với relations để index lên Elasticsearch
        const fullPaper = await prisma.paper.findUnique({
          where: { id: paper.id },
          include: { journal: true, authors: { include: { author: true } }, keywords: { include: { keyword: true } } }
        });

        if (fullPaper) {
          await indexPaper(fullPaper);
        }

        savedCount++;
      }

      console.log(`[Worker] Finished crawling. Saved ${savedCount} papers.`);
      return { totalFetched: works.length, totalSaved: savedCount };
    } catch (error) {
      console.error(`[Worker] Error:`, error);
      throw error;
    }
  }, { connection: connection as any });

  worker.on('completed', job => {
    console.log(`[Worker] Job ${job?.id} completed successfully.`);
    console.log(`[Worker] Job ${job.id} completed successfully.`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed with error:`, err);
  });

  console.log('[Worker] BullMQ Worker initialized.');
};
