import { Request, Response } from "express";
import prisma from "../lib/prisma";
import {
  convertInvertedIndexToText,
  fetchOpenAlexWorks,
} from "../services/openAlex.service";

export const crawlOpenAlexPapers = async (req: Request, res: Response) => {
  try {
    const keyword = String(req.query.keyword || "");
    const limit = Number(req.query.limit || 10);

    if (!keyword) {
      return res.status(400).json({
        message: "keyword is required",
      });
    }

    const works = await fetchOpenAlexWorks(keyword, limit);

    let savedCount = 0;

    for (const work of works) {
      const title = work.title || "Untitled paper";
      const doi = work.doi || null;
      const abstract = convertInvertedIndexToText(work.abstract_inverted_index);
      const journalName =
        work.primary_location?.source?.display_name || "Unknown Journal";
      const sourceUrl = work.primary_location?.landing_page_url || work.id;

      let journal = await prisma.journal.findUnique({
        where: { name: journalName },
      });

      if (!journal) {
        journal = await prisma.journal.create({
          data: {
            name: journalName,
            publisher:
              work.primary_location?.source?.host_organization_name || null,
          },
        });
      }

      const paper = await prisma.paper.upsert({
        where: {
          doi: doi || `openalex:${work.id}`,
        },
        update: {
          title,
          abstract,
          publicationYear: work.publication_year || null,
          citationCount: work.cited_by_count || 0,
          sourceUrl,
          sourceProvider: "OpenAlex",
          journalId: journal.id,
        },
        create: {
          title,
          abstract,
          doi: doi || `openalex:${work.id}`,
          publicationYear: work.publication_year || null,
          citationCount: work.cited_by_count || 0,
          sourceUrl,
          sourceProvider: "OpenAlex",
          journalId: journal.id,
        },
      });

      const authors =
        work.authorships
          ?.map((item) => item.author?.display_name)
          .filter((name): name is string => Boolean(name)) || [];

      for (const authorName of authors) {
        let author = await prisma.author.findFirst({
          where: { name: authorName },
        });

        if (!author) {
          author = await prisma.author.create({
            data: {
              name: authorName,
            },
          });
        }

        await prisma.paperAuthor.upsert({
          where: {
            paperId_authorId: {
              paperId: paper.id,
              authorId: author.id,
            },
          },
          update: {},
          create: {
            paperId: paper.id,
            authorId: author.id,
          },
        });
      }

      const keywords =
        work.concepts
          ?.slice(0, 5)
          .map((item) => item.display_name)
          .filter((name): name is string => Boolean(name)) || [];

      for (const keywordName of keywords) {
        let keywordRecord = await prisma.keyword.findUnique({
          where: { name: keywordName },
        });

        if (!keywordRecord) {
          keywordRecord = await prisma.keyword.create({
            data: {
              name: keywordName,
            },
          });
        }

        await prisma.paperKeyword.upsert({
          where: {
            paperId_keywordId: {
              paperId: paper.id,
              keywordId: keywordRecord.id,
            },
          },
          update: {},
          create: {
            paperId: paper.id,
            keywordId: keywordRecord.id,
          },
        });
      }

      savedCount++;
    }

    return res.status(200).json({
      message: "Crawl OpenAlex papers successfully",
      keyword,
      totalFetched: works.length,
      totalSaved: savedCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};