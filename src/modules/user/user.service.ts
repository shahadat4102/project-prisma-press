import { Payload } from './../../../generated/prisma/internal/prismaNamespace';
import config from "../../config";
import { prisma } from "../../lib/prisma"
import bcrypt from "bcryptjs";
import { RegisterUserPayload } from "./user.interface"



const registerUserBD = async (Payload: RegisterUserPayload) =>{
const {name, email, password, profilephoto}= Payload
    
const isUseExist = await prisma.user.findUnique({
where : {email}
})
if(isUseExist){
  throw new Error ("User width this email already exist")
}

const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))

const createuser = await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
    profile : {
      create : { 
        profilephoto
      }
    }
  }
})


// await prisma.profile.create({
//   data : {
//     userId : createuser.id,
//     profilephoto
//   }
// })

const user = await prisma.user.findUnique({
  where : {
    id : createuser.id,
    email : createuser.email || email
  },
  omit : {
    password: true
  },
  include : {
    profile : true
  }
})

return user;
}


const getmyprofileBD = async (userId : string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {id: userId},
    omit: {
      password: true
    },
    include:{
      profile: true
    }
  })
  return user;

}

const updatemyprofileBD = async(userId: string, Payload:any)=>{
  const {name, email, profilephoto, bio} = Payload;
  const updeateuser = await prisma.user.update({
    where: {id: userId},
    data:{
      name,
      email,
      profile: {
        update: {
          profilephoto,
          bio
        }
      }
    },

    omit:{
      password: true
    },
    include:{
      profile: true
    }

  })
  return updeateuser
}


export const UserSirvice ={
    registerUserBD,
    getmyprofileBD,
    updatemyprofileBD
}