const router = require('express').Router();

const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin } = require('../../middlewares/admin.middleware');

const ctl = require('../../controllers/admin/adminCategory.controller');

router.use(requireAuth, requireAdmin);

router.post("/", ctl.create);

router.put('/:categoryId', ctl.update);

router.patch('/:categoryId/deactive',ctl.deactive);

router.patch('/:categoryId/active',ctl.active);

router.delete('/:categoryId', ctl.deactive);

module.exports = router;