import { UserRole } from "@prisma/client";
import prisma from "../../backend/src/helpers/prisma";
import bcrypt from "bcrypt";

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

  const defaultPassword = await bcrypt.hash("admin123", 10);

  // 2. Tạo Người dùng (Users)
  const admin = await prisma.user.create({
    data: {
      fullName: "admintest",
      email: "admin@admin.com",
      userName: "admin",
      schoolName: "Server Owner",
      password: defaultPassword,
      role: UserRole.ADMIN,
    },
  });

  const researcher = await prisma.user.create({
    data: {
      fullName: "researchertest",
      email: "researcher@gmail.com",
      userName: "079200000002",
      identityUid: "079200000002",
      schoolName: "Đại học Bách Khoa",
      password: defaultPassword,
      role: UserRole.RESEARCHER,
    },
  });

  const student = await prisma.user.create({
    data: {
      fullName: "studenttest",
      email: "student@gmail.com",
      userName: "079200000003",
      identityUid: "079200000003",
      schoolName: "Đại học Quốc Gia",
      password: defaultPassword,
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

  const journalScience = await prisma.journal.create({
    data: { name: "Science", publisher: "AAAS" },
  });

  const journalNIPS = await prisma.journal.create({
    data: { name: "NIPS", publisher: "NeurIPS Foundation" },
  });

  console.log("📖 Đã tạo tạp chí mẫu.");

  // 4. Tạo Tác giả (Authors)
  const author1 = await prisma.author.create({ data: { name: "Andrew Ng" } });
  const author2 = await prisma.author.create({ data: { name: "Geoffrey Hinton" } });
  const author3 = await prisma.author.create({ data: { name: "Martin Fowler" } });
  const author4 = await prisma.author.create({ data: { name: "Ilya Sutskever" } });
  const author5 = await prisma.author.create({ data: { name: "Yann LeCun" } });
  const author6 = await prisma.author.create({ data: { name: "Yoshua Bengio" } });
  const author7 = await prisma.author.create({ data: { name: "Demis Hassabis" } });

  console.log("✍️ Đã tạo tác giả mẫu.");

  // 5. Tạo Từ khóa (Keywords)
  const kwAI = await prisma.keyword.create({ data: { name: "Artificial Intelligence" } });
  const kwML = await prisma.keyword.create({ data: { name: "Machine Learning" } });
  const kwSE = await prisma.keyword.create({ data: { name: "Software Engineering" } });
  const kwArchitecture = await prisma.keyword.create({ data: { name: "Microservices" } });
  const kwLLM = await prisma.keyword.create({ data: { name: "Large Language Models" } });
  const kwNLP = await prisma.keyword.create({ data: { name: "Natural Language Processing" } });
  const kwVision = await prisma.keyword.create({ data: { name: "Computer Vision" } });

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

  const paper3 = await prisma.paper.create({
    data: {
      title: "Quantum Computing Advances in 2024",
      abstract: "A comprehensive overview of quantum computing milestones achieved in early 2024, including error correction rates and qubit scalability.",
      doi: "10.1126/science.2024.0003",
      publicationYear: 2024,
      citationCount: 315,
      sourceProvider: "Science",
      journalId: journalScience.id,
    },
  });

  const paper4 = await prisma.paper.create({
    data: {
      title: "Transformers in Vision Tasks",
      abstract: "Exploring how transformer architectures are replacing CNNs in standard computer vision tasks like classification and segmentation.",
      doi: "10.5555/nips.2023.0004",
      publicationYear: 2023,
      citationCount: 890,
      sourceProvider: "NIPS",
      journalId: journalNIPS.id,
    },
  });

  const paper5 = await prisma.paper.create({
    data: {
      title: "Climate Change and Machine Learning",
      abstract: "Using machine learning to predict climate change impacts and optimize renewable energy distribution grids.",
      doi: "10.1038/s41586-022-0005",
      publicationYear: 2022,
      citationCount: 540,
      sourceProvider: "Nature",
      journalId: journalNature.id,
    },
  });

  const paper6 = await prisma.paper.create({
    data: {
      title: "Legacy Systems to Cloud Migration",
      abstract: "Evaluating the cost-benefit analysis of moving monolithic legacy healthcare systems to public cloud infrastructure.",
      doi: "10.1109/TSE.2024.0006",
      publicationYear: 2024,
      citationCount: 72,
      sourceProvider: "IEEE",
      journalId: journalIEEE.id,
    },
  });

  const paper7 = await prisma.paper.create({
    data: {
      title: "Llama 2: Open Foundation and Fine-Tuned Chat Models",
      abstract: "In this work, we develop and release Llama 2, a collection of pretrained and fine-tuned large language models (LLMs) ranging in scale from 7 billion to 70 billion parameters.",
      doi: "10.1038/llama2.2023",
      publicationYear: 2023,
      citationCount: 4500,
      sourceProvider: "Nature",
      journalId: journalNature.id,
    },
  });

  const paper8 = await prisma.paper.create({
    data: {
      title: "Gemini: A Family of Highly Capable Multimodal Models",
      abstract: "We introduce Gemini, a family of highly capable multimodal models, trained jointly across image, audio, video, and text data.",
      doi: "10.1126/science.gemini.2024",
      publicationYear: 2024,
      citationCount: 3200,
      sourceProvider: "Science",
      journalId: journalScience.id,
    },
  });

  const paper9 = await prisma.paper.create({
    data: {
      title: "Sparks of Artificial General Intelligence: Early experiments with GPT-4",
      abstract: "We demonstrate that, beyond its mastery of language, GPT-4 can solve novel and difficult tasks that span mathematics, coding, vision, medicine, law, psychology and more.",
      doi: "10.5555/nips.agi.2023",
      publicationYear: 2023,
      citationCount: 1800,
      sourceProvider: "NIPS",
      journalId: journalNIPS.id,
    },
  });

  const paper10 = await prisma.paper.create({
    data: {
      title: "Mamba: Linear-Time Sequence Modeling with Selective State Spaces",
      abstract: "We propose Mamba, a new state space model architecture showing promising performance on language modeling with linear time complexity.",
      doi: "10.1109/TSE.mamba.2024",
      publicationYear: 2024,
      citationCount: 950,
      sourceProvider: "IEEE",
      journalId: journalIEEE.id,
    },
  });

  const paper11 = await prisma.paper.create({
    data: {
      title: "QLoRA: Efficient Finetuning of Quantized LLMs",
      abstract: "We present QLoRA, an efficient finetuning approach that reduces memory usage enough to finetune a 65B parameter model on a single 48GB GPU.",
      doi: "10.5555/nips.qlora.2023",
      publicationYear: 2023,
      citationCount: 2100,
      sourceProvider: "NIPS",
      journalId: journalNIPS.id,
    },
  });

  const paper12 = await prisma.paper.create({
    data: {
      title: "Vision Transformers for Remote Sensing Image Classification",
      abstract: "A comprehensive review of the application of Vision Transformers (ViT) in remote sensing, highlighting their advantages over traditional CNNs.",
      doi: "10.1109/TSE.vit.2022",
      publicationYear: 2022,
      citationCount: 420,
      sourceProvider: "IEEE",
      journalId: journalIEEE.id,
    },
  });

  const paper13 = await prisma.paper.create({
    data: {
      title: "Ethical Considerations in Large Language Models",
      abstract: "An analysis of the ethical implications, biases, and safety concerns associated with deploying massive AI models in real-world applications.",
      doi: "10.1126/science.ethics.2021",
      publicationYear: 2021,
      citationCount: 890,
      sourceProvider: "Science",
      journalId: journalScience.id,
    },
  });

  console.log("📄 Đã tạo các bài báo mẫu.");

  // 7. Tạo quan hệ Bài báo - Tác giả (PaperAuthor)
  await prisma.paperAuthor.createMany({
    data: [
      { paperId: paper1.id, authorId: author1.id },
      { paperId: paper1.id, authorId: author2.id },
      { paperId: paper2.id, authorId: author3.id },
      { paperId: paper3.id, authorId: author1.id },
      { paperId: paper4.id, authorId: author2.id },
      { paperId: paper5.id, authorId: author1.id },
      { paperId: paper6.id, authorId: author3.id },
      { paperId: paper7.id, authorId: author5.id },
      { paperId: paper8.id, authorId: author7.id },
      { paperId: paper9.id, authorId: author4.id },
      { paperId: paper10.id, authorId: author6.id },
      { paperId: paper11.id, authorId: author6.id },
      { paperId: paper12.id, authorId: author5.id },
      { paperId: paper13.id, authorId: author4.id },
    ],
  });

  // 8. Tạo quan hệ Bài báo - Từ khóa (PaperKeyword)
  await prisma.paperKeyword.createMany({
    data: [
      { paperId: paper1.id, keywordId: kwAI.id },
      { paperId: paper1.id, keywordId: kwML.id },
      { paperId: paper2.id, keywordId: kwSE.id },
      { paperId: paper2.id, keywordId: kwArchitecture.id },
      { paperId: paper3.id, keywordId: kwAI.id },
      { paperId: paper4.id, keywordId: kwML.id },
      { paperId: paper5.id, keywordId: kwML.id },
      { paperId: paper6.id, keywordId: kwSE.id },
      { paperId: paper6.id, keywordId: kwArchitecture.id },
      { paperId: paper7.id, keywordId: kwLLM.id },
      { paperId: paper7.id, keywordId: kwAI.id },
      { paperId: paper8.id, keywordId: kwLLM.id },
      { paperId: paper8.id, keywordId: kwVision.id },
      { paperId: paper9.id, keywordId: kwAI.id },
      { paperId: paper9.id, keywordId: kwLLM.id },
      { paperId: paper10.id, keywordId: kwNLP.id },
      { paperId: paper10.id, keywordId: kwLLM.id },
      { paperId: paper11.id, keywordId: kwLLM.id },
      { paperId: paper11.id, keywordId: kwML.id },
      { paperId: paper12.id, keywordId: kwVision.id },
      { paperId: paper13.id, keywordId: kwAI.id },
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
