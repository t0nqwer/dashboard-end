import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const generateBarcode = async (req, res) => {
  await prisma.stock_Info.deleteMany();
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
            Size: {
              select: {
                Size_ID: true,
                Size_Sort: true,
              },
            },
          },
        },
      },
    });
    const data = getclothpruduct.map((item) => {
      if (item.Product)
        return {
          barcode: item.Barcode,
          code: "",
          name: item.Product.Title,
          price: item.Product.Price,
          fabric: "",
          brand: item.Product.Supplier.Name,
          size: "",
          cloth: false,
        };
      if (item.Product_Cloth)
        return {
          barcode: item.Barcode,
          code: item.Product_Cloth.code,
          fabric: `ผ้า${item.Product_Cloth.fabric.Type.name}${
            item.Product_Cloth.fabric.Weaving.weaving_name
          }${
            item.Product_Cloth.fabric.Color.FabricColorTechnique_name === "เคมี"
              ? ""
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
          price: item.Product_Cloth.price,
          sort: item.Size_Info.Size.Size_Sort,
        };
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStock = async (req, res) => {
  try {
    await prisma.stock_Info.deleteMany();
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function compareNumbers(a, b) {
  return a - b;
}
export const UpdateStockbarcode = async (req, res) => {
  try {
    const getclothpruduct = await prisma.product_Cloth.findMany({
      select: {
        product_id: true,
      },
    });
    const clothpruductlist = getclothpruduct
      .map((item) => item.product_id)
      .sort(compareNumbers);
    const getcurrentbarcode = await prisma.stock_Info.findMany({
      select: { Product_Id: true, Product_Cloth_Id: true },
    });
    const currentclothbarcode = [
      ...new Set(
        getcurrentbarcode
          .map((item) => {
            if (item.Product_Cloth_Id) return item.Product_Cloth_Id;
          })
          .filter((item) => item !== null)
      ),
    ];

    const addcloth = clothpruductlist.filter(
      (x) => !currentclothbarcode.includes(x)
    );
    const deletecloth = currentclothbarcode
      .sort(compareNumbers)
      .filter((x) => x === 359);
    const getAddCloth = await prisma.$transaction(
      addcloth.map((e) =>
        prisma.product_Cloth.findUnique({
          where: { product_id: e },
          select: {
            product_id: true,
            design: {
              select: {
                Size: true,
              },
            },
            fabric: true,
          },
        })
      )
    );
    const list = getAddCloth
      .map((item) => {
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
      })
      .flat();

    const createbarcode = await prisma.Stock_Info.createMany({
      data: list,
      skipDuplicates: true,
    });
    console.log(
      `delete ${currentclothbarcode.length} barcode add ${createbarcode.count} barcode`,
      addcloth,
      deletecloth,
      list,
      createbarcode
    );
  } catch (error) {
    console.log(error);
  }
};

setInterval(UpdateStockbarcode, 60000);
