import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { User } from "../models/user.model.js";
import { Project } from "../models/project.models.js";
import mongoose from "mongoose";
import { ProjectMember } from "../models/projectmember.models.js";
import { UserRolesEnum } from "../utils/constants.js";



const createProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    const project = await Project.create({
        name,
        description,
        createdBy: new mongoose.Types.ObjectId(req.user._id)
    });

    await ProjectMember.create({
        user: new mongoose.Types.ObjectId(req.user._id),
        project: new mongoose.Types.ObjectId(project._id),
        role: UserRolesEnum.ADMIN,
    });

    res
        .status(201)
        .json(
            new ApiResponse(201, project, "Project created Successfully !!")
        )

});


const updateProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const { projectId } = req.params;

    const project = await Project.findByIdAndUpdate(
        projectId,
        {
            name,
            description
        },
        { new: true }
    );

    if (!project) {
        throw new ApiError(404, "Project not found!")
    }

    res
        .status(200)
        .json(
            new ApiResponse(200, project, "Project updated Successfully !!")
        )

});


const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findByIdAndDelete(projectId);


    if (!project) {
        throw new ApiError(404, "Project not found!")
    }

    res
        .status(200)
        .json(
            new ApiResponse(200, project, "Project deleted Successfully !!")
        )

});


const addMembersToProject = asyncHandler(async (req, res) => {
    //goal is if the member added , but don't have any role assign the role to it
    //if the member not added then create a document with given credentials
    const { email, role } = req.body;
    const { projectId } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User does not exists");
    }

    await ProjectMember.findByIdAndUpdate(
        {
            user: new mongoose.Types.ObjectId(user._id),
            project: new mongoose.Types.ObjectId(projectId),
        },
        {
            user: new mongoose.Types.ObjectId(user._id),
            project: new mongoose.Types.ObjectId(projectId),
            role: role,
        },
        {
            new: true,
            upsert: true, // if there is no such document create a new-one with same credentials
        },
    );

    return res
        .status(201)
        .json(new ApiResponse(201, {}, "Project member added successfully"));
});


const getProjects = asyncHandler(async (req, res) => {
    const projects = await ProjectMember.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            // when we perform lookup in any field it returns the data from the foreign feild those are matched.
            // here we perform lookup in ProjectMember but it matches the Project field and returns the Project.
            $lookup: {
                from: "projects", //this is Project in database i.e. always stored in plural ans lowercase
                localField: "projects", //this is project field of projectMember
                foreignField: "_id",
                as: "projects",
                pipeline: [
                    {
                        $lookup: {
                            from: "projectmembers",
                            localField: "_id",
                            foreignField: "projects",
                            as: "projectmembers"
                        } //here we get ProjectMember as projectmembers, related to the particular Project
                    },
                    {
                        $addFields: {
                            members: {
                                $size: "projectmembers" // members : (sizeof evaluated-projectmembers array)
                            }
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$project"
        },
        {
            $project: {
                project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    members: 1,
                    createdAt: 1,
                    createdBy: 1,
                },
                role: 1,
                _id: 0,
            }
        }
    ]);


    return res
        .status(200)
        .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});


const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, project, "Project fetched successfully"));
});


const getProjectMembers = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "no such project found!");
    }

    const projectMembers = await ProjectMember.aggregate([
        {
            $match: {
                project: new mongoose.Types.ObjectId(projectId),
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
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
            }
        },
        {
            $addFields: {
                user: {
                    $arrayElemAt: ["$user", 0],
                },
            },
        },
        {
            $project: {
                project: 1,
                user: 1,
                role: 1,
                createdAt: 1,
                updatedAt: 1,
                _id: 0,
            },
        },
    ])

    return res
        .status(200)
        .json(new ApiResponse(200, projectMembers, "Project members fetched"));
});



const updateMemberRole = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params;
    const { newRole } = req.body;

    if (!AvailableUserRole.includes(newRole)) {
        throw new ApiError(400, "Invalid Role");
    }

    let projectMember = await ProjectMember.findOne({
        project: new mongoose.Types.ObjectId(projectId),
        user: new mongoose.Types.ObjectId(userId),
    });

    if (!projectMember) {
        throw new ApiError(400, "Project member not found");
    }

    projectMember = await ProjectMember.findByIdAndUpdate(
        projectMember._id,
        {
            role: newRole,
        },
        { new: true },
    );

    if (!projectMember) {
        throw new ApiError(400, "Project member not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectMember,
                "Project member role updated successfully",
            ),
        );
});



const deleteMember = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params;

    let projectMember = await ProjectMember.findOne({
        project: new mongoose.Types.ObjectId(projectId),
        user: new mongoose.Types.ObjectId(userId),
    });

    if (!projectMember) {
        throw new ApiError(400, "Project member not found");
    }

    projectMember = await ProjectMember.findByIdAndDelete(projectMember._id);

    if (!projectMember) {
        throw new ApiError(400, "Project member not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectMember,
                "Project member deleted successfully",
            ),
        );
});


export {
    addMembersToProject,
    createProject,
    deleteMember,
    getProjects,
    getProjectById,
    getProjectMembers,
    updateProject,
    deleteProject,
    updateMemberRole,
};