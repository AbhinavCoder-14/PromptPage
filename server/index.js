import express from "express"
import cors from "cors"
import multer from "multer";




const app = express();


const upload = multer({dest:"uploads/"})
app.use(cors())



app.get("",(req,res)=>{
    return res.json({status:"all good bby"})
})




app.post("/upload/pdf",upload.single('pdf'),(req,res)=>{
    console.log("upload the given pdf file :)")
})


app.listen(8000, ()=>{
    console.log("server started...")
})