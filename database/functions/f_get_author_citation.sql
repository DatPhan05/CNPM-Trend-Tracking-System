-- Function: f_get_author_citation
-- Description: Calculates the total citations across all papers written by a specific author

CREATE OR REPLACE FUNCTION f_get_author_citation(author_id TEXT)
RETURNS INTEGER AS $$
DECLARE
    total_cites INTEGER;
BEGIN
    SELECT COALESCE(SUM(p."citationCount"), 0)
    INTO total_cites
    FROM "Paper" p
    JOIN "PaperAuthor" pa ON p.id = pa."paperId"
    WHERE pa."authorId" = author_id;

    RETURN total_cites;
END;
$$ LANGUAGE plpgsql;
