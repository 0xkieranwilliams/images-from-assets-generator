const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");

async function saveImage(fileName) {
  return new Promise((resolve, reject) => {
    let buffer = canvas.toBuffer();
    fs.writeFile(fileName, buffer, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

let combinationsHashMap = {};

let scale = 30;
const width = 24 * scale;
const height = 24 * scale;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#000";
ctx.fillRect(0, 0, width, height);

async function generateImage(
  fileName,
  hair_num,
  face_num,
  faceFeatures_num,
  legs_num
) {
  combinationsHashMap[
    `${hair_num}${face_num}${faceFeatures_num}${legs_num}`
  ] = true;
  await loadImage(`./images/hair${hair_num}.png`).then((hair) => {
    ctx.drawImage(hair, 0, 0, width, height);
    loadImage(`./images/face${face_num}.png`).then((face) => {
      ctx.drawImage(face, 0, 0, width, height);
      loadImage(`./images/faceFeatures${faceFeatures_num}.png`).then(
        (faceFeatures) => {
          ctx.drawImage(faceFeatures, 0, 0, width, height);
          loadImage(`./images/legs${legs_num}.png`).then(async (legs) => {
            ctx.drawImage(legs, 0, 0, width, height);
            await saveImage(fileName);
          });
        }
      );
    });
  });
}

function checkAvailability(hair_num, face_num, faceFeatures_num, legs_num) {
  if (
    combinationsHashMap[
      `${hair_num}${face_num}${faceFeatures_num}${legs_num}`
    ] === true
  )
    return false;
  return true;
}

async function generateUniqueImage(filePath) {
  // clear canvas
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);
  let isAvailable = false;
  while (!isAvailable) {
    let rndNums = [];
    for (let i = 0; i < 4; i++) {
      let rndNum = Math.floor(Math.random() * 3) + 1;
      rndNums[i] = rndNum;
    }
    let [hair, face, faceFeatures, legs] = rndNums;
    isAvailable = checkAvailability(hair, face, faceFeatures, legs);
    if (isAvailable) {
      console.log(
        `Generating Image: hair:${hair}, face:${face}, faceFeatures:${faceFeatures}, legs:${legs}`
      );
      await generateImage(filePath, hair, face, faceFeatures, legs);
    }
  }
}

async function generateAllImages(permutations) {
  for (let i = 0; i < permutations - 1; i++) {
    await generateUniqueImage(`./outputImages/${i}.png`);
  }
}
generateAllImages(80);
