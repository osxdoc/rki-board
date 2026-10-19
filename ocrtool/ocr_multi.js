const Tesseract = require('tesseract.js');
const files = process.argv.slice(2);
(async () => {
  const worker = await Tesseract.createWorker(['deu','eng'], 1, {logger: m=>{}});
  for (const f of files) {
    const {data} = await worker.recognize(f);
    console.log("=====", f, "=====");
    console.log(data.text.trim());
  }
  await worker.terminate();
})().catch(e=>{console.error('ERR', e.message||e); process.exit(1);});
