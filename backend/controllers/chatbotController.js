const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');
const pdfParse = require('pdf-parse');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Fallback analysis function
function generateFallbackAnalysis(pdfText) {
  const text = pdfText.toLowerCase();
  let analysis = "📄 **PDF Document Analysis**\n\n";
  
  // Check for agricultural keywords
  if (text.includes('soil') || text.includes('fertility') || text.includes('ph')) {
    analysis += "🌱 **Soil Health Detected:**\n- This appears to be a soil analysis report\n- Monitor soil pH levels for optimal crop growth\n- Consider organic matter content for soil fertility\n\n";
  }
  
  if (text.includes('crop') || text.includes('farming') || text.includes('agriculture')) {
    analysis += "🚜 **Agricultural Content:**\n- Document contains farming-related information\n- Focus on sustainable farming practices\n- Consider crop rotation for better yields\n\n";
  }
  
  if (text.includes('fertilizer') || text.includes('nutrient')) {
    analysis += "🧪 **Fertilizer/Nutrient Information:**\n- Proper nutrient management is crucial\n- Use soil testing to determine fertilizer needs\n- Consider organic alternatives when possible\n\n";
  }
  
  if (text.includes('pest') || text.includes('disease')) {
    analysis += "🐛 **Pest/Disease Management:**\n- Implement integrated pest management (IPM)\n- Regular monitoring is essential\n- Use biological controls when available\n\n";
  }
  
  analysis += "💡 **General Recommendations:**\n";
  analysis += "- Maintain detailed farm records\n";
  analysis += "- Follow sustainable farming practices\n";
  analysis += "- Consult local agricultural experts\n";
  analysis += "- Stay updated with latest farming techniques\n\n";
  analysis += "*Note: This is a basic analysis. For detailed AI insights, please configure a valid Gemini API key.*";
  
  return analysis;
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

exports.getChatResponse = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are AgriBot, an AI assistant specialized in agriculture and farming. 
    Please provide helpful, accurate information about farming, crops, livestock, pest control, 
    irrigation, fertilizers, and other agricultural topics. Keep responses concise and practical.
    
    User question: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error('Error generating chat response:', error);
    // Fallback for chat when API key is invalid
    if (error.message.includes('API key not valid')) {
      const fallbackResponses = {
        'crop': 'For crop management, focus on proper soil preparation, timely planting, and regular monitoring. Consider local climate conditions.',
        'soil': 'Soil health is crucial for farming. Test soil pH, organic matter, and nutrient levels regularly. Maintain proper drainage.',
        'fertilizer': 'Use balanced fertilizers based on soil test results. Organic options include compost and manure. Avoid over-fertilization.',
        'pest': 'Implement integrated pest management (IPM). Use biological controls, crop rotation, and resistant varieties when possible.',
        'irrigation': 'Efficient water management is key. Consider drip irrigation for water conservation. Monitor soil moisture levels.',
        'weather': 'Monitor weather forecasts regularly. Plan farming activities according to seasonal patterns and rainfall predictions.'
      };
      
      const message = req.body.message.toLowerCase();
      for (const [key, response] of Object.entries(fallbackResponses)) {
        if (message.includes(key)) {
          return res.json({ response });
        }
      }
      
      return res.json({ 
        response: "I'm here to help with farming questions! Ask me about crops, soil, fertilizers, pest control, irrigation, or weather. (Note: AI features require valid API key configuration)"
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate response',
      fallback: "I'm here to help with farming questions! Try asking about crops, fertilizers, pest control, or irrigation."
    });
  }
};

exports.uploadPdf = upload.single('pdf');

exports.analyzePdf = async (req, res) => {
  let pdfText = '';
  
  try {
    console.log('PDF upload request received');
    console.log('File info:', req.file ? {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : 'No file');

    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ error: 'PDF file is required' });
    }

    console.log('Parsing PDF...');
    const pdfData = await pdfParse(req.file.buffer);
    pdfText = pdfData.text;
    console.log('PDF text length:', pdfText.length);
    console.log('PDF text preview:', pdfText.substring(0, 200));

    if (!pdfText.trim()) {
      console.log('No text extracted from PDF');
      return res.status(400).json({ error: 'Could not extract text from PDF' });
    }

    // Check if API key is valid
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.log('Invalid or missing Gemini API key, using fallback analysis');
      const fallbackAnalysis = generateFallbackAnalysis(pdfText);
      return res.json({ 
        response: fallbackAnalysis,
        filename: req.file.originalname
      });
    }

    console.log('Sending to Gemini API...');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are AgriBot, an AI assistant specialized in agriculture and farming.
    Analyze the following document content and provide insights, recommendations, or answers related to agriculture.
    Focus on farming practices, crop management, livestock care, or any agricultural topics mentioned.
    
    Document content:
    ${pdfText.substring(0, 8000)}
    
    Please provide a comprehensive analysis and any relevant agricultural advice.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Gemini response received');

    res.json({ 
      response: text,
      filename: req.file.originalname
    });
  } catch (error) {
    console.error('Detailed error analyzing PDF:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // If API key is invalid, use fallback analysis
    if (error.message.includes('API key not valid')) {
      console.log('Using fallback analysis due to invalid API key');
      const fallbackAnalysis = generateFallbackAnalysis(pdfText);
      return res.json({ 
        response: fallbackAnalysis,
        filename: req.file.originalname
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to analyze PDF',
      details: error.message,
      fallback: "I couldn't analyze the PDF. Please try uploading a different file or ask me a direct question."
    });
  }
};

exports.upload = upload;