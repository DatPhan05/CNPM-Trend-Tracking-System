import { Request, Response } from 'express';
import prisma from '../helpers/prisma';

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
