import { Router } from 'express';
import * as folderController from '../controllers/folder.controller.js';
import * as shareController from '../controllers/share.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/', folderController.createFolder);
router.get('/', folderController.getFolders);
router.get('/:id', folderController.getFolder);
router.put('/:id', folderController.updateFolder);
router.delete('/:id', folderController.deleteFolder);
router.post('/:id/share', shareController.createShare);

export default router;