import express from "express"
import cors from "cors"
import multer from "multer";




const app = express();


app.use(cors())



const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"uploads/")
    },
    filename:function (req,file,cb){
        const uniqueSufffix = Date.now()+"-"+Math.round(Math.random()*1e9);
        cb(null,`${uniqueSufffix}-${file.originalname}`); 
    },
})



const upload = multer({storage:storage})



app.get("/",(req,res)=>{
    return res.json({status:"all good bby"})
})




app.post("/upload/pdf",upload.single('pdf'),(req,res)=>{
    console.log("upload the given pdf file :)")
})


app.listen(8000, ()=>{
    console.log("server started...")
})