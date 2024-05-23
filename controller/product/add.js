import { PrismaClient } from "@prisma/client";
import { socketconnect } from "../../socket.js";
const prisma = new PrismaClient();
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../firebase.js";

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
    const check = await prisma.product.findMany({
      where: {
        Title: data.name,
      },
    });
    if (check.length > 0) throw Error("มีสินค้าในระบบแล้ว.");
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
        Product_Detail: {
          create: [...img[0].map((e) => ({ Img_Url: e }))],
        },
      },
    });

    const createdata = {
      Barcode: `OT${
        product.Product_ID.toString().length === 1
          ? `00${product.Product_ID}`
          : product.Product_ID.toString().length === 2
          ? `0${product.Product_ID}`
          : product.Product_ID
      }${
        product.Product_Category_ID.toString().length === 1
          ? `0${product.Product_Category_ID}`
          : product.Product_Category_ID
      }${
        product.Product_Supplier_ID.toString().length === 1
          ? `0${product.Product_Supplier_ID}`
          : product.Product_Supplier_ID
      }`,
      Product_Id: product.Product_ID,
    };
    const createBarcode = await prisma.stock_Info.create({
      data: createdata,
    });
    const list = {
      barcode: createdata.Barcode,
      code: "",
      fabric: "",
      brand: "Khwanta",
      name: product.Title,
      size: "",
      cloth: false,
      price: +product.Price,
    };
    socketconnect.emit("addProduct", {
      data: [list],
    });
    res.status(200).json({
      Success: "เพิ่มสินค้าเรียบร้อย",
      data: { product },
      user,
      createBarcode,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: "ไม่สามารถเพิ่มได้" });
  }
};
export const addImport = async (req, res) => {
  const data = req.body.data;
  const img = req.body.img;
  const user = req.user;

  try {
    const check = await prisma.product.findMany({
      where: {
        Title: data.name,
      },
    });

    if (check.length > 0) throw Error("มีสินค้าในระบบแล้ว.");
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
        Product_Detail: {
          create: [...img[0].map((e) => ({ Img_Url: e }))],
        },
      },
    });

    const createdata = {
      Barcode: `OT${
        product.Product_ID.toString().length === 1
          ? `00${product.Product_ID}`
          : product.Product_ID.toString().length === 2
          ? `0${product.Product_ID}`
          : product.Product_ID
      }${
        product.Product_Category_ID.toString().length === 1
          ? `0${product.Product_Category_ID}`
          : product.Product_Category_ID
      }${
        product.Product_Supplier_ID.toString().length === 1
          ? `0${product.Product_Supplier_ID}`
          : product.Product_Supplier_ID
      }`,
      Product_Id: product.Product_ID,
    };
    const createBarcode = await prisma.stock_Info.create({
      data: createdata,
    });
    const list = {
      barcode: createdata.Barcode,
      code: "",
      fabric: "",
      brand: "Khwanta",
      name: product.Title,
      size: "",
      cloth: false,
      price: +product.Price,
    };
    socketconnect.emit("addProduct", {
      data: [list],
    });
    res.status(200).json({
      Success: "เพิ่มสินค้าเรียบร้อย",
      data: { product },
      user,
      createBarcode,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: "ไม่สามารถเพิ่มได้" });
  }
};
export const addCloth = async (req, res, next) => {
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

    const detail = img[0].map(async (e) => {
      const upload = await prisma.Product_Cloth_Detail.create({
        data: {
          Img_Url: e,
          Product_ID: product.product_id,
        },
      });
      return upload;
    });

    req.product = product;
    req.detail = detail;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
export const createBarcode = async (req, res, next) => {
  const product = req.product;
  const detail = req.detail;
  const data = req.body.data;
  const img = req.body.img;
  const user = req.user;
  try {
    console.log(product.design.Size);
    const list = product.design.Size.map((Size) => {
      return {
        Product_Cloth_Id: product.product_id,
        Size_Info_Id: Size.Size_Info_ID,
        Barcode: `${Size.code.split("t").join("")}${
          product.fabric.Fabric_ID.toString().length === 1
            ? `00${product.fabric.Fabric_ID}`
            : product.fabric.Fabric_ID.toString().length === 2
            ? `0${product.fabric.Fabric_ID}`
            : product.fabric.Fabric_ID
        }${Size.Size_ID === "FREESIZE" ? `F` : Size.Size_ID}`,
      };
    });
    const date = await prisma.stock_Info.createMany({
      data: list,
    });

    req.date = date;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
export const notifynewPriduct = async (req, res) => {
  try {
    const product = req.product;
    const detail = req.detail;
    const data = req.body.data;
    const img = req.body.img;
    const user = req.user;
    const notifydata = await prisma.stock_Info.findMany({
      where: {
        Product_Cloth_Id: product.product_id,
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
    });

    const list = notifydata.map((item) => {
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
    socketconnect.emit("addProduct", {
      data: list,
    });
    console.log(list);
    res.status(200).json({
      Success: "เพิ่มสินค้าเรียบร้อย",
      data: { product, detail },
      user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const AddExampleProductCloth = async (req, res) => {
  console.log(req.body);
  const info = req.body.info;
  const img = req.body.img;
  try {
    const product = await prisma.examplesProduct.create({
      data: {
        name: info.name,
        category_id: +info.category_id,
        Price: +info.price,
        Description: info.descript,
        Front_img: img[2],
        Back_img: img[1],
        Front_Small: `https://storage.googleapis.com/khwantadashboard.appspot.com/o/example/front/${info.name}front_300x450`,
        ExamplesProductDetailImage: {
          create: [...img[0].map((e) => ({ Url: e }))],
        },
      },
    });
    const createdata = {
      Barcode: `KTEX${
        product.id.toString().length === 1
          ? `00${product.id}`
          : product.id.toString().length === 2
          ? `0${product.id}`
          : product.id
      }${
        product.category_id.toString().length === 1
          ? `0${product.category_id}`
          : product.category_id
      }`,
      ExampleProduct_Id: product.id,
    };
    const createBarcode = await prisma.stock_Info.create({
      data: createdata,
    });
    const list = {
      barcode: createdata.Barcode,
      code: "",
      fabric: "",
      brand: "Khwanta",
      name: info.name,
      size: "",
      cloth: true,
      price: +info.price,
    };
    socketconnect.emit("addProduct", {
      data: [list],
    });
    res.status(200).json({ createBarcode });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
export const AddExampleProductClothDetail = async (req, res) => {
  const user = req.user;
  try {
    const product = await prisma.examplesProduct.update({
      where: {
        id: +req.body.id,
      },
      data: {
        ExamplesProductDetailImage: {
          create: [
            {
              Url: req.body.img,
            },
          ],
        },
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
      Res: "เพิ่มรูปเรียบร้อย",
      product,
      user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
};
