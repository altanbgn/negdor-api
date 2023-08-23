-- CreateIndex
CREATE INDEX "Category_id_idx" ON "Category"("id");

-- CreateIndex
CREATE INDEX "Member_id_idx" ON "Member"("id");

-- CreateIndex
CREATE INDEX "Organization_id_name_idx" ON "Organization"("id", "name");

-- CreateIndex
CREATE INDEX "Rating_id_idx" ON "Rating"("id");

-- CreateIndex
CREATE INDEX "Review_id_idx" ON "Review"("id");

-- CreateIndex
CREATE INDEX "Tag_id_idx" ON "Tag"("id");

-- CreateIndex
CREATE INDEX "User_id_username_email_firstname_lastname_phonenumber_idx" ON "User"("id", "username", "email", "firstname", "lastname", "phonenumber");
