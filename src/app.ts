import express, {Application, Request, Response} from "express";


const app:Application = express()
app.use(express.json());

app.get("/", (req:Request, res: Response)=>{
    const ip: string = req.ip
    res.json({"ip_address": ip})

})

app.listen(3000,()=>{
    console.log("App started running at port 3000")
})

