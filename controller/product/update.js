import { PrismaClient } from "@prisma/client";
import { socketconnect } from "../../socket.js";
const prisma = new PrismaClient();
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../firebase.js";

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
      if (addphoto) {
        const product = await prisma.product_Cloth.findUnique({
          where: {
            product_id: +input.Product_ID,
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

        res
          .status(200)
          .json({ Res: "เพิ่มรูปเรียนร้อย", user, addphoto, product });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: "ไม่สามารถเพิ่มรูปได้" });
  }
};

export const updateWebStatus = async (req, res) => {
  const user = req.user;
  console.log(req.body);
  try {
    const update = await prisma.product_Cloth.update({
      where: { product_id: +req.body.id },
      data: { Forweb: req.body.ForWeb, IsHero: req.body.IsHero },
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

    res.status(200).json({ update, user, Success: "อัพเดทสถานะเรียนร้อย" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: "" });
  }
};
export const updatePriceCloth = async (req, res) => {
  const user = req.user;
  console.log(req.body);
  try {
    const update = await prisma.product_Cloth.update({
      where: { product_id: +req.body.id },
      data: { price: +req.body.price },
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
        Stock_Info: true,
        Product_Cloth_Detail: {
          select: {
            Img_Url: true,
          },
        },
      },
    });

    socketconnect.emit("price", {
      barcode: update.Stock_Info.map((e) => e.Barcode),
      price: update.price,
    });

    res.status(200).json({ product: update, Res: "อัพเดทราคาเรียนร้อย" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: "" });
  }
};
