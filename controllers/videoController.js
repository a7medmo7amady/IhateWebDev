const Video = require("../models/videoModel")
export const createVideo = async (req, res) => {
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