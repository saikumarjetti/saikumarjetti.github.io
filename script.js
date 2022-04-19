let decodeImg;
if (!WebAssembly.instantiateStreaming) {
  // polyfill
  WebAssembly.instantiateStreaming = async (resp, importObject) => {
    const source = await (await resp).arrayBuffer();
    return await WebAssembly.instantiate(source, importObject);
  };
}

const go = new Go();
let mod, inst;
WebAssembly.instantiateStreaming(fetch("lib.wasm"), go.importObject).then(
  async (result) => {
    mod = result.module;
    inst = result.instance;
    await go.run(inst);
  }
);

async function run() {
  await go.run(inst);
  inst = await WebAssembly.instantiate(mod, go.importObject); // reset instance
}

let p = document.getElementById("code");

function toBase64(a) {
  return btoa(
    a.split().reduce((data, byte) => data + String.fromCharCode(byte), "")
  );
}
async function test(data) {
  console.log("result !!!!!!!!");
  let msg = document.getElementById("msg").value;
  let yourByteArrayAsBase64 = imageEncode(data, msg);
  let d = "data:image/png;base64," + yourByteArrayAsBase64;
  console.log(d);
  document.getElementById("finalImage").src = d;
  document.getElementById("download").href = d;
}

async function decodeURL(image) {
  let reader = new FileReader();
  reader.onload = (e) => {
    let data1 = e.target.result;
    let data = new Uint8Array(data1);

    let msg = imageDecode(data);
    console.log("decoded msg !!!!!!!!!!!!!!!!!!!!!");
    console.log(msg);
    document.getElementById("decodeans").innerHTML = msg;
  };
  // reader.readAsDataURL(image.files[0]);
  reader.readAsArrayBuffer(image.files[0]);
}

async function readURL(image) {
  let reader = new FileReader();
  reader.onload = (e) => {
    let data1 = e.target.result;
    let data = new Uint8Array(data1);
    // console.log(data1);
    // console.log(data.length);
    // console.log(data.byteLength);
    decodeImg = data;
    // test(data);
  };
  reader.readAsArrayBuffer(image.files[0]);
}

async function decodeImage(e) {
  test(decodeImg);
}
