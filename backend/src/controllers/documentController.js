const documentService = require('../services/documentService');

const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Koi file upload nahi ki gayi' });
        }

        const { docType, requestId } = req.body;

        if (!docType) {
            return res.status(400).json({ success: false, message: 'Document type (docType) required hai' });
        }

        // File ka local URL generate karna
        const fileUrl = `/uploads/${req.file.filename}`;
        
        const documentRecord = {
            docType,
            requestId,
            fileUrl,
            fileName: req.file.originalname
        };

        const savedDoc = await documentService.saveDocumentRecord(req.user.id, documentRecord);

        res.status(201).json({
            success: true,
            message: 'Document successfully upload ho gaya hai',
            data: savedDoc
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = { uploadDocument };