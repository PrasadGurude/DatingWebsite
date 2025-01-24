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

app.get('/', async (c) => {
  return c.json({ message: 'Hello, World!' });
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
      return c.json({ success: true, token, user: existingUser, message: 'User login successful' });
    }

    const newUser = await prisma.user.create({
      data: { ...body },
    });

    const token = await sign({ id: newUser.id }, c.env.JWT_SECRET);
    return c.json({ success: true, token, user: newUser , message: 'User created successfully' }); 
  } catch (err) {
    console.error(err);
    return c.json({ success: false, error: 'Signup failed' });
  }
});

app.post("/api/send-request", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const userId = c.get('userId');
    const body = await c.req.json();

    // Add the requestedId to the current user's requestedIds array
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return c.json({ success: false, message: 'User not found.' });
    }

    if (user.requestedIds.includes(body.requestedId)) {
      return c.json({ success: false, message: 'Request already sent' });
    }

    const updateArr = await prisma.user.update({
      where: {
      id: userId,
      },
      data: {
      requestedIds: {
        push: body.requestedId,
      },
      },
    });

    // Check if there's a mutual match
    const checkMatch = await prisma.user.findFirst({
      where: {
        id: body.requestedId,
        requestedIds: {
          has: userId,
        },
      },
    });

    if (checkMatch) {
      // Update the matchId for both users
      await prisma.user.update({
        where: { id: userId },
        data: {
          matchStatus: true,
          matchId: body.requestedId, // Assign requestedId to user's matchId
        },
      });

      await prisma.user.update({
        where: { id: body.requestedId },
        data: {
          matchStatus: true,
          matchId: userId, // Assign userId to requested user's matchId
        },
      });
    }

    return c.json({ success: true, message: 'Match request successfully sent', user: updateArr });
  } catch (err) {
    console.error(err);
    return c.json({ success: false, message: 'Match request failed' });
  }
});

app.put("/api/send-remove-request", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const userId = c.get('userId');

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return c.json({success: false, message: "User not found" }, 404);
    }

    const body = await c.req.json();
    const updateArr = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        requestedIds: {
          set: user.requestedIds.filter((id) => id !== body.requestedId),
        }
      }
    })

    if (updateArr.matchId === body.requestedId) {
      await prisma.user.updateMany({
        where: {
          id: { in: [userId, body.requestedId] }
        },
        data: {
          matchStatus: false,
          matchId: ""
        }
      })
    }
    return c.json({ success: true, message: 'remove request successfully send', user: updateArr });
  } catch (err) {
    console.error(err);
    return c.json({success: false, message: "match request removal failed failed" })
  }
})

app.get('/api/all-users/:page', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const userId = c.get('userId');
    const page = Number(c.req.param('page')) || 1;

    const pageSize = 10;
    const offset = (page-1) * pageSize;

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: userId
        }
      },
      skip: offset,
      take: 10
    })

    return c.json({success: true, users, message: "all users fetched successfully" });
  } catch (err) {
    console.error(err);
    return c.json({success: false, message: "all users not found", error: err });
  }
})

app.get('/api/requested-array/:page', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    
    
    const page = Number(c.req.param('page')) || 1;
    const userId = c.get('userId');
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    const pageSize = 10;
    const offset = (page-1) * pageSize;

    
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: user?.requestedIds
        }
      },
      skip: offset,
      take: 10
    })

    console.log(user?.requestedIds);
    

    return c.json({success: true, users, message: "requested array fetched successfully" });
  } catch (err) {
    console.error(err);
    return c.json({success: false, message: "requested array not found", error: err });
  }
})

app.get('api/search/:name', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  

  try {
    const userId = c.get('userId');
    const {name} = c.req.param();
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive'
        }
      }
    });

    if (!users) {
      return c.json({success: false, message: "searched user not found" });
    }

    if(users.length > 10) {
      return c.json({success: false, message: "too many users found, please be more specific" });
    }

    return c.json({success: true, users, message: "searched user fetched successfully" });
  } catch (err) {
    console.error(err);
    return c.json({ message: "error while searched users ", error: err });
  }
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
    return c.json({success: true, user, message: "profile fetched successfully " })

  } catch (err) {
    console.error(err);
    return c.json({success: false, message: "profile not found ", error: err })
  }
})

app.put('/api/profile', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());



  try {
    const userId = c.get('userId');
    if (!userId) {
      return c.json({ success: false, error: 'User ID is missing or invalid' }, 400);
    }
    const body = await c.req.json();

    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: { ...body,age:parseInt(body.age),engYear:parseInt(body.engYear) }
    })
    return c.json({success: true, message: "profile Updated ", user: updatedUser })
  } catch (err) {
    console.error(err);
    return c.json({success: false, message: "profile updation failed ", error: err })
  }
})

app.get('/api/status', async (c) => {

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

    if(user?.matchStatus===true){
      const MatcedUser = await prisma.user.findFirst({
        where: {
          id: user.matchId
        }
      })
      return c.json({success: true, user:MatcedUser, message: "profile fetched successfully" })
    }

    return c.json({success: false, message: "No match found" })
  } catch (err) {
    console.error(err);
    return c.json({success: false, message: "profile not found ", error: err })
  }
})

export default app;
