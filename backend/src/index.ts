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

app.use("/api/*", async (c, next) => {
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

app.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const body = await c.req.json();
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      const token = await sign({ id: existingUser.id }, c.env.JWT_SECRET);
      return c.json({ success: true, token, user: existingUser });
    }

    const newUser = await prisma.user.create({
      data: { ...body },
    });

    const token = await sign({ id: newUser.id }, c.env.JWT_SECRET);
    return c.json({ success: true, token, user: newUser });
  } catch (err) {
    console.error(err);
    return c.json({ success: false, error: 'Signup failed.' });
  }
});


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

  const checkMatch = await prisma.user.findFirst({
    where: {
      id: body.requestedId,
      requestedIds: {
        has: userId,
      },
    },
  });

  if (checkMatch) {
    await prisma.user.updateMany({
      where: {
        id: { in: [userId, body.requestedId] },
      },
      data: {
        matchStatus: true,
        matchId: body.requestedId,
      },
    });
  }


  return c.json({ sucess: true, message: 'match request successfully' })
})

app.put("/api/send-remove-request", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

 try{
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
    where: {
      id: body.requestedId
    }
  }) 

  checkMatch?.requestedIds.map((id) => {
    if (id === userId) {
      const match = prisma.user.update({
        where: {
          id: userId
        },
        data: {
          matchStatus: false,
          matchId: ""
        }
      })
      const match2 = prisma.user.update({
        where: {
          id: body.requestedId
        },
        data: {
          matchStatus: false,
          matchId: ""
        }
      })
    }
  })
  return c.json({ sucess: true, message: 'match request successfully send' })
 }catch(err){
   console.error(err);
   return c.json({ message: "match request removal failed failed" })
 }
})

app.get('/api/requested-array', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get('userId');
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })

  const id_arr = user?.requestedIds

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: id_arr
      }
    }
  })

  return c.json(users);
})

app.get('/api/profile', async (c) => {

  try {
    const userId = c.get('userId');
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.findFirst({
      where: {
        id: userId
      }
    })
    return c.json({ user, message: "profile fetched successfully 1" })

  } catch (err) {
    console.error(err);
    return c.json({ message: "profile not found ", error: err })
  }
})

app.put('/api/profile', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

 

  try {
    const userId = c.get('userId');
    if (!userId) {
      return c.json({ success: false, error: 'User ID is missing or invalid.' }, 400);
    }
    const body = await c.req.json();

    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: body 
    })
    return c.json({ message: "profile Updated ", user:updatedUser })
  } catch (err) {
    console.error(err);
    return c.json({ message: "profile updation failed ", error: err })
  }
})
export default app;
