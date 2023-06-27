import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../firebase.js";

export const GetProductforWeb = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  try {
    const data = await prisma.product_Cloth.findMany({
      where: {
        Forweb: true,
      },
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
        design: {
          select: {
            Design_Name: true,
            Brand: true,
            Category: true,
            Pattern: true,
          },
        },
        Front_Thumbnail: true,
        Front_img: true,
        Back_img: true,
        price: true,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};
export const GetProduct = async (req, res) => {
  const { search, page, query } = req.query;
  const arr = req.body;
  console.log(arr);
  const limit = 30;
  const numberStartIndex = (+page - 1) * limit;
  try {
    const countCloth = await prisma.product_Cloth.count({
      where: {
        product_id: {
          notIn: arr,
        },
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
        product_id: {
          notIn: arr,
        },
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
    res.status(200).json({ Cloth, page: numberPage });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
export const GetSingleProductforWeb = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await prisma.product_Cloth.findUnique({
      where: { product_id: +id },
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
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const GetHero = async (req, res) => {
  try {
    const data = await prisma.product_Cloth.findMany({
      where: {
        Forweb: true,
        IsHero: true,
      },
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
        design: {
          select: {
            Design_Name: true,
            Brand: true,
            Category: true,
            Pattern: true,
          },
        },
        Front_Thumbnail: true,
        Front_img: true,
        Back_img: true,
        price: true,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};
