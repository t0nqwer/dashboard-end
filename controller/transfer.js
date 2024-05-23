import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const transferDesign = async (req, res) => {
  try {
    const data = await prisma.cloth_Design.findMany({
      select: {
        Code: true,
        Design_Name: true,
        Front_Thumbnail: true,
        Back_Thumbnail: true,
        Brand: true,
        Category: true,
        Pattern: true,
        Front_Img: true,
        Back_Img: true,
        Detail_img: true,
        Size: {
          select: {
            Size_ID: true,
            Size_De_Info: {
              select: {
                Info: true,
                Detail: true,
              },
            },
          },
        },
      },
    });
    const convertdata = data.map((item) => ({
      code: item.Code,
      name: item.Design_Name,
      brand: item.Brand.DesignBrand_Name,
      category: item.Category.Design_Category_Name,
      pattern: item.Pattern.Pattern_Design_Name,
      FrontImage: item.Front_Img,
      BackImage: item.Back_Img,
      DetailImage: item.Detail_img.map((item) => item.Img_Url),
      size: item.Size.map((item) => ({
        size: item.Size_ID,
        details: item.Size_De_Info.map((e) => ({
          amount: e.Info,
          detail: e.Detail.Size_De_Name,
        })),
      })),
    }));
    res.json(convertdata);
  } catch (error) {
    console.log(error);
  }
};

export const transferProduct = async (req, res) => {
  try {
    const ClothProduct = await prisma.product_Cloth.findMany({
      select: {
        product_id: true,
        code: true,
        fabric_id: true,
        description: true,
        Front_img: true,
        Back_img: true,
        price: true,
        Product_Cloth_Detail: true,
        Stock_Info: {
          select: {
            Barcode: true,
            Size_Info: true,
          },
        },
      },
    });
    const count = await prisma.stock_Info.count({
      where: {
        Product_Cloth_Id: { not: null },
      },
    });
    console.log(count);
    const convertdata = ClothProduct.map((item) => ({
      code: item.code,
      fabric: item.fabric_id,
      description: item.description,
      frontImage: item.Front_img,
      backImage: item.Back_img,
      DetailImage: item.Product_Cloth_Detail.map((item) => item.Img_Url),
      price: item.price,
      ClothId: item.product_id,
      category: "เสื้อผ้า",
      supplier: "Khwanta",
      barcode: item.Stock_Info.map((item) => ({
        barcode: item.Barcode,
        size: item.Size_Info.Size_ID,
      })),
    }));
    res.json(convertdata);
  } catch (error) {}
};

export const transferOtherProduct = async (req, res) => {
  try {
    const data = await prisma.product.findMany({
      select: {
        Product_ID: true,
        Title: true,
        Price: true,
        Front_img: true,
        Back_img: true,
        Description: true,
        product_category: true,
        Supplier: true,
        Product_Detail: true,
        Stock_Info: {
          select: {
            Barcode: true,
          },
        },
      },
    });
    const convertdata = data.map((item) => ({
      otherId: item.Product_ID,
      name: item.Title,
      price: item.Price,
      frontImage: item.Front_img,
      backImage: item.Back_img,
      description: item.Description,
      category: item.product_category.Product_Category_Name,
      supplier: item.Supplier.Name,
      DetailImage: item.Product_Detail.map((item) => item.Img_Url),
      barcode: item.Stock_Info.map((item) => item.Barcode)[0],
    }));
    console.log(convertdata.length);
    res.json(convertdata);
  } catch (error) {
    console.log(error);
  }
};
