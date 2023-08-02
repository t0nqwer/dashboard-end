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
        created: true,
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
      orderBy: { created: "desc" },
    });
    const Cloth = ClothProduct.map((e) => {
      return {
        Id: e.product_id,
        code: e.code,
        price: e.price,
        create: e.created,
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
    res.status(400).json({ error: error.message });
  }
};
export const getQueryData = async (req, res) => {
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
    res.status(200).json({ code: NewCode });
  } catch (error) {
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
    const fabric = {
      ...data.fabric,
      name:
        data.fabric.Color.FabricColorTechnique_ID !== 1
          ? `ผ้า${data.fabric.Type.name}${
              data.fabric.Weaving.weaving_name
            }ย้อมสี${data.fabric.Color.FabricColorTechnique_name}${
              data?.fabric?.Pattern?.FabricPatternName
                ? data?.fabric?.Pattern?.FabricPatternName
                : ""
            }`
          : `ผ้า${data.fabric.Type.name}${data.fabric.Weaving.weaving_name}${
              data?.fabric?.Pattern?.FabricPatternName
                ? data?.fabric?.Pattern?.FabricPatternName
                : ""
            }`,
    };
    const resdata = { ...data, fabric };
    res.status(200).json(resdata);
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
export const ChangeDesignName = async (req, res) => {
  const { code, name } = req.body;
  try {
    await prisma.cloth_Design.update({
      where: {
        Code: code,
      },
      data: {
        Design_Name: name,
      },
    });
    res.status(200).json("เปลี่ยนชื่อเรียบร้อย");
  } catch (error) {
    res.status(400).json({ error: "ไม่สามารถเปลี่ยนชื่อได้" });
  }
};

export const updateDetailPhotoWeb = async (req, res) => {
  const user = req.user;
  const { url, id } = req.body;

  try {
    const addphoto = await prisma.product_Cloth_Detail.create({
      data: {
        Product_ID: id,
        Img_Url: url,
      },
    });
    if (addphoto) {
      const product = await prisma.product_Cloth.findUnique({
        where: {
          product_id: id,
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
        },
      });

      res.status(200).json(product);
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: "ไม่สามารถเพิ่มรูปได้" });
  }
};
export const getdetailphoto = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await prisma.product_Cloth_Detail.findMany({
      where: {
        Product_ID: +id,
      },
      select: {
        Img_Url: true,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getSizeDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await prisma.cloth_Design.findUnique({
      where: {
        Code: id,
      },
      select: {
        Size: {
          select: {
            Size_ID: true,
            Size_De_Info: {
              select: {
                Size_De_Info_ID: true,
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
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
