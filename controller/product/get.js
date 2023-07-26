import { PrismaClient } from "@prisma/client";
import { socketconnect } from "../../socket.js";
const prisma = new PrismaClient();
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../firebase.js";

export const productList = async (req, res) => {
  const user = req.user;
  const { search, page } = req.query;
  const limit = 20;
  const numberStartIndex = (+page - 1) * limit;

  try {
    const NonClothProductcount = await prisma.product.count({
      where: {
        OR: [
          {
            Title: {
              contains: search,
            },
          },
          {
            Description: {
              contains: search,
            },
          },
          {
            product_category: {
              Product_Category_Name: {
                contains: search,
              },
            },
          },
          {
            Supplier: {
              Name: {
                contains: search,
              },
            },
          },
        ],
      },
    });

    const numberPage = NonClothProductcount / limit;

    const NonClothProduct = await prisma.product.findMany({
      select: {
        Product_ID: true,
        Title: true,
        Price: true,
        Front_Thumbnail: true,
        product_category: true,
        Supplier: true,
      },
      where: {
        OR: [
          {
            Title: {
              contains: search,
            },
          },
          {
            Description: {
              contains: search,
            },
          },
          {
            product_category: {
              Product_Category_Name: {
                contains: search,
              },
            },
          },
          {
            Supplier: {
              Name: {
                contains: search,
              },
            },
          },
        ],
      },
      skip: numberStartIndex,
      take: limit,
    });

    res.status(200).json({ NonClothProduct, user, page: { numberPage } });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const productClothList = async (req, res) => {
  const start = Date.now();
  const user = req.user;
  const { search, page, query } = req.query;
  const limit = 20;
  const numberStartIndex = (+page - 1) * limit;

  try {
    const countCloth = await prisma.product_Cloth.count({
      where: {
        code: { contains: query },
        OR: [
          {
            code: { contains: search },
          },
          {
            fabric: {
              Type: {
                name: {
                  contains: search,
                },
              },
            },
          },
          {
            fabric: {
              Color: {
                FabricColorTechnique_name: {
                  contains: search,
                },
              },
            },
          },
          {
            fabric: {
              Pattern: {
                FabricPatternName: {
                  contains: search,
                },
              },
            },
          },
          {
            fabric: {
              Weaving: {
                weaving_name: {
                  contains: search,
                },
              },
            },
          },
          {
            design: { Design_Name: { contains: search } },
          },
          {
            design: {
              Category: { Design_Category_Name: { contains: search } },
            },
          },
          {
            design: {
              Brand: {
                DesignBrand_Name: {
                  contains: search,
                },
              },
            },
          },
          {
            design: {
              Pattern: {
                Pattern_Design_Name: {
                  contains: search,
                },
              },
            },
          },
          {
            description: {
              contains: search,
            },
          },
        ],
      },
    });
    const numberPage = countCloth / limit;
    const ClothProduct = await prisma.product_Cloth.findMany({
      select: {
        product_id: true,
        code: true,
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
        design: true,
        Front_Thumbnail: true,
        price: true,
      },
      where: {
        code: { contains: query },
        OR: [
          {
            code: { contains: search },
          },
          {
            fabric: {
              Type: {
                name: {
                  contains: search,
                },
              },
            },
          },
          {
            fabric: {
              Color: {
                FabricColorTechnique_name: {
                  contains: search,
                },
              },
            },
          },
          {
            fabric: {
              Pattern: {
                FabricPatternName: {
                  contains: search,
                },
              },
            },
          },
          {
            fabric: {
              Weaving: {
                weaving_name: {
                  contains: search,
                },
              },
            },
          },
          {
            design: { Design_Name: { contains: search } },
          },
          {
            design: {
              Category: { Design_Category_Name: { contains: search } },
            },
          },
          {
            design: {
              Brand: {
                DesignBrand_Name: {
                  contains: search,
                },
              },
            },
          },
          {
            design: {
              Pattern: {
                Pattern_Design_Name: {
                  contains: search,
                },
              },
            },
          },
          {
            description: {
              contains: search,
            },
          },
        ],
      },
      skip: numberStartIndex,
      take: limit,
      orderBy: {
        product_id: "desc",
      },
    });

    const Cloth = ClothProduct.map((e) => {
      return {
        Id: e.product_id,
        code: e.code,
        price: e.price,
        designname: e.design.Design_Name,
        Front_Thumbnail: e.Front_Thumbnail,
        fabric:
          e.fabric.Color.FabricColorTechnique_ID !== 1
            ? `ผ้า${e.fabric.Type.name}${e.fabric.Weaving.weaving_name}ย้อมสี${
                e.fabric.Color.FabricColorTechnique_name
              }${
                e?.fabric?.Pattern?.FabricPatternName
                  ? e?.fabric?.Pattern?.FabricPatternName
                  : ""
              }`
            : `ผ้า${e.fabric.Type.name}${e.fabric.Weaving.weaving_name}${
                e?.fabric?.Pattern?.FabricPatternName
                  ? e?.fabric?.Pattern?.FabricPatternName
                  : ""
              }`,
      };
    });

    res.status(200).json({ Cloth, user, page: numberPage });
    const end = Date.now();
    console.log(`Execution time: ${end - start} ms`);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const getExampleList = async (req, res) => {
  const user = req.user;
  const { search, page, query } = req.query;
  const limit = 20;
  const numberStartIndex = (+page - 1) * limit;

  try {
    const countCloth = await prisma.examplesProduct.count({
      where: {
        OR: [
          { name: { contains: search } },
          {
            categoty: {
              Design_Category_Name: { contains: search },
            },
          },
        ],
      },
    });
    const numberPage = countCloth / limit;
    const ClothProduct = await prisma.examplesProduct.findMany({
      select: {
        id: true,
        name: true,
        categoty: true,
        Price: true,
        Front_img: true,
        Stock_Info: true,
      },
      where: {
        OR: [
          { name: { contains: search } },
          {
            categoty: {
              Design_Category_Name: { contains: search },
            },
          },
        ],
      },
      skip: numberStartIndex,
      take: limit,
    });

    res.status(200).json({ ClothProduct, user, page: numberPage });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const getQueryData = async (req, res) => {
  const user = req.user;
  try {
    const code = await prisma.cloth_Design.findMany({
      select: {
        Code: true,
      },
    });
    const NewCode = [
      ...new Set(
        code.map((e) => {
          const char1 = e.Code.charAt(0);
          const char2 = e.Code.charAt(1);
          if (+char2 === 0) return char1;
          if (+char2) return char1;
          else return `${char1}${char2}`;
        })
      ),
    ];
    res.status(200).json({ code: NewCode, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const getAddCloth = async (req, res) => {
  const user = req.user;

  try {
    const design = await prisma.cloth_Design.findMany();
    const fabric = await prisma.fabric.findMany({
      select: {
        Weaving: true,
        Pattern: true,
        Color: true,
        Fabric_ID: true,
        Type: true,
      },
    });
    const product = await prisma.product_Cloth.findMany();

    res.status(200).json({ design, fabric, product, user });
  } catch (error) {
    res
      .status(400)
      .json({ error: "ไม่สามารถเรียกดูข้อมูลได้ โปรดลองอีกครั้ง" });
  }
};
export const getAddKhwanta = async (req, res) => {
  const user = req.user;

  try {
    const category = await prisma.product_Category.findMany();
    const product = await prisma.product.findMany();

    res.status(200).json({ category, product, user });
  } catch (error) {
    res
      .status(400)
      .json({ error: "ไม่สามารถเรียกดูข้อมูลได้ โปรดลองอีกครั้ง" });
  }
};
export const getAddImport = async (req, res) => {
  const user = req.user;

  try {
    const supplier = await prisma.product_Supplier.findMany({
      where: {
        Name: {
          not: "Khwanta",
        },
      },
    });
    const category = await prisma.product_Category.findMany();
    const product = await prisma.product.findMany();

    res.status(200).json({ supplier, category, product, user });
  } catch (error) {
    res
      .status(400)
      .json({ error: "ไม่สามารถเรียกดูข้อมูลได้ โปรดลองอีกครั้ง" });
  }
};

export const getSingleProduct = async (req, res) => {
  const user = req.user;

  try {
    const product = await prisma.product.findUnique({
      where: {
        Product_ID: +req.params.id,
      },
      select: {
        Product_ID: true,
        Title: true,
        Price: true,
        Front_img: true,
        Back_img: true,
        Supplier: true,
        Description: true,
        product_category: true,
        Product_Detail: {
          select: {
            Img_Url: true,
          },
        },
        Stock_Info: true,
      },
    });

    res.status(200).json({ product, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getSingleCloth = async (req, res) => {
  const user = req.user;
  console.log(+req.params.id);
  try {
    const product = await prisma.product_Cloth.findUnique({
      where: {
        product_id: +req.params.id,
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

    res.status(200).json({ product, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAddExample = async (req, res) => {
  const user = req.user;
  try {
    const type = await prisma.design_Category.findMany();
    res.status(200).json({ type, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const CheckDuplicateExample = async (req, res) => {
  const name = req.params.name;
  console.log(name);
  try {
    const checkduplicatexample = await prisma.examplesProduct.findMany({
      where: {
        name: name,
      },
    });
    if (checkduplicatexample.length > 0) {
      throw Error("มีสินค้าในระบบแล้ว");
    } else {
      res.status(200).json("true");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getSingleExample = async (req, res) => {
  const user = req.user;
  console.log(+req.params.id);
  try {
    const product = await prisma.examplesProduct.findUnique({
      where: {
        id: +req.params.id,
      },
      select: {
        id: true,
        name: true,
        categoty: true,
        Price: true,
        Front_img: true,
        Stock_Info: true,
        Back_img: true,
        ExamplesProductDetailImage: {
          select: {
            Url: true,
          },
        },
        Stock_Info: true,
      },
    });
    res.status(200).json({ product, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
