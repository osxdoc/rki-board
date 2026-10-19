const Tesseract = require('tesseract.js');
const path = process.argv[2] || '../photo.png';
(async () => {
  const worker = await Tesseract.createWorker(['deu','eng'], 1, {logger: m=>{}});
  const {data} = await worker.recognize(path);
  console.log(data.text);
  await worker.terminate();
})().catch(e=>{console.error('ERR', e.message||e); process.exit(1);});
