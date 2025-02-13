// const RoomData = require('../../models/room/roomModel');

// exports.addRoomData = async (req, res) => {
//     try {
//         const roomDetails = new RoomData({
//             rooms: req.body.rooms
//         });

//         await roomDetails.save();
//         res.status(201).send({ message: 'Room data added successfully' });
//     } catch (error) {
//         console.log(error.message);
//         res.status(400).send(error.message);
//     }
// };


const RoomData = require('../../models/room/roomModel');
const Inspection = require('../../models/main/mainModel');

exports.addRoomDataToInspection = async (req, res) => {
    try {
        const room = new RoomData({
            rooms: req.body.rooms
        });

        const savedRoomDetails = await room.save();
        const inspectionId = req.body.inspectionId;
        const inspection = await Inspection.findById(inspectionId);

        if (!inspection) {
            return res.status(404).json({ message: 404 });
        }

        inspection.roomInfo = savedRoomDetails._id;
        await inspection.save();

        res.status(200).json({ message: 200, inspection });
    } catch (error) {
        console.log(error.message);
        res.status(400).send(error.message);
    }
};

exports.getRoomDataAndInspection = async (req, res) => {
    try {
        const inspectionId = req.params.inspectionId;
        const inspection = await Inspection.findById(inspectionId);

        if (!inspection) {
            return res.status(404).json({ message: 404 });
        }

        const roomDetails = await RoomData.findById(inspection.roomInfo);

        if (!roomDetails) {
            return res.status(404).json({ message: 404 });
        }

        res.status(200).json({
            message: 200,
            inspection,
            roomDetails
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

