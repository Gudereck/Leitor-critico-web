import mongoose from "mongoose"
const connectToDB = async () =>{
    await mongoose.connect(process.env.URI).then((res)=>{
        console.log("MongoDB conectado com sucesso")
    })
}

export default connectToDB