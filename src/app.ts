import express from 'express';
import config from './config/config';
import mongoConnect from './config/mongo-connector';
import path from 'path';
import uploadRouter from './routes/upload.route';
import authRoutes from './routes/authRoutes';
import walletRoutes from './routes/walletRoutes';
import transactionRoutes from './routes/transactionRoutes';
import { logger } from './utils/logger';
import collectibleRoutes from './routes/collectibleRoutes';
import nftRoutes from './routes/nft.routes';

export const app = express();

// Middleware
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Starkbid API!');
});

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy!' });
});

app.use('/cdn', express.static(path.join(__dirname, '..', 'uploads'), {
  maxAge: 31557600000, // 1 year in milliseconds
  immutable: true,
}));

app.use(uploadRouter);
 
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/collectibles', collectibleRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/nfts', nftRoutes);
import auctionRoutes from './routes/auctionRoutes';
// ...existing code...
app.use('/api/auctions', auctionRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({ message: 'Route not found' });
});

// Remove direct server startup; handled in websocket.ts


