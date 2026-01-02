const router = require('express').Router();

const ctl = require('../../controllers/admin/adminRestaurantRequest.controller');

const { requireAuth } = require('../../middlewares/auth.middleware');
const { requireAdmin } = require('@/middlewares/role.middleware');

router.use(requireAuth, requireAdmin);


// get pending request
router.get("/", ctl.listPending);

router.get("/:requestId", ctl.getById);

router.patch("/:requestId/approve", ctl.approve);

router.patch("/:requestId/reject", ctl.reject);


module.exports = router;