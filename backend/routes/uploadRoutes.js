const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Armazenar o arquivo temporariamente no disco
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
      }
  
      console.log('Arquivo recebido:', req.file); // log para ver se o arquivo chegou
  
      const result = await cloudinary.uploader.upload(req.file.path);
      fs.unlinkSync(req.file.path); // remove o arquivo local após o upload
  
      res.json({ imageUrl: result.secure_url });
    } catch (err) {
      console.error('Erro no upload:', err);
      res.status(500).json({ message: 'Erro ao carregar imagem.' });
    }
  });

router.post('/test-upload', (req, res) => {
    res.send('Rota de teste funcionando!');
  });

module.exports = router;
