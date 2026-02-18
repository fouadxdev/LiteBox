import { Router } from 'express';
import * as fileController from '../controllers/file.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.use(requireAuth);

router.post('/upload/:folderId', upload.single('file'), fileController.uploadFile);
router.get('/:id', fileController.getFile);
router.delete('/:id', fileController.deleteFile);

export default router;