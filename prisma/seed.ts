import { UserRole } from "@prisma/client";
import prisma from "../backend/lib/prisma";

async function main() {
  console.log("🌱 Bắt đầu tạo dữ liệu mẫu (Seeding)...");

  // 1. Xóa sạch dữ liệu cũ để tránh trùng lặp khi chạy lại
  await prisma.paperAuthor.deleteMany();
  await prisma.paperKeyword.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.report.deleteMany();
  await prisma.paper.deleteMany();
  await prisma.author.deleteMany();
  await prisma.journal.deleteMany();
  await prisma.keyword.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Đã làm sạch cơ sở dữ liệu.");

  // 2. Tạo Người dùng (Users)
  const admin = await prisma.user.create({
    data: {
      fullName: "admintest",
      email: "admin@gmail.com",
      role: UserRole.ADMIN,
    },
  });

  const researcher = await prisma.user.create({
    data: {
      fullName: "researchertest",
      email: "researcher@gmail.com",
      role: UserRole.RESEARCHER,
    },
  });

  const student = await prisma.user.create({
    data: {
      fullName: "studenttest",
      email: "student@gmail.com",
      role: UserRole.STUDENT,
    },
  });

  console.log("👥 Đã tạo người dùng mẫu.");

  // 3. Tạo Tạp chí (Journals)
  const journalNature = await prisma.journal.create({
    data: {
      name: "Nature Machine Intelligence",
      publisher: "Springer Nature",
    },
  });

  const journalIEEE = await prisma.journal.create({
    data: {
      name: "IEEE Transactions on Software Engineering",
      publisher: "IEEE",
    },
  });

  console.log("📖 Đã tạo tạp chí mẫu.");

  // 4. Tạo Tác giả (Authors)
  const author1 = await prisma.author.create({ data: { name: "Andrew Ng" } });
  const author2 = await prisma.author.create({ data: { name: "Geoffrey Hinton" } });
  const author3 = await prisma.author.create({ data: { name: "Martin Fowler" } });

  console.log("✍️ Đã tạo tác giả mẫu.");

  // 5. Tạo Từ khóa (Keywords)
  const kwAI = await prisma.keyword.create({ data: { name: "Artificial Intelligence" } });
  const kwML = await prisma.keyword.create({ data: { name: "Machine Learning" } });
  const kwSE = await prisma.keyword.create({ data: { name: "Software Engineering" } });
  const kwArchitecture = await prisma.keyword.create({ data: { name: "Microservices" } });

  console.log("🏷️ Đã tạo từ khóa mẫu.");

  // 6. Tạo Bài báo khoa học (Papers)
  const paper1 = await prisma.paper.create({
    data: {
      title: "Deep Learning Trends in Medical Diagnosis",
      abstract: "This paper reviews recent breakthroughs in deep learning and machine learning models applied to medical imaging and healthcare diagnostics, exploring future growth vectors.",
      doi: "10.1038/s42256-026-0001-z",
      publicationYear: 2025,
      citationCount: 142,
      sourceUrl: "https://www.nature.com/articles/s42256",
      sourceProvider: "Nature",
      journalId: journalNature.id,
    },
  });

  const paper2 = await prisma.paper.create({
    data: {
      title: "Evolution of Microservices and Cloud-Native Software Architecture",
      abstract: "An empirical study on how large enterprises transition from monolithic systems to microservices, emphasizing pattern challenges, API gateways, and telemetry.",
      doi: "10.1109/TSE.2026.0002-x",
      publicationYear: 2026,
      citationCount: 48,
      sourceUrl: "https://ieeexplore.ieee.org/document/123456",
      sourceProvider: "IEEE",
      journalId: journalIEEE.id,
    },
  });

  console.log("📄 Đã tạo các bài báo mẫu.");

  // 7. Tạo quan hệ Bài báo - Tác giả (PaperAuthor)
  await prisma.paperAuthor.createMany({
    data: [
      { paperId: paper1.id, authorId: author1.id },
      { paperId: paper1.id, authorId: author2.id },
      { paperId: paper2.id, authorId: author3.id },
    ],
  });

  // 8. Tạo quan hệ Bài báo - Từ khóa (PaperKeyword)
  await prisma.paperKeyword.createMany({
    data: [
      { paperId: paper1.id, keywordId: kwAI.id },
      { paperId: paper1.id, keywordId: kwML.id },
      { paperId: paper2.id, keywordId: kwSE.id },
      { paperId: paper2.id, keywordId: kwArchitecture.id },
    ],
  });

  console.log("🔗 Đã thiết lập quan hệ Tác giả và Từ khóa cho bài báo.");

  // 9. Tạo Bookmark và Báo cáo mẫu
  await prisma.bookmark.create({
    data: {
      userId: researcher.id,
      paperId: paper1.id,
    },
  });

  await prisma.report.create({
    data: {
      title: "Báo cáo xu hướng AI năm 2026",
      content: "Xu hướng học sâu (Deep Learning) đang dịch chuyển mạnh mẽ từ mô hình ngôn ngữ lớn (LLM) sang các mô hình đa phương thức (Multimodal) ứng dụng thực tiễn trong y tế.",
      userId: admin.id,
    },
  });

  console.log("📌 Đã tạo bookmark và báo cáo mẫu.");
  console.log("🎉 Hoàn thành nạp dữ liệu mẫu thành công!");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi trong quá trình Seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
