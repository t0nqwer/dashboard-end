import { PrismaClient } from "@prisma/client";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../firebase.js";
import { socketconnect } from "../socket.js";
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
    res
      .status(200)
      .json({ brand, category, pattern, size, sizeDetail, code, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const GetDesignList = async (req, res) => {
  const user = req.user;

  const { search, page } = req.query;
  const limit = 20;
  const numberStartIndex = (+page - 1) * limit;
  const count = await prisma.cloth_Design.count({
    where: {
      OR: [
        {
          Code: {
            contains: search,
          },
        },
        { Design_Name: { contains: search } },
        {
          Brand: {
            DesignBrand_Name: {
              contains: search,
            },
          },
        },
        { Category: { Design_Category_Name: { contains: search } } },
        {
          Pattern: {
            Pattern_Design_Name: {
              contains: search,
            },
          },
        },
        { Product_Description: { contains: search } },
      ],
    },
  });
  const numberPage = count / limit;
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
      where: {
        OR: [
          {
            Code: {
              contains: search,
            },
          },
          { Design_Name: { contains: search } },
          {
            Brand: {
              DesignBrand_Name: {
                contains: search,
              },
            },
          },
          { Category: { Design_Category_Name: { contains: search } } },
          {
            Pattern: {
              Pattern_Design_Name: {
                contains: search,
              },
            },
          },
          { Product_Description: { contains: search } },
        ],
      },
      skip: numberStartIndex,
      take: limit,
    });

    res.status(200).json({ data, user, page: { numberPage } });
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
        Detail_img: {
          select: {
            Img_Url: true,
          },
        },
        product: {
          select: {
            fabric: {
              select: {
                Fabric_ID: true,
                Weaving: true,
                Color: true,
                Pattern: true,
                Type: true,
              },
            },
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

export const AddNewDesign = async (req, res) => {
  const data = req.body.data;
  const img = req.body.img;
  const Size = req.body.size;
  const user = req.user;
  const Size_info_data = [...new Set(Size.map((e) => e.size))];
  try {
    const newDesign = await prisma.$transaction([
      prisma.cloth_Design.create({
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
      }),
      prisma.design_Detail_img.createMany({
        data: img[0].map((e) => ({
          code: data.code,
          Img_Url: e,
        })),
      }),
      prisma.size_Info.createMany({
        data: Size_info_data.map((e) => ({
          Size_Info_ID: `${data.code}${e}`,
          Size_ID: e,
          code: data.code,
        })),
      }),
      prisma.size_De_Info.createMany({
        data: Size.map((p) => ({
          Size_De_Info_ID: `${data.code}${p.size}-${p.detail}`,
          Size_De_ID: +p.detail,
          Size_Info_ID: `${data.code}${p.size}`,
          Info: +p.data,
        })),
      }),
    ]);

    res.status(200).json({
      Success: "เพิ่มแบบสินค้าเรียนร้อย",
      data: { newDesign, user },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const addDesignDetailImg = async (req, res) => {
  const user = req.user;
  const input = req.body;
  try {
    const addphoto = await prisma.design_Detail_img.create({
      data: {
        code: input.code,
        Img_Url: input.url,
      },
    });
    res.status(200).json({ Success: "เพิ่มรูปเรียนร้อย", user, addphoto });
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ message: "Failed to add design detail image", error });
  }
};

export const DelDesign = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const deletedDesign = await prisma.$transaction([
      prisma.stock_Info.deleteMany({
        where: {
          Product_Cloth: {
            code: id,
          },
        },
      }),
      prisma.product_Cloth_Detail.deleteMany({
        where: { Product: { code: id } },
      }),
      prisma.product_Cloth.deleteMany({
        where: {
          code: id,
        },
      }),
      prisma.size_De_Info.deleteMany({
        where: {
          Size_Info: {
            code: id,
          },
        },
      }),
      prisma.size_Info.deleteMany({
        where: {
          code: id,
        },
      }),
      prisma.design_Detail_img.deleteMany({
        where: {
          code: id,
        },
      }),
      prisma.cloth_Design.deleteMany({
        where: {
          Code: id,
        },
      }),
    ]);

    res.status(200).json({
      Success: "ลบแบบสินค้าเรียบร้อย",
      Type: "delete",
      data: { deletedDesign, user },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const deleteDesignDetailImage = async (req, res) => {
  const user = req.user;
  const input = req.body;
  console.log(input);
  try {
    const desertRef = ref(storage, input.url);
    deleteObject(desertRef)
      .then(async () => {
        const deletedDesignDetailImage =
          await prisma.design_Detail_img.deleteMany({
            where: {
              Img_Url: input.url,
            },
          });
        res.status(200).json({
          Success: "ลบรูปเรียบร้อย",
          deletedDesignDetailImage,
          user,
        });
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
      });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to delete design detail image", error });
  }
};

export const updateDesignData = async (req, res, next) => {
  const user = req.user;
  const data = req.body.ProductData;
  const size = req.body.SizeData;
  const { id } = req.params;
  const { RemoveSize, RemoveDetail } = req.body;
  try {
    const arrSizeInfo = RemoveSize?.map((e) => `${id}${e}`);
    await prisma.size_Info.deleteMany({
      where: {
        Size_Info_ID: {
          in: arrSizeInfo,
        },
      },
    });
    const allSize = await prisma.size_Info.findMany({
      where: {
        code: id,
      },
      select: {
        Size_Info_ID: true,
      },
    });
    const arrSizeDeInfo = allSize
      .map((e) => e.Size_Info_ID)
      .flatMap((e) => RemoveDetail.map((d) => `${e}-${d}`));
    await prisma.size_De_Info.deleteMany({
      where: {
        Size_De_Info_ID: {
          in: arrSizeDeInfo,
        },
      },
    });
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const updateDesignSize = async (req, res, next) => {
  const user = req.user;
  const data = req.body.ProductData;
  const size = req.body.SizeData;
  const { id } = req.params;
  try {
    const sizeremove = [...new Set(size.map((e) => e.size))];
    const Checknewsize = await prisma.$transaction(
      sizeremove.map((e) =>
        prisma.size_Info.findUnique({
          where: { Size_Info_ID: `${id}${e}` },
        })
      )
    );
    const newSize = sizeremove.filter(
      (x) => !Checknewsize.map((e) => e?.Size_ID).includes(x)
    );

    const updatedata = await prisma.$transaction([
      ...size.map((e) =>
        prisma.size_Info.upsert({
          where: {
            Size_Info_ID: `${id}${e.size}`,
          },
          update: {},
          create: {
            Size_Info_ID: `${id}${e.size}`,
            Size_ID: e.size,
            code: id,
          },
        })
      ),
      ...size.map((e) =>
        prisma.size_De_Info.upsert({
          where: {
            Size_De_Info_ID: `${data.code}${e.size}-${e.detail}`,
          },
          update: {
            Info: +e.data,
          },
          create: {
            Size_De_Info_ID: `${data.code}${e.size}-${e.detail}`,
            Size_De_ID: +e.detail,
            Size_Info_ID: `${id}${e.size}`,
            Info: +e.data,
          },
        })
      ),
    ]);
    if (newSize.length === 0) {
      res
        .status(200)
        .json({ Success: "แก้ไขสินคั้าเรียบร้อย", user, updatedata });
    } else {
      console.log(newSize);
      req.newSize = newSize;
      next();
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const addNewSize = async (req, res, next) => {
  const user = req.user;
  const data = req.body.ProductData;
  const size = req.body.SizeData;
  const newsize = req.newSize;
  const { id } = req.params;
  try {
    const product = await prisma.product_Cloth.findMany({
      where: {
        code: id,
      },
      select: {
        product_id: true,
        fabric: true,
      },
    });
    console.log(newsize);
    const data = newsize.map((a) => {
      const ea = product.map((e) => {
        return {
          Product_Cloth_Id: e.product_id,
          Size_Info_Id: `${id}${a}`,
          Barcode: `${id.split("t").join("")}${
            e.fabric.Fabric_ID.toString().length === 1
              ? `00${e.fabric.Fabric_ID}`
              : e.fabric.Fabric_ID.toString().length === 2
              ? `0${e.fabric.Fabric_ID}`
              : e.fabric.Fabric_ID
          }${a === "FREESIZE" ? `F` : a}`,
        };
      });
      return ea;
    });
    const addbarcode = await prisma.stock_Info.createMany({
      data: data.flat(),
    });
    console.log(addbarcode);
    next();
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};
export const notifynewsize = async (req, res, next) => {
  const user = req.user;
  const data = req.body.ProductData;
  const size = req.body.SizeData;
  const newsize = req.newSize;
  const { id } = req.params;
  try {
    const newBarcode = await prisma.$transaction(
      newsize.map((e) =>
        prisma.stock_Info.findMany({
          where: {
            Size_Info_Id: `${id}${e}`,
          },
          select: {
            Barcode: true,
            Product: {
              select: {
                Title: true,
                Price: true,
                Product_ID: true,
                Supplier: true,
                product_category: true,
              },
            },
            Product_Cloth: {
              select: {
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
                    Brand: {
                      select: {
                        DesignBrand_Name: true,
                      },
                    },
                    Design_Name: true,
                  },
                },
                price: true,
                product_id: true,
              },
            },
            Size_Info: {
              select: {
                Size: {
                  select: {
                    Size_ID: true,
                    Size_Sort: true,
                  },
                },
              },
            },
          },
        })
      )
    );
    const data2 = newBarcode.flat().map((item) => {
      return {
        barcode: item.Barcode,
        code: item.Product_Cloth.code,
        fabric: `ผ้า${item.Product_Cloth.fabric.Type.name}${
          item.Product_Cloth.fabric.Weaving.weaving_name
        }${
          item.Product_Cloth.fabric.Color.FabricColorTechnique_name === "เคมี"
            ? ""
            : item.Product_Cloth.fabric.Color.FabricColorTechnique_name ===
              "eco-printed"
            ? item.Product_Cloth.fabric.Color.FabricColorTechnique_name
            : `ย้อมสี${item.Product_Cloth.fabric.Color.FabricColorTechnique_name}`
        }${
          item.Product_Cloth.fabric?.Pattern?.FabricPatternName
            ? `${item.Product_Cloth.fabric.Pattern.FabricPatternName}`
            : ""
        }`,
        brand: item.Product_Cloth.design.Brand.DesignBrand_Name,
        name: item.Product_Cloth.design.Design_Name,
        size: item.Size_Info.Size.Size_ID,
        cloth: true,
        price: +item.Product_Cloth.price,
        sort: item.Size_Info.Size.Size_Sort,
      };
    });
    socketconnect.emit("addSize", {
      data: data2,
    });

    res.status(200).json({ Success: "แก้ไขสินคั้าเรียบร้อย", user });
  } catch (error) {}
};
