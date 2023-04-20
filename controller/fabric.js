import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const AddFabricPattern = async (req, res) => {
  const input = req.body;
  const user = req.user;

  try {
    const check = await prisma.fabricPattern.findMany({
      where: {
        FabricPatternName: input.name,
      },
    });
    if (check.length > 0) throw Error("มีลายผ้าในระบบแล้ว");
    const data = await prisma.fabricPattern.create({
      data: {
        FabricPatternName: input.name,
        FabricPattern_Descripttion: input.descript,
      },
    });
    res.status(200).json({
      Success: "เพิ่มลายผ้าเรียบร้อย",
      data: data,
      user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const AddFabricWeaving = async (req, res) => {
  const input = req.body;
  const user = req.user;
  try {
    const check = await prisma.fabric_Weaving.findMany({
      where: {
        weaving_name: input.name,
      },
    });
    if (check.length > 0) throw Error("มีผ้านี้ในระบบแล้ว");
    const data = await prisma.fabric_Weaving.create({
      data: {
        weaving_name: input.name,
        weaving_description: input.descript,
      },
    });
    res.status(200).json({
      Success: "เพิ่มเทคนิคการทอผ้าเรียบร้อย",
      data: data,
      user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const AddFabric = async (req, res) => {
  const user = req.user;

  const input = req.body;
  console.log(input);
  try {
    const check = await prisma.fabric.findMany({
      where: {
        weaving_ID: +input.weaving_id,
        FabricColorTechnique_ID: +input.color_id,
        Fabrictype_id: +input.fabrictype_id,
        FabricPattern_ID: +input.Pattern_id,
      },
    });
    console.log(check);
    if (check.length > 0) throw Error("มีผ้านี้ในระบบแล้ว");
    const data = await prisma.fabric.create({
      data: {
        weaving_ID: +input.weaving_id,
        FabricColorTechnique_ID: +input.color_id,
        Fabrictype_id: +input.fabrictype_id,
        FabricPattern_ID: +input.Pattern_id,
      },
    });
    res.status(200).json({
      Success: "เพิ่มผ้าเรียบร้อย",
      data: data,
      user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const getAddFabric = async (req, res) => {
  const user = req.user;

  try {
    const weaving = await prisma.fabric_Weaving.findMany();
    const color = await prisma.fabric_Color_Technique.findMany();
    const pattern = await prisma.fabricPattern.findMany();
    const type = await prisma.fabricType.findMany();

    res.status(200).json({ weaving, color, pattern, type, user });
  } catch (error) {
    res
      .status(400)
      .json({ error: "ไม่สามารถเรียกดูข้อมูลได้ โปรดลองอีกครั้ง" });
  }
};
