import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GetDataForImport = async (req, res) => {
  try {
    const brand = await prisma.designBrand.findMany();
    const category = await prisma.design_Category.findMany();
    const pattern = await prisma.patternDesign.findMany();
    const size = await prisma.size.findMany();
    const sizeDetail = await prisma.size_De.findMany();
    const data = [brand, category, pattern];
    res.status(200).json({ brand, category, pattern, size, sizeDetail });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
