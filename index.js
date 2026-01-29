import express from 'express';
import 'dotenv/config'
import connectDB from './DB/connectionDB.js';
import { GlobleErrorHandeler } from './src/Middleware/AsyncHandler/AsyncHandler.js';
import UserRouter from './src/modules/user/user.routes.js';
import OfferRouter from './src/modules/offers/offer.routes.js';
import RequestRouter from './src/modules/request/request.routes.js';
import notificationRouter from './src/modules/notifications/notification.routes.js';
import analyticsRouter from './src/modules/analytics/analytics.routes.js';


const app = express();
const port = process.env.port || 3000

app.use(express.json())


app.use('/api/v1/users', UserRouter);
app.use('/api/v1/offers', OfferRouter);
app.use('/api/v1/requests', RequestRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/analytics', analyticsRouter);




connectDB()
app.use(GlobleErrorHandeler)


app.get('/', (req, res) => { res.send('Hello World!!!!');});

app.listen(port, () => {console.log(`Server running on port port`);});