import AgentService from '../services/AgentService.js';
import Upload from '../models/Upload.js';
import { createError } from '../utils/error.js';

/**
 * Expense Controller
 * Handles receipt scanning and AI-driven analysis.
 */
export const scanReceipt = async (req, res, next) => {
    try {
        if (!req.file) throw createError(400, '영수증 이미지가 업로드되지 않았습니다.');

        // 1. Save upload record
        const { originalname: originalName, destination, filename: fileName, size, mimetype } = req.file;
        const newUpload = new Upload({ 
            employeeId: req.user.employeeId, 
            originalName, 
            destination, 
            fileName, 
            size, 
            mimetype,
            width: 0, height: 0 
        });
        const upload = await newUpload.save();
        
        // 2. Generate access URL
        const receiptUrl = `${process.env.DOMAIN}/api/upload/image/${upload._id}`;

        // 3. Trigger Agentic Analysis
        // Session ID includes upload ID for traceability
        const sessionId = `SCAN-${upload._id.toString().slice(-8)}`;
        
        const result = await AgentService.processCommand(
            req.user, 
            "이 영수증을 분석하고 법인카드 내역과 대조해서 정산 데이터를 추출해줘.", 
            false, 
            null, 
            sessionId,
            { receiptUrl }
        );

        res.status(200).json({
            success: true,
            uploadId: upload._id,
            receiptUrl,
            analysis: result
        });
    } catch (err) {
        next(err);
    }
};
