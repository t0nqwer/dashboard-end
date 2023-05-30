import { PrismaClient } from "@prisma/client";
import { socketconnect } from "../../socket.js";
const prisma = new PrismaClient();
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../firebase.js";

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
          prisma.product_Cloth_Detail
            .deleteMany({
              where: {
                Img_Url: input.url,
              },
            })
            .then(async () => {
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
              res.status(200).json({
                Res: "ลบรูปเรียบร้อย",
                product,
                user,
              });
            });
        }
        if (input.type === "Example") {
          prisma.examplesProductDetailImage
            .deleteMany({
              where: {
                Url: input.url,
              },
            })
            .then(async () => {
              const product = await prisma.examplesProduct.findUnique({
                where: {
                  id: +input.Product_ID,
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
              res.status(200).json({
                Res: "ลบรูปเรียบร้อย",
                product,
                user,
              });
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
