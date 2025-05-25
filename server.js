//ประกาศการใช้งานแพ็คเกจ
const express = require('express');  //ใช้สร้าง Web Server ใช้สร้าง API
const cors = require('cors'); //ใช้จัดการการเรียก API ข้ามโดเมน
const { PrismaClient } = require('@prisma/client'); //ใช้จัดการฐานข้อมูลผ่าน Prisma
 
//สร้าง Web Server
const app = express();
 
//กำหนดพอร์ตที่ Web Server จะทำงาน
const PORT = 8888; //หมายเลขอะไรก็ได้ที่ไม่ซ้ำกับที่ใช้อยู่
 
//ใช้ middleware จัดการเรื่องต่างๆ ดังนี้
app.use(cors()); //จัดการการเรียกใช้งาน API ข้ามโดเมน
app.use(express.json()); //ใช้จัดการข้อมูล JSON ที่ส่งไปมาระหว่าง Frontend และ API
 
//โค้ดส่วนของการทดสอบการใช้งาน Web Server (ทดสอบแล้วลบทิ้งหรือไม่ก็ได้แล้วแต่...)
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Server ใช้งานได้ OK จ้าาาาาา!!!! NinniN'
    });
});
 
const prisma = new PrismaClient();
//-----------------------------------------------
//ส่วนของ API ที่ใช้ในการทำงานต่างๆ กับฐานข้อมูล
//เพิ่มข้อมูล
app.post("/api/run", async (request, response) => {
    try {
        //เอาข้อมูลที่ส่งมาซี่งจะอยู่ใน request.body มาเก็บในตัวแปร
        const { runLocation, runDistance, runTime } = request.body;
 
        //เอาข้อมูลที่อยู่ในตัวแปรส่งให้กับ Prisma เพื่อเอาไปบันทึก (create) ลงตาราง
        const result = await prisma.run_tb.create({
            data: {
                runLocation: runLocation,
                runDistance: runDistance,
                runTime: runTime
            }
        })
 
        //ส่งผลลัพธ์การทำงานกลับไปยัง client/user/frontend
        return response.status(201).json({ message: "create complete", result: result });
    } catch (error) {
        response.status(500).json({ message: error.message })
    }
})
 //API ดึงข้อมูลทั้งหมดจากตาราง run_tb (Endpoint: /api/run)
app.get("/api/run", async (request, response) => {
    try {
        //ให้ Prisma ไปดึงข้อมูลทั้งหมดจากตาราง
        const result = await prisma.run_tb.findMany();
 
        //ส่งผลลัพธ์การทำงานกลับไปยัง client/user/frontend
        return response.status(200).json({ message: "get complete", result: result });
    } catch (error) {
        response.status(500).json({ message: error.message })
    }
})
 //API แก้ไข
app.put("/api/run/:runId", async (request, response) => {
    try {
        //เอาข้อมูลที่ส่งมาซี่งจะอยู่ใน request.body มาเก็บในตัวแปร
        const { runLocation, runDistance, runTime } = request.body;
 
        //เอาข้อมูลที่อยู่ในตัวแปรกับที่ส่งมาเป็น request params ส่งให้กับ Prisma เพื่อเอาไปบันทึกแก้ไข (update) ลงตาราง
        const result = await prisma.run_tb.update({
            data: {
                runLocation: runLocation,
                runDistance: runDistance,
                runTime: runTime
            },
            where:{
                runId: parseInt(request.params.runId)
            }
        })
 
        //ส่งผลลัพธ์การทำงานกลับไปยัง client/user/frontend
        return response.status(200).json({ message: "update complete", result: result });
    } catch (error) {
        response.status(500).json({ message: error.message })
    }
})
 
//API ลบ
app.delete("/api/run/:runId", async (request, response) => {
    try {
        //เอาข้อมูลที่ส่งกับ request params ส่งให้กับ Prisma เพื่อเอาไปเป็นเงื่อนไขในการลบ
        const result = await prisma.run_tb.delete({
            where:{
                runId: parseInt(request.params.runId)
            }
        })
 
        //ส่งผลลัพธ์การทำงานกลับไปยัง client/user/frontend
        return response.status(200).json({ message: "delete complete", result: result });
    } catch (error) {
        response.status(500).json({ message: error.message })
    }
})


 
//-----------------------------------------------
 
//เปิดให้บริการ Web Server ตามที่สร้างไว้ผ่านพอร์ตที่กำหนดไว้
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
 