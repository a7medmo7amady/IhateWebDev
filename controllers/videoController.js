const Video = require("../models/videoModel");

const createVideo = async (req, res) => {
    try {
        const { title, description } = req.body;

        const newVideo = new Video({
            title,
            description,
            user: req.user._id
        });

        await newVideo.save();
        res.status(201).json(newVideo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getVideos = async (req, res) => {
    try {
        const { title, description, user, sort, page = 1, limit = 10 } = req.query;

        let filter = {};

        // Filtering
        if (title) {
            filter.title = { $regex: title, $options: "i" };
        }

        if (description) {
            filter.description = { $regex: description, $options: "i" };
        }

        if (user) {
            filter.user = user;
        }

        // Sorting
        let sortOption = {};

        if (sort === "newest") {
            sortOption.createdAt = -1;
        } else if (sort === "oldest") {
            sortOption.createdAt = 1;
        } else if (sort === "title_asc") {
            sortOption.title = 1;
        } else if (sort === "title_desc") {
            sortOption.title = -1;
        } else {
            sortOption.createdAt = -1;
        }

        // Pagination
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const totalVideos = await Video.countDocuments(filter);

        const videos = await Video.find(filter)
            .populate("user", "name email")
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber);

        res.status(200).json({
            totalVideos,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalVideos / limitNumber),
            videos
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createVideo, getVideos };
