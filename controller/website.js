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
export const GetSingleProductforWeb = async (req, res) => {
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
