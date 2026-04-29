import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import { scanReceipt } from '../controllers/expense.js';
import { verifyUser } from '../utils/verifyToken.js';
import { DateUtil } from '../utils/util.js';
import { ensureDirectoryExists } from '../utils/file.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { year, month } = DateUtil.getYearMonth();
        ensureDirectoryExists(`uploads/${year}/${month}/`);
        cb(null, `uploads/${year}/${month}/`);
    },
    filename: (req, file, cb) => {
        cb(null, `receipt-${uuidv4()}.${mime.extension(file.mimetype)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for high-res receipts
    fileFilter: (req, file, cb) => {
        if (['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.mimetype))
            cb(null, true);
        else
            cb(new Error('지원하지 않는 파일 형식입니다.'), false);
    }
});

const router = express.Router();

router.post('/scan', verifyUser, upload.single('receipt'), scanReceipt);

export default router;
