import { Router } from "express";

const router = Router();

import {
        createSubTask,
        createTask,
        deleteTask,
        deleteSubTask,
        getTaskById,
        getTasks,
        updateSubTask,
        updateTask
    } from '../controllers/task.controller.js';

import {
        verifyJWT,
        validateProjectPermission,
    } from "../middlewares/auth.middleware.js";
    
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";
import { validator } from "../middlewares/validator.middleware.js";
import { createTaskValidator } from "../validators/index.js";

router.use(verifyJWT);

router
    .route('/:projectId')
    .get(validateProjectPermission(AvailableUserRole), getTasks)
    .post(
        validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
        createTaskValidator,
        validator,
        createTask);

router
    .route('/:projectId/t/:taskId')
    .get(validateProjectPermission(AvailableUserRole),getTaskById)
    .put(
        validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
        createTaskValidator,
        validator,
        updateTask
    )
    .delete(
        validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
        deleteTask
    );

router
    .route('/:projectId/t/:taskId/subtasks')
    .post(createSubTask);

router
    .route('/:projectId/st/:subTaskId')
    .put(updateSubTask)
    .delete(deleteSubTask);

export default router;