import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { User } from "../models/user.model.js";
import { Project } from "../models/project.models.js";
import mongoose from "mongoose";
import { ProjectMember } from "../models/projectmember.models.js";
import { UserRolesEnum } from "../utils/constants.js";
import { Task } from "../models/task.models.js";
import { subTask } from "../models/subtask.models.js";


const getTasks = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }
    const tasks = await Task.find({
        project: new mongoose.Types.ObjectId(projectId),
    }).populate("assignedTo", "avatar username fullName");

    return res
        .staus(201)
        .json(new ApiResponse(201, tasks, "Task fetched successfully"));
});



const createTask = asyncHandler(async (req, res) => {
    const { title, description, assignedTo, status } = req.body;
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }
    const files = req.files || [];

    const attachments = files.map((file) => {
        return {
            url: `${process.env.SERVER_URL}/images/${file.originalname}`,
            mimetype: file.mimetype,
            size: file.size,
        };
    });

    const task = await Task.create({
        title,
        description,
        project: new mongoose.Types.ObjectId(projectId),
        assignedTo: assignedTo
            ? new mongoose.Types.ObjectId(assignedTo)
            : undefined,
        status,
        assignedBy: new mongoose.Types.ObjectId(req.user._id),
        attachments,
    });

    return res
        .staus(201)
        .json(new ApiResponse(201, task, "Task created successfully"));
});



const getTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const task = await Task.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(taskId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "assignedTo",
                foreignField: "_id",
                as: "assignedTo",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "subtasks",
                localField: "_id",
                foreignField: "task",
                as: "subtasks",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "createdBy",
                            foreignField: "_id",
                            as: "createdBy",
                            pipeline: [
                                {
                                    $project: {
                                        _id: 1,
                                        username: 1,
                                        fullName: 1,
                                        avatar: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            createdBy: {
                                $arrayElemAt: ["$createdBy", 0],
                            },
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                assignedTo: {
                    $arrayElemAt: ["$assignedTo", 0],
                },
            },
        },
    ]);

    if (!task || task.length === 0) {
        throw new ApiError(404, "Task not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, task[0], "Task fetched successfully"));
});


const updateTask = asyncHandler(async (req, res) => {
    //chai
    const { taskId } = req.params;
    const { title, description, assignedTo, status } = req.body;

    const files = req.files || [];

    const attachments = files.map((file) => {
        return {
            url: `${process.env.SERVER_URL}/images/${file.originalname}`,
            mimetype: file.mimetype,
            size: file.size,
        };
    });
    const task = await Task.findByIdAndUpdate(
        taskId,
        {
            title,
            description,
            project: new mongoose.Types.ObjectId(projectId),
            assignedTo: assignedTo
                ? new mongoose.Types.ObjectId(assignedTo)
                : undefined,
            status,
            assignedBy: new mongoose.Types.ObjectId(req.user._id),
            attachments,
        },
        { new: true }
    );

    if (!task) {
        throw new ApiError(404, "No such task found!!")
    }

    return res
        .status(209)
        .json(
            new ApiResponse(209, task, "Task updated successfully!!")
        );
});


const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
        throw new ApiError(404, "No such task found!!")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Task deleted successfully!!")
        );
});


const createSubTask = asyncHandler(async (req, res) => {
    const {title, isCompleted} = req.body;
    const {taskId} = req.params;

    const task = await Task.findById(taskId);

    if(!task){
        throw new ApiError(404, "This task doesn't exist!")
    }

    const sbTask = await subTask.create({
        title,
        task: new mongoose.Types.ObjectId(taskId),
        isCompleted,
        createdBy: new mongoose.Types.ObjectId(req.user._id)
    });

    if(!sbTask){
        throw new ApiError(409, "There is some problem in creating Sub-Task.")
    }

    return res
        .staus(201)
        .json(new ApiResponse(201, sbTask, "Sub-Task created successfully"));
});

const updateSubTask = asyncHandler(async (req, res) => {
    const { subTaskId } = req.params;
    const { title, isCompleted } = req.body;

    const sbTask = await subTask.findById(subTaskId);

    if (!sbTask) {
        throw new ApiError(404, "No such subTask found!!")
    }

    sbTask.title = title
    sbTask.isCompleted = isCompleted

    await sbTask.save();

    return res
        .status(209)
        .json(
            new ApiResponse(209, sbTask, "Sub-Task updated successfully!!")
        );
});


const deleteSubTask = asyncHandler(async (req, res) => {
    const { subTaskId } = req.params;

    const sbTask = await subTask.findByIdAndDelete(subTaskId);

    if (!sbTask) {
        throw new ApiError(404, "No such subTask found!!")
    }

    return res
        .status(209)
        .json(
            new ApiResponse(209, "Sub-Task deleted successfully!!")
        );

});

export {
    createSubTask,
    createTask,
    deleteTask,
    deleteSubTask,
    getTaskById,
    getTasks,
    updateSubTask,
    updateTask,
};
