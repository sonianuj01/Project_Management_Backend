import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { User } from "../models/user.model.js";
import { Project } from "../models/project.models.js";
import mongoose from "mongoose";
import { ProjectMember } from "../models/projectmember.models.js";
import { UserRolesEnum } from "../utils/constants.js";


const addMembersToProject = asyncHandler(async(req,res) => {

});


const createProject = asyncHandler(async(req,res) => {
    const {name , description} = req.body;

    const project = await Project.create({
        name,
        description,
        createdBy : new mongoose.Types.ObjectId(req.user._id)
    });

    await ProjectMember.create({
        user : new mongoose.Types.ObjectId(req.user._id),
        project : new mongoose.Types.ObjectId(project._id),
        role : UserRolesEnum.ADMIN,
    });

    res
    .status(201)
    .json(
        new ApiResponse(201, project, "Project created Successfully !!")
    )

});


const updateProject = asyncHandler(async(req,res) => {
    const {name, description} = req.body;
    const { projectId } = req.params;

    const project = await Project.findByIdAndUpdate(
        projectId,
        {
            name,
            description
        },
        {new : true}
    );

    if(!project){
        throw new ApiError(404, "Project not found!")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200, project, "Project updated Successfully !!")
    )

});


const deleteProject = asyncHandler(async(req,res) => {
    const {projectId} = req.params;

    const project = await Project.findByIdAndDelete(projectId);

    
    if(!project){
        throw new ApiError(404, "Project not found!")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200, project, "Project deleted Successfully !!")
    )

});


const deleteMember = asyncHandler(async(req,res) => {

});


const getProjects = asyncHandler(async(req,res) => {

});


const getProjectById = asyncHandler(async(req,res) => {

});


const getProjectMembers = asyncHandler(async(req,res) => {

});



const updateMemberRole = asyncHandler(async(req,res) => {

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