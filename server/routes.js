const express = require('express');
const path = require('path');
const fs = require('fs');
const audioProcessor = require('./audioProcessor');
const transcriptionService = require('./transcriptionService');

module.exports = function(upload) {
  const router = express.Router();

  // Upload multiple files
  router.post('/upload', upload.array('files', 10), async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }
      const fileDetails = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size
      }));
      return res.status(200).json({ message: 'Files uploaded successfully', files: fileDetails });
    } catch (err) {
      console.error('Error uploading files:', err);
      return res.status(500).json({ error: 'Failed to upload files' });
    }
  });

  // Merge audio files
  router.post('/merge', async (req, res) => {
    try {
      const { files } = req.body;
      if (!files || files.length < 2) {
        return res.status(400).json({ error: 'At least two files are required for merging' });
      }
      const filePaths = files.map(f => path.join(__dirname, 'uploads', f.filename));
      for (const fp of filePaths) {
        if (!fs.existsSync(fp)) {
          return res.status(404).json({ error: 'One or more files not found' });
        }
      }
      const outputFileName = `merged-${Date.now()}.mp3`;
      const outputPath = path.join(__dirname, 'merged', outputFileName);
      await audioProcessor.mergeAudioFiles(filePaths, outputPath);

      return res.status(200).json({
        message: 'Files merged successfully',
        mergedFile: { filename: outputFileName, url: `/merged/${outputFileName}`, isMerged: true }
      });
    } catch (err) {
      console.error('Error merging files:', err);
      return res.status(500).json({ error: 'Failed to merge files' });
    }
  });

  // Transcribe a file
  router.post('/transcribe', async (req, res) => {
    try {
      const { file } = req.body;
      if (!file) {
        return res.status(400).json({ error: 'No file provided for transcription' });
      }

      const filePath = file.isMerged
        ? path.join(__dirname, 'merged', file.filename)
        : path.join(__dirname, 'uploads', file.filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }

      const transcription = await transcriptionService.transcribeAudio(filePath);

      return res.status(200).json({ message: 'File transcribed successfully', transcription });
    } catch (err) {
      console.error('Error transcribing file:', err);
      return res.status(500).json({ error: 'Failed to transcribe file' });
    }
  });

  // Get all uploaded and merged files
  router.get('/files', (req, res) => {
    try {
      const uploadDir = path.join(__dirname, 'uploads');
      const mergedDir = path.join(__dirname, 'merged');

      const uploadedFiles = fs.readdirSync(uploadDir).map(name => ({
        filename: name,
        url: `/uploads/${name}`,
        isMerged: false
      }));

      const mergedFiles = fs.readdirSync(mergedDir).map(name => ({
        filename: name,
        url: `/merged/${name}`,
        isMerged: true
      }));

      return res.status(200).json({ uploadedFiles, mergedFiles });
    } catch (err) {
      console.error('Error getting files:', err);
      return res.status(500).json({ error: 'Failed to get files' });
    }
  });

  return router;
};
