import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { RoomController } from './room.controller';
import { RoomValidation } from './room.validations';

const router = express.Router();

router.get('/', RoomController.getAllRooms);
router.get('/:id', RoomController.getSingleRoom);

router.post(
    '/',
    validateRequest(RoomValidation.create),
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    RoomController.createRoom
);

router.patch(
    '/:id',
    validateRequest(RoomValidation.update),
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    RoomController.updateRoom
);

router.delete(
    '/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    RoomController.deleteRoom
);


export const roomRoutes = router;