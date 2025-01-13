import { Hono } from 'hono'
import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { cors } from 'hono/cors';
import { sign, verify } from 'hono/jwt'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
  },
  Variables: {
    userId: string
  }
}>();


app.use(cors()) 

app.use("/api", async (c, next) => {
  const jwt = c.req.header('Authorization');
  if (!jwt) {
    c.status(401);
    return c.json({ error: "unauthorized please signup first" });
  }
  const token = jwt.split(' ')[1];

  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload) {
      c.status(401);
      return c.json({ message: "unauthorized user" });
    }

    c.set('userId', payload.id as string) 
    await next();
  } catch (error) {
    c.status(401);
    return c.json({ message: "unauthorized user" });
  }
});

app.post("/sighup", async (c)=>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try{
    const body = await c.req.json()
    const exhist = await prisma.user.findUnique({
      where:{
        email:body.email
      }
    })
    if(exhist){
      const token = await sign({ id: exhist.id }, c.env.JWT_SECRET);
      return c.json({token , exhist})
    }
    const newUser = await prisma.user.create({
    data: {
      name        :body.name,
      email       :body.email,      
      requestedIds:body.requestedIds,
      matchStatus :body.matchStatus,
      matchId     :body.matchId,
      picture     :body.picture,
      age         :body.age,
      engYear     :body.engYear,
      branch      :body.branch,
      gender      :body.gender,
      insta_id    :body.insta_id
    }
  })
  const token = await sign({ id: newUser.id }, c.env.JWT_SECRET);
  return c.json({token , newUser})
  }catch(err){
    return c.json({error:"some problem occured in signup",err})
  }
})

app.post("/api/send-request", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get('userId');

  const body = await c.req.json();
  const updateArr = await prisma.user.update({
    where: {
      id: userId
    },
    data: {  
      requestedIds: {
        push: body.requestedId
      }
    }
  })

  const checkMatch = await prisma.user.findUnique({
    where:{
      id:body.requestedId
    }
  })

  checkMatch?.requestedIds.map((id)=>{ 
    if(id === userId){
      const match = prisma.user.update({
        where:{
          id:userId
        },
        data:{
          matchStatus:true,
          matchId:body.requestedId
        }
      })
      const match2 = prisma.user.update({
        where:{
          id:body.requestedId
        },
        data:{
          matchStatus:true,
          matchId:userId
        }
      })
    }
  })

  return c.json({ sucess: true, message: 'match request successfully' })
})
 
app.put("/api/send-remove-request", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get('userId');

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return c.json({ message: "User not found." }, 404);
  }

  const body = await c.req.json();
  const updateRightSwipeArray = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      requestedIds: {
        set: user.requestedIds.filter((id) => id !== body.requestedId),
      }
    }
  })
  const checkMatch = await prisma.user.findUnique({
    where:{
      id:body.requestedId
    }
  })

  checkMatch?.requestedIds.map((id)=>{ 
    if(id === userId){
      const match = prisma.user.update({
        where:{
          id:userId
        },
        data:{
          matchStatus:false,
          matchId:""
        }
      })
      const match2 = prisma.user.update({
        where:{
          id:body.requestedId
        },
        data:{
          matchStatus:false,
          matchId:""
        }
      })
    }
  })
  return c.json({ sucess: true, message: 'match request successfully send' })
})

app.get('/api/requested-array', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get('userId');
  const user = await prisma.user.findUnique({
    where :{
      id:userId
    }
  })
 
  const id_arr = user?.requestedIds

  const users = await prisma.user.findMany({
    where:{
      id:{
        in:id_arr
      }
    }
  })
  
  return c.json(users);
})

app.get('/profile',async (c) => {

  const userId = c.get('userId');
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const user = await prisma.user.findUnique({
    where:{
      id:userId
    }
  })
  return c.json({user,message:"profile fetched successfully"})
})

export default app
