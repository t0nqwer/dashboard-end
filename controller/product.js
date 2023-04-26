import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../firebase.js";
export const addSupplier = async (req, res) => {
  const input = req.body;
  const user = req.user;

  try {
    const [check] = await prisma.product_Supplier.findMany({
      where: {
        Name: input.name,
      },
    });
    if (check) throw Error("มีซับพลายเออร์นี้ในระะบบแล้ว");
    const data = await prisma.product_Supplier.create({
      data: {
        Name: input.name,
        Description: input.descript,
      },
    });
    res.status(200).json({
      Success: "เพิ่มซับพลายเออร์เรียบร้อย",
      data: data,
      user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const addKhwanta = async (req, res) => {
  const data = req.body.data;
  const img = req.body.img;
  const user = req.user;
  console.log(data);
  try {
    const product = await prisma.product.create({
      data: {
        Title: data.name,
        Price: data.price,
        Front_img: img[2],
        Back_img: img[1],
        Front_Thumbnail: `https://storage.googleapis.com/khwantadashboard.appspot.com/Product/front/${data.name}front_300x450`,
        Back_Thumbnail: img[1],
        Product_Category_ID: +data.category_id,
        Product_Supplier_ID: 1,
        Description: data.descript,
      },
    });

    const detail = img[0].map(async (e) => {
      const upload = await prisma.product_Detail.create({
        data: {
          Img_Url: e,
          Product_ID: product.Product_ID,
        },
      });
      return upload;
    });
    res.status(200).json({
      Success: "เพิ่มสินค้าเรียบร้อย",
      data: { product, detail },
      user,
    });
  } catch (error) {
    res.status(400).json({ error: "ไม่สามารถเพิ่มได้" });
  }
};
export const addImport = async (req, res) => {
  const data = req.body.data;
  const img = req.body.img;
  const user = req.user;

  try {
    const product = await prisma.product.create({
      data: {
        Title: data.name,
        Price: data.price,
        Front_img: img[2],
        Back_img: img[1],
        Front_Thumbnail: `https://storage.googleapis.com/khwantadashboard.appspot.com/Product/front/${data.name}front_300x450`,
        Back_Thumbnail: img[1],
        Product_Category_ID: +data.category_id,
        Product_Supplier_ID: +data.supplier_id,
        Description: data.descript,
      },
    });

    const detail = img[0].map(async (e) => {
      const upload = await prisma.product_Detail.create({
        data: {
          Img_Url: e,
          Product_ID: product.Product_ID,
        },
      });
      return upload;
    });
    res.status(200).json({
      Success: "เพิ่มสินค้าเรียบร้อย",
      data: { product, detail },
      user,
    });
  } catch (error) {
    res.status(400).json({ error: "ไม่สามารถเพิ่มได้" });
  }
};
export const addCloth = async (req, res) => {
  const data = req.body.data;
  const img = req.body.img;
  const user = req.user;

  try {
    const product = await prisma.product_Cloth.create({
      data: {
        code: data.code,
        fabric_id: +data.fabric_id,
        description: data.descript,
        Front_img: img[2],
        Back_img: img[1],
        Front_Thumbnail: `https://storage.googleapis.com/khwantadashboard.appspot.com/Product/front/${data.code}${data.fabric_id}front_300x450`,
        price: +data.price,
      },
    });

    const detail = img[0].map(async (e) => {
      const upload = await prisma.Product_Cloth_Detail.create({
        data: {
          Img_Url: e,
          Product_ID: product.product_id,
        },
      });
      return upload;
    });
    res.status(200).json({
      Success: "เพิ่มสินค้าเรียบร้อย",
      data: { product, detail },
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
export const productList = async (req, res) => {
  const user = req.user;
  const { search, page } = req.query;
  const limit = 20;
  const numberStartIndex = (+page - 1) * limit;

  try {
    const countCloth = await prisma.product_Cloth.count({
      where: {
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

    const numberPage = (countCloth + NonClothProductcount) / limit;
    const clothindex = numberStartIndex < countCloth ? numberStartIndex : 0;
    const clothtake =
      countCloth > numberStartIndex
        ? countCloth - numberStartIndex > 20
          ? 20
          : countCloth - numberStartIndex
        : 0;
    const NonClothindex =
      countCloth > numberStartIndex ? 0 : numberStartIndex - countCloth + 1;
    const NonClothtake = limit - clothtake;

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
      skip: NonClothindex,
      take: NonClothtake,
    });
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
      skip: clothindex,
      take: clothtake,
    });
    console.log(ClothProduct);
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
    console.log(Cloth);

    res
      .status(200)
      .json({ NonClothProduct, Cloth, user, page: { numberPage } });
  } catch (error) {
    console.log(error.message);
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

    res.status(200).json({ product, user });
  } catch (error) {
    res.status(400).json({ error: "" });
  }
};

export const deleteDetailPhoto = async (req, res) => {
  const user = req.user;
  const input = req.body;
  console.log(input);
  try {
    const desertRef = ref(storage, input.url);

    deleteObject(desertRef)
      .then(async () => {
        if (input.type === "Product") {
          await prisma.product_Detail.deleteMany({
            where: {
              Img_Url: input.url,
            },
          });
          res.status(200).json({
            Success: "ลบรูปเรียบร้อย",
            user,
          });
        }
        if (input.type === "Cloth") {
          await prisma.product_Cloth_Detail.deleteMany({
            where: {
              Img_Url: input.url,
            },
          });
          res.status(200).json({
            Success: "ลบรูปเรียบร้อย",
            user,
          });
        }
      })
      .catch((error) => {
        console.log(error.message);
        res.status(400).json({ error: "ไม่สามารถลบรูปได้" });
      });
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ error: "ไม่สามารถเรียกดูข้อมูลได้ โปรดลองอีกครั้ง" });
  }
};

export const updateDetailPhoto = async (req, res) => {
  const user = req.user;
  const input = req.body;
  console.log(input);
  try {
    if (input.type === "Product") {
      const addphoto = await prisma.product_Detail.create({
        data: {
          Product_ID: input.Product_ID,
          Img_Url: input.url,
        },
      });
      res.status(200).json({ Success: "เพิ่มรูปเรียนร้อย", user, addphoto });
    }
    if (input.type === "Cloth") {
      const addphoto = await prisma.product_Cloth_Detail.create({
        data: {
          Product_ID: +input.Product_ID,
          Img_Url: input.url,
        },
      });

      res.status(200).json({ Success: "เพิ่มรูปเรียนร้อย", user, addphoto });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: "ไม่สามารถเพิ่มรูปได้" });
  }
};

export const deletePhoto = async (req, res) => {
  const user = req.user;
  const input = req.body;
  console.log(input);
  try {
    const desertRef = ref(storage, input.url);

    deleteObject(desertRef)
      .then(async () => {
        if (input.type === "Product") {
          await prisma.product_Detail.deleteMany({
            where: {
              Img_Url: input.url,
            },
          });
          res.status(200).json({
            Success: "ลบรูปเรียบร้อย",
            user,
          });
        }
        if (input.type === "Cloth") {
          await prisma.product_Cloth_Detail.deleteMany({
            where: {
              Img_Url: input.url,
            },
          });
          res.status(200).json({
            Success: "ลบรูปเรียบร้อย",
            user,
          });
        }
      })
      .catch((error) => {
        console.log(error.message);
        res.status(400).json({ error: "ไม่สามารถลบรูปได้" });
      });
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ error: "ไม่สามารถเรียกดูข้อมูลได้ โปรดลองอีกครั้ง" });
  }
};
