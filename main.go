package main

import (
	"bytes"
	"encoding/base64"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	"image/png"
	_ "image/png"
	"log"
	"syscall/js"

	"github.com/auyer/steganography"
)

func valueToByteArray(v js.Value) []byte {
	binImage := make([]byte, v.Length())
	js.CopyBytesToGo(binImage, v)

	return binImage
}

// OpenImageFile open a image and return a image object
func OpenImageFile(imgByte []byte) (image.Image, error) {
	img, _, err := image.Decode(bytes.NewReader(imgByte))
	if err != nil {
		return nil, err
	}

	return img, nil
}
func toBase64(b []byte) string {
	return base64.StdEncoding.EncodeToString(b)
}

func add(this js.Value, i []js.Value) interface{} {
	println(i)
	return js.ValueOf(i[0].Int() + i[1].Int())
}
func imageEncode(this js.Value, i []js.Value) interface{} {

	imgArr := i[0]
	inBuf := make([]uint8, imgArr.Get("byteLength").Int())
	js.CopyBytesToGo(inBuf, imgArr)
	img, _ := OpenImageFile(inBuf)

	// bounds := img.Bounds()
	// width, height := bounds.Max.X, bounds.Max.Y
	// fmt.Println(img.Bounds().Size())
	// fmt.Println(img )
	// fmt.Printf("imbuf type = %T\n", inBuf)
	// fmt.Printf("img type = %T\n", img)

	w := new(bytes.Buffer) // buffer that will recieve the results
	err := steganography.Encode(w, img, []byte(i[1].String()))
	if err != nil {
		log.Printf("Error Encoding file %v", err)
		return ""
	}

	oi, _ := png.Decode(w)
	var buff bytes.Buffer
	png.Encode(&buff, oi)
	encodeString := base64.StdEncoding.EncodeToString(buff.Bytes())

	return js.ValueOf(encodeString)
}
func imageDecode(this js.Value, i []js.Value) interface{} {
	imgArr := i[0]
	inBuf := make([]uint8, imgArr.Get("byteLength").Int())
	js.CopyBytesToGo(inBuf, imgArr)
	img, _ := OpenImageFile(inBuf)
	// img, _ = png.Decode(inBuf)
	sizeOfMessage := steganography.GetMessageSizeFromImage(img) // retrieving message size to decode in the next line

	msg := steganography.Decode(sizeOfMessage, img) // decoding the message from the file
	return js.ValueOf(string(msg))
}

func registerCallbacks() {
	js.Global().Set("add", js.FuncOf(add))
	js.Global().Set("imageEncode", js.FuncOf(imageEncode))
	js.Global().Set("imageDecode", js.FuncOf(imageDecode))

}

// exposing to JS

func main() {
	c := make(chan struct{}, 0)

	println("WASM Go Initialized")
	// register functions
	registerCallbacks()
	<-c
}

// GOARCH=wasm GOOS=js go build -o lib.wasm main.go
