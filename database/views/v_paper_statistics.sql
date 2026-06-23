-- View: v_paper_statistics
-- Description: Aggregates paper statistics by year and journal to serve the Analytics Dashboard

CREATE OR REPLACE VIEW v_paper_statistics AS
SELECT 
    p."publicationYear",
    j."name" AS journal_name,
    COUNT(p.id) AS total_papers,
    SUM(p."citationCount") AS total_citations,
    AVG(p."citationCount") AS avg_citations
FROM "Paper" p
LEFT JOIN "Journal" j ON p."journalId" = j.id
GROUP BY p."publicationYear", j."name"
ORDER BY p."publicationYear" DESC, total_citations DESC;
