import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GetDataForImport = async (req, res) => {
  const user = req.user;

  try {
    const brand = await prisma.designBrand.findMany();
    const category = await prisma.design_Category.findMany();
    const pattern = await prisma.patternDesign.findMany();
    const size = await prisma.size.findMany({
      orderBy: {
        Size_Sort: "asc",
      },
    });
    const sizeDetail = await prisma.size_De.findMany();
    const code = await prisma.cloth_Design.findMany({
      select: {
        Code: true,
      },
    });
    const data = [brand, category, pattern];
    res
      .status(200)
      .json({ brand, category, pattern, size, sizeDetail, code, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const AddNewDesign = async (req, res) => {
  console.log(req.body);
  const data = req.body.data;
  const img = req.body.img;
  const Size = req.body.size;
  const user = req.user;

  const Size_info_data = [...new Set(Size.map((e) => e.size))];

  try {
    const Design = await prisma.cloth_Design.create({
      data: {
        Code: data.code,
        Design_Name: data.title,
        Product_Description: data.description,
        Front_Img: img[2],
        Back_Img: img[1],
        Front_Thumbnail: `https://storage.googleapis.com/khwantadashboard.appspot.com/Design/front/${data.code}-front_300x450`,
        Back_Thumbnail: img[1],
        Brand_ID: +data.brand,
        Category_ID: +data.category,
        Pattern_ID: +data.pattern,
      },
    });
    const detail = img[0].map(async (e) => {
      const upload = await prisma.design_Detail_img.create({
        data: {
          code: data.code,
          Img_Url: e,
        },
      });
      return upload;
    });
    const Size_info = Size_info_data.map(
      async (e) =>
        await prisma.size_Info.create({
          data: {
            Size_Info_ID: `${data.code}${e}`,
            Size_ID: e,
            code: data.code,
          },
        })
    );
    const Size_detail = Size.map(
      async (e) =>
        await prisma.size_De_Info.create({
          data: {
            Size_De_ID: +e.detail,
            Size_Info_ID: `${data.code}${e.size}`,
            Info: +e.data,
          },
        })
    );
    res.status(200).json({
      Success: "เพิ่มแบบสินค้าเรียนร้อย",
      data: { Design, detail, Size_info, Size_detail, user },
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const GetDesignList = async (req, res) => {
  const user = req.user;

  try {
    const data = await prisma.cloth_Design.findMany({
      select: {
        Code: true,
        Design_Name: true,
        Front_Thumbnail: true,
        Back_Thumbnail: true,
        Brand: true,
        Pattern: true,
      },
    });

    res.status(200).json({ data, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const DelDesign = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const sizeinfo = await prisma.size_De_Info.deleteMany({
      where: {
        Size_Info: {
          code: id,
        },
      },
    });

    const size = await prisma.size_Info.deleteMany({
      where: {
        code: id,
      },
    });
    const detailimg = await prisma.design_Detail_img.deleteMany({
      where: {
        code: id,
      },
    });
    const design = await prisma.cloth_Design.deleteMany({
      where: {
        Code: id,
      },
    });
    res.status(200).json({
      Success: "ลบแบบสินค้าเรียนร้อย",
      data: { sizeinfo, size, detailimg, design, user },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getSingledesign = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const data = await prisma.cloth_Design.findUnique({
      where: {
        Code: id,
      },
      select: {
        Code: true,
        Front_Img: true,
        Back_Img: true,
        Design_Name: true,
        Product_Description: true,
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
        Detail_img: {
          select: {
            Img_Url: true,
          },
        },
        product: {
          select: {
            fabric: true,
            product_id: true,
            price: true,
          },
        },
      },
    });
    res.status(200).json({ data, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
