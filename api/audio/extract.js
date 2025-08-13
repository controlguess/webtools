const express = require('express');
const router = express.Router();
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const stream = require('stream');

router.get('/', async (req, res) => {
    try {
        const videoUrl = req.query.video;
        
        if (!videoUrl) {
            return res.status(400).json({ error: 'Video URL parameter is required' });
        }

        const response = await axios({
            method: 'get',
            url: videoUrl,
            responseType: 'stream'
        });

        res.setHeader('Content-Disposition', 'attachment; filename="audio.mp3"');
        res.setHeader('Content-Type', 'audio/mpeg');

        const passthrough = new stream.PassThrough();
        
        ffmpeg(response.data)
            .audioCodec('libmp3lame')
            .format('mp3')
            .on('error', (err) => {
                console.error('FFmpeg error:', err);
                res.status(500).json({ error: 'Audio conversion failed' });
            })
            .pipe(passthrough)
            .pipe(res);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to process audio extraction' });
    }
});

module.exports = router;
