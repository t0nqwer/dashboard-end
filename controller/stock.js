import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const generateBarcode = async (req, res) => {
  try {
    const getclothpruduct = await prisma.product_Cloth.findMany({
      select: {
        product_id: true,
        design: {
          select: {
            Size: true,
          },
        },
        fabric: true,
      },
    });

    const list = getclothpruduct.map((item) => {
      const size = item.design.Size.map((Size) => {
        return {
          Product_Cloth_Id: item.product_id,
          Size_Info_Id: Size.Size_Info_ID,
          Barcode: `${Size.code.split("t").join("")}${
            item.fabric.Fabric_ID.toString().length === 1
              ? `00${item.fabric.Fabric_ID}`
              : item.fabric.Fabric_ID.toString().length === 2
              ? `0${item.fabric.Fabric_ID}`
              : item.fabric.Fabric_ID
          }${Size.Size_ID === "FREESIZE" ? `F` : Size.Size_ID}`,
        };
      });
      return size;
    });

    const product = await prisma.product.findMany({
      select: {
        Product_ID: true,
        Product_Category_ID: true,
        Product_Supplier_ID: true,
      },
    });
    const nonclothproductlist = product.map((item) => {
      return {
        Barcode: `OT${
          item.Product_ID.toString().length === 1
            ? `00${item.Product_ID}`
            : item.Product_ID.toString().length === 2
            ? `0${item.Product_ID}`
            : item.Product_ID
        }${
          item.Product_Category_ID.toString().length === 1
            ? `0${item.Product_Category_ID}`
            : item.Product_Category_ID
        }${
          item.Product_Supplier_ID.toString().length === 1
            ? `0${item.Product_Supplier_ID}`
            : item.Product_Supplier_ID
        }`,
        Product_Id: item.Product_ID,
      };
    });
    const data = list.flat().concat(nonclothproductlist);
    const createBarcode = await prisma.Stock_Info.createMany({
      data,
      skipDuplicates: true,
    });
    const count = await prisma.Stock_Info.count();

    res.status(201).json({
      createBarcode,
      count,
      cc: nonclothproductlist.length,
      cd: list.flat().length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDataForStock = async (req, res) => {
  try {
    const getclothpruduct = await prisma.stock_Info.findMany({
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
            Size_ID: true,
          },
        },
      },
    });
    const data = getclothpruduct.map((item) => {
      return {
        barcode: item.Barcode,
        code: "",
        name: "",
        price: "",
        fabric: "",
        brand: "",
      };
    });
    res.status(200).json(getclothpruduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
