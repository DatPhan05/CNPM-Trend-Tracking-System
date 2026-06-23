import { Request, Response } from 'express';
import prisma from '../helpers/prisma';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';

/**
 * Get overview statistics
 * @route GET /api/analytics/overview
 */
export const getOverview = async (req: Request, res: Response) => {
  try {
    const totalPapers = await prisma.paper.count();
    const totalAuthors = await prisma.author.count();
    const totalKeywords = await prisma.keyword.count();
    const totalJournals = await prisma.journal.count();

    // Calculate papers published this month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newPapersThisMonth = await prisma.paper.count({
      where: {
        createdAt: {
          gte: firstDayOfMonth,
        },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        totalPapers,
        totalAuthors,
        totalKeywords,
        totalJournals,
        newPapersThisMonth,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get publication trends over the years
 * @route GET /api/analytics/trends
 */
export const getTrends = async (req: Request, res: Response) => {
  try {
    // Group by publicationYear
    const trends = await prisma.paper.groupBy({
      by: ['publicationYear'],
      _count: {
        id: true,
      },
      where: {
        publicationYear: {
          not: null,
        },
      },
      orderBy: {
        publicationYear: 'asc',
      },
    });

    const formattedTrends = trends.map((item) => ({
      year: item.publicationYear?.toString(),
      count: item._count.id,
    }));

    res.status(200).json({
      success: true,
      data: formattedTrends,
    });
  } catch (error) {
    console.error('Error fetching analytics trends:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get papers distributed by journals (acting as categories)
 * @route GET /api/analytics/categories
 */
export const getCategories = async (req: Request, res: Response) => {
  try {
    // Top 10 Journals with most papers
    const journals = await prisma.journal.findMany({
      include: {
        _count: {
          select: { papers: true },
        },
      },
      orderBy: {
        papers: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    const formattedCategories = journals.map((j) => ({
      name: j.name,
      value: j._count.papers,
    }));

    res.status(200).json({
      success: true,
      data: formattedCategories,
    });
  } catch (error) {
    console.error('Error fetching analytics categories:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get top authors by paper count
 * @route GET /api/analytics/top-authors
 */
export const getTopAuthors = async (req: Request, res: Response) => {
  try {
    const authors = await prisma.author.findMany({
      include: {
        _count: {
          select: { papers: true },
        },
      },
      orderBy: {
        papers: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    const formattedAuthors = authors.map((a) => ({
      name: a.name,
      count: a._count.papers,
    }));

    res.status(200).json({
      success: true,
      data: formattedAuthors,
    });
  } catch (error) {
    console.error('Error fetching analytics top authors:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Export papers data as CSV
 * @route GET /api/analytics/export/csv
 */
export const exportCsv = async (req: Request, res: Response) => {
  try {
    const papers = await prisma.paper.findMany({
      include: {
        journal: true,
      },
      orderBy: { citationCount: 'desc' }
    });

    const data = papers.map(p => ({
      Title: p.title,
      Year: p.publicationYear || 'N/A',
      Citations: p.citationCount,
      Journal: p.journal?.name || p.sourceProvider || 'N/A'
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('papers_report.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Export analytics report as PDF
 * @route GET /api/analytics/export/pdf
 */
export const exportPdf = async (req: Request, res: Response) => {
  try {
    const papers = await prisma.paper.findMany({
      take: 20,
      orderBy: { citationCount: 'desc' }
    });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="analytics_report.pdf"');
    
    // Pipe directly to HTTP response
    doc.pipe(res);

    doc.fontSize(20).text('Scientific Journal Trend Tracker', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text('Top Cited Papers Report', { underline: true });
    doc.moveDown();

    papers.forEach((p, i) => {
      doc.fontSize(12).text(`${i + 1}. ${p.title} (${p.publicationYear || 'N/A'})`);
      doc.fontSize(10).fillColor('gray').text(`Citations: ${p.citationCount}`).moveDown(0.5);
      doc.fillColor('black');
    });

    doc.end();
  } catch (error) {
    console.error('Error exporting PDF:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
