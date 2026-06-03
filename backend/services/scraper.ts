import axios from "axios";
import { parseStringPromise } from "xml2js";
import prisma from "../lib/prisma";

// public open arXiv API query URL (fetching 15 papers on AI and Software Engineering)
const ARXIV_API_URL = "http://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cat:cs.SE&max_results=15&sortBy=submittedDate&sortOrder=descending";

export async function scrapeScientificPapers() {
  console.log("✈️ Bắt đầu gửi request cào dữ liệu từ arXiv API...");
  try {
    const response = await axios.get(ARXIV_API_URL);
    const xmlData = response.data;
    
    // Parse XML to JSON
    const parsedData = await parseStringPromise(xmlData);
    const entries = parsedData.feed.entry || [];

    console.log(`🔍 Phát hiện ${entries.length} bài viết mới từ arXiv. Bắt đầu lưu vào Database...`);

    let importedCount = 0;

    for (const entry of entries) {
      const title = (entry.title[0] || "Untitled").replace(/\n/g, " ").trim();
      const abstract = (entry.summary[0] || "").replace(/\n/g, " ").trim();
      const idUrl = entry.id[0] || "";
      const doi = entry["arxiv:doi"] ? entry["arxiv:doi"][0]._ : null;
      
      // Get publication year
      const publishedDate = entry.published[0] || "";
      const publicationYear = publishedDate ? new Date(publishedDate).getFullYear() : 2026;
      
      // Get source URL
      const sourceUrl = entry.link?.find((l: any) => l.$.title === "pdf")?.$.href || idUrl;
      const sourceProvider = "arXiv";

      // Authors array parsing
      const rawAuthors = entry.author || [];
      const authorNames: string[] = rawAuthors.map((a: any) => a.name[0].trim());

      // Keywords array parsing (using categories as keywords)
      const rawCategories = entry.category || [];
      const keywordNames: string[] = rawCategories.map((c: any) => c.$.term.trim());

      // 1. Find or create a default Journal for arXiv publications
      const journalName = "arXiv Preprints";
      const journal = await prisma.journal.upsert({
        where: { name: journalName },
        update: {},
        create: { name: journalName, publisher: "Cornell University" },
      });

      // 2. Check if Paper already exists in database (by title or DOI)
      const existingPaper = await prisma.paper.findFirst({
        where: {
          OR: [
            { title },
            ...(doi ? [{ doi }] : []),
          ],
        },
      });

      if (existingPaper) {
        console.log(`⚠️ Bài viết "${title.substring(0, 50)}..." đã tồn tại. Bỏ qua.`);
        continue;
      }

      // 3. Create Paper using Transaction
      await prisma.$transaction(async (tx) => {
        // Create Paper
        const paper = await tx.paper.create({
          data: {
            title,
            abstract,
            doi,
            publicationYear,
            citationCount: Math.floor(Math.random() * 50) + 1, // Mock citation count for trends tracking
            sourceUrl,
            sourceProvider,
            journalId: journal.id,
          },
        });

        // 4. Create Authors and link to Paper
        for (const authName of authorNames) {
          // Find or create Author
          const author = await tx.author.create({
            data: { name: authName }, // Note: We use unique UUIDs, so creating duplicate names is fine or we can upsert if there was a unique constraint, but schema has no unique name for Author.
          });
          // Link PaperAuthor
          await tx.paperAuthor.create({
            data: {
              paperId: paper.id,
              authorId: author.id,
            },
          });
        }

        // 5. Create Keywords and link to Paper
        for (const kwName of keywordNames) {
          // Find or create Keyword (unique name)
          const keyword = await tx.keyword.upsert({
            where: { name: kwName },
            update: {},
            create: { name: kwName },
          });
          // Link PaperKeyword
          await tx.paperKeyword.create({
            data: {
              paperId: paper.id,
              keywordId: keyword.id,
            },
          });
        }
      });

      console.log(`✅ Đã lưu thành công bài viết: "${title.substring(0, 50)}..."`);
      importedCount++;
    }

    console.log(`🎉 Quá trình cào hoàn tất! Đã nhập thêm ${importedCount} bài báo khoa học mới.`);
    return importedCount;
  } catch (error) {
    console.error("❌ Lỗi trong quá trình Scrape dữ liệu:", error);
    throw error;
  }
}

// Support running directly from CLI via 'npm run scrape'
if (require.main === module) {
  scrapeScientificPapers()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
