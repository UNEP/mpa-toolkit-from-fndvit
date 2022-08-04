-- CreateTable
CREATE TABLE "Component" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "component" TEXT NOT NULL,
    "display" TEXT,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageOrdering" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "display" TEXT,

    CONSTRAINT "PageOrdering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponetnsonPageOrdering" (
    "position" INTEGER NOT NULL,
    "componentId" INTEGER NOT NULL,
    "pageOrderingId" INTEGER NOT NULL,

    CONSTRAINT "ComponetnsonPageOrdering_pkey" PRIMARY KEY ("componentId","pageOrderingId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Component_name_key" ON "Component"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PageOrdering_name_key" ON "PageOrdering"("name");

-- AddForeignKey
ALTER TABLE "ComponetnsonPageOrdering" ADD CONSTRAINT "ComponetnsonPageOrdering_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponetnsonPageOrdering" ADD CONSTRAINT "ComponetnsonPageOrdering_pageOrderingId_fkey" FOREIGN KEY ("pageOrderingId") REFERENCES "PageOrdering"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
