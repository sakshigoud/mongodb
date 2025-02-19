import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/users';
const app: express.Application = express();
dotenv.config();

// const app: Express = express();
const port = process.env.PORT;
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/test')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
app.get('/', (req: Request, res: Response) => {
    res.send('Learning typescript express server connection to mongodb');
});

//for create user
app.post('/postusers', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.create({ name, email, password });
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
})

// for get users
app.get('/getusers', async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error fetching users' });
    }
})

// for update
app.put('/putusers/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedUser = req.body;

        const result = await User.findByIdAndUpdate(id, updatedUser, { new: true });

        if (!result) {
            res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error('Error updating users:', error);
        res.status(500).json({ error: 'Error updating users' });
    }
})
//for delete
app.delete('/deleteusers/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await User.findByIdAndDelete(id);

        if (!result) {
            res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error('Error deleting users:', error);
        res.status(500).json({ error: 'Error deleting users' });
    }
})


app.listen(port, () => {
    console.log(`server is  listening on port ${port}`);
});
