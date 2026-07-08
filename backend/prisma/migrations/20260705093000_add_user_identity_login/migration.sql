ALTER TABLE "User" ADD COLUMN "user_name" TEXT;
ALTER TABLE "User" ADD COLUMN "identity_uid" TEXT;
ALTER TABLE "User" ADD COLUMN "school_name" TEXT;

CREATE UNIQUE INDEX "User_user_name_key" ON "User"("user_name");
CREATE UNIQUE INDEX "User_identity_uid_key" ON "User"("identity_uid");
