const fs = require('fs');
const { Deepgram } = require('@deepgram/sdk');

// Inisialisasi Deepgram SDK v2
const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY);

async function transcribeAudio(filePath) {
  try {
    const audioBuffer = fs.readFileSync(filePath);
    const options = {
      punctuate: true,
      diarize: false,     // ✅ MATIKAN
      model: 'general',   // ✅ GANTI MODEL
      language: 'id'
    };
    const result = await deepgram.transcription.preRecorded(
      { buffer: audioBuffer, mimetype: 'audio/wav' },
      options
    );
    return {
      transcript: result.results.channels[0].alternatives[0].transcript,
      confidence: result.results.channels[0].alternatives[0].confidence,
      words: result.results.channels[0].alternatives[0].words,
      utterances: result.results.utterances
    };
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error(`Transcription failed: ${error.message}`);
  }
}

module.exports = { transcribeAudio };
