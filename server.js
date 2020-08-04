require('dotenv').config()

const { createCanvas, loadImage } = require('canvas')
const fs = require('fs');
const qrcode = require('qrcode');
const express = require('express');

const app = express();

function getMonth() {
  const arrayMonth = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

  const now = new Date();

  return arrayMonth[now.getMonth()];
}

function separetor(id) {
  const strings = id.split('_');

  return strings;
}

app.get('/endpoint', async (req, res) => {
  const { id } = req.query;

  const strings = separetor(id);

  const qrOption = { 
    margin : 1,
    width : 175
  };

  const bufferImage = await qrcode.toDataURL(strings[0],qrOption);

  var imgData = bufferImage;
  var base64Data = imgData.replace(/^data:image\/png;base64,/, "");
  
  
  await fs.writeFileSync("_qrcode.png", base64Data, 'base64');

  const width = 120
  const height = 120

  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')

  context.fillStyle = '#fff'
  context.fillRect(0, 0, width, height)

  context.font = 'bold 14pt Menlo'
  context.textAlign = 'center'
  context.textBaseline = 'top'

  context.fillStyle = '#000'
  context.font = 'bold 14pt Menlo'
  context.fillText(strings[1], 60, 5)

  context.fillStyle = '#000'
  context.font = '7pt Roboto'
  context.fillText(strings[0], 60, 80)

  context.fillStyle = '#000'
  context.font = 'bold 14pt Menlo'
  context.fillText(getMonth(), 60, 95)

  loadImage('./_qrcode.png').then(image => {
    context.drawImage(image, 40, 35, 40, 40)
    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync('./_etiqueta.png', buffer)
    res.type("image/png")
    res.send(buffer) 
  })
})

app.listen(3002, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});