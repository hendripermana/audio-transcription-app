const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);

async function mergeAudioFiles(inputFiles, outputFile) {
  return new Promise((resolve, reject) => {
    const tempFilePath = path.join(__dirname, 'temp_file_list.txt');
    const content = inputFiles.map(f => `file '${f}'`).join('\n');
    fs.writeFileSync(tempFilePath, content);

    ffmpeg()
      .input(tempFilePath)
      .inputOptions(['-f', 'concat', '-safe', '0'])
      .outputOptions('-c copy')
      .output(outputFile)
      .on('end', () => {
        fs.existsSync(tempFilePath) && fs.unlinkSync(tempFilePath);
        resolve(outputFile);
      })
      .on('error', err => {
        fs.existsSync(tempFilePath) && fs.unlinkSync(tempFilePath);
        reject(err);
      })
      .run();
  });
}

module.exports = { mergeAudioFiles };
