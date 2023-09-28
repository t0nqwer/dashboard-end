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

export const selectFabric = async (req, res) => {
  try {
    const fabric = await prisma.fabric.findMany({
      select: {
        Fabric_ID: true,
        Weaving: true,
        Color: true,
        Pattern: true,
        Type: true,
        Product: true,
      },
    });
    res.status(200).json({ fabric });
  } catch (error) {
    req.status(400).json({ error: error.message });
  }
};

export const Getcurrent = async (req, res) => {
  try {
    const fabric = await prisma.fabric.findMany({
      select: {
        Fabric_ID: true,
        Weaving: true,
        Color: true,
        Pattern: true,
        Type: true,
        Product: true,
      },
    });

    const datafilter = fabric.filter((e) => e.Product.length > 0);
    const resdata = {
      count: fabric.length,
      filter: datafilter.length,
      Weaving: [...new Set(datafilter.map((e) => e.Weaving.weaving_name))],
      Color: [
        ...new Set(datafilter.map((e) => e.Color.FabricColorTechnique_name)),
      ],
      Pattern: [
        ...new Set(datafilter.map((e) => e.Pattern?.FabricPatternName)),
      ].filter((e) => e),
      Type: [...new Set(datafilter.map((e) => e.Type.name))],
      fabric: [
        ...new Set(
          datafilter.map((e) => ({
            name: `ผ้า${e.Type.name}${e.Weaving.weaving_name}${
              e.Color.FabricColorTechnique_name === "เคมี"
                ? ""
                : e.Color.FabricColorTechnique_name === "eco-printed"
                ? e.Color.FabricColorTechnique_name
                : `ย้อมสี${e.Color.FabricColorTechnique_name}`
            }${
              e?.Pattern?.FabricPatternName ? e?.Pattern?.FabricPatternName : ""
            }`,
            color: e.Color.FabricColorTechnique_name,
            weaving: e.Weaving.weaving_name,
            type: e.Type.name,
            pattern: e.Pattern?.FabricPatternName,
            id: e.Fabric_ID,
          }))
        ),
      ],
    };

    res.status(200).json({ resdata });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
export const updateFabric = async (req, res) => {
  const { code, productId, fabricId } = req.body;
  try {
    console.log(code, productId, fabricId);
    const check = await prisma.product_Cloth.findMany({
      where: { code: code, fabric_id: fabricId },
    });
    if (check.length > 0) throw Error("มีสินค้านี้ในระบบแล้ว");
    const data = await prisma.product_Cloth.update({
      where: {
        product_id: +productId,
      },
      data: {
        fabric_id: fabricId,
      },
      select: {
        product_id: true,
        code: true,
        Forweb: true,
        IsHero: true,
        fabric: {
          select: {
            Fabric_ID: true,
            Weaving: true,
            Color: true,
            Pattern: true,
            Type: true,
          },
        },
        description: true,
        design: {
          select: {
            Design_Name: true,
            Brand: true,
            Category: true,
            Pattern: true,
            Size: {
              select: {
                Size_ID: true,
                Size_De_Info: {
                  select: {
                    Detail: true,
                    Info: true,
                  },
                },
              },
              orderBy: {
                Size: {
                  Size_Sort: "asc",
                },
              },
            },
          },
        },
        Front_img: true,
        Back_img: true,
        price: true,
        Product_Cloth_Detail: {
          select: {
            Img_Url: true,
          },
        },
        Stock_Info: true,
      },
    });

    res.status(200).json({ product: data, Res: "อัพเดทผ้าเรียบร้อยแล้ว" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};
