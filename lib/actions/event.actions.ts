'use server'

import { CreateEventParams, GetAllEventsParams } from "@/types"
import { connectToDatabase } from "../database"
import User from "../database/models/user.model"
import { handleError } from "../utils"
import Event from "../database/models/event.model"
import { model } from "mongoose"
import Category from "../database/models/category.model"
import { Query } from 'mongoose';

const populateEvent = async (query: Query<Event | Event[], any>) => {
    return query
        .populate({
            path: 'organizer',
            model: User,
            select: '_id firstName lastName',
        })
        .populate({
            path: 'category',
            model: Category,
            select: '_id name',
        });
};

export const createEvent = async ({ event, userId, path}: CreateEventParams) => {

    try {
        await connectToDatabase()

        const organizer = await User.findById(userId)

        if(!organizer) {
            throw new Error("Organizer not found")
        }

        const newEvent = await Event.create({
            ...event,
            category:event.categoryId,
            organizer: userId,
        })

        return JSON.parse(JSON.stringify(newEvent));

    }catch(e) {
        handleError(e)
    }
}

export const getEventById = async (eventId: string) => {

    try{
        await connectToDatabase()

        //populate the event model with the organizer and category
        const event = await populateEvent(Event.findById(eventId));

        if(!event) {
            throw new Error("Event not found")
        }

        return JSON.parse(JSON.stringify(event));

    }catch(e) {
        handleError(e)
    }
}

export const getAllEvents = async ({ query, limit = 6, page = 1, category }: GetAllEventsParams) => {
    try {
        await connectToDatabase();

        // Build the condition based on query parameters
        const condition: { [key: string]: any } = {};

        // Add category filter if provided
        if (category) {
            condition.category = category; // Assuming category is stored in the 'category' field
        }

        // Calculate the number of documents to skip based on the page
        const skip = (page - 1) * limit;

        const eventsQuery = Event.find(condition)
            .sort({ createdAt: 'desc' })
            .skip(skip)
            .limit(limit);

        const events = await populateEvent(eventsQuery);

        const eventsCount = await Event.countDocuments(condition);

        return {
            data: JSON.parse(JSON.stringify(events)),
            totalPages: Math.ceil(eventsCount / limit),
            currentPage: page,
        };
    } catch (e) {
        handleError(e);
    }
};


