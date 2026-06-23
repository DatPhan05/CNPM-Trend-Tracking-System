-- Constraints: c_user_email_unique
-- Description: Enforces email uniqueness and foreign key mapping

-- Unique Constraint
ALTER TABLE "User" ADD CONSTRAINT "User_email_key" UNIQUE ("email");

-- Foreign Key: Bookmark -> User
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Foreign Key: Bookmark -> Paper
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE CASCADE ON UPDATE CASCADE;
