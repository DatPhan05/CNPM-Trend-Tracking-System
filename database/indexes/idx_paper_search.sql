-- Indexes: idx_paper_search
-- Description: B-Tree and text search indexes for faster filtering on the Paper table

-- Index for filtering by Publication Year (Often used in filters)
CREATE INDEX IF NOT EXISTS idx_paper_publication_year ON "Paper" ("publicationYear" DESC);

-- Index for filtering by Citation Count (Often used in sorting)
CREATE INDEX IF NOT EXISTS idx_paper_citation_count ON "Paper" ("citationCount" DESC);

-- Index for Journal matching
CREATE INDEX IF NOT EXISTS idx_paper_journal_id ON "Paper" ("journalId");

-- Full text search index (if using PostgreSQL text search vectors)
-- CREATE INDEX IF NOT EXISTS idx_paper_title_search ON "Paper" USING GIN (to_tsvector('english', title));
