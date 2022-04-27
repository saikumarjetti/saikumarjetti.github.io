package main

import (
	"fmt"
	"unsafe"
)

func compressLZW(testStr string) []int {
	code := 256
	dictionary := make(map[string]int)
	for i := 0; i < 256; i++ {
		dictionary[string(i)] = i
	}

	currChar := ""
	result := make([]int, 0)
	for _, c := range []byte(testStr) {
		phrase := currChar + string(c)
		if _, isTrue := dictionary[phrase]; isTrue {
			currChar = phrase
		} else {
			result = append(result, dictionary[currChar])
			dictionary[phrase] = code
			code++
			currChar = string(c)
		}
	}
	if currChar != "" {
		result = append(result, dictionary[currChar])
	}
	return result
}

func decompressLZW(compressed []int) string {
	code := 256
	dictionary := make(map[int]string)
	for i := 0; i < 256; i++ {
		dictionary[i] = string(i)
	}

	currChar := string(compressed[0])
	result := currChar
	for _, element := range compressed[1:] {
		var word string
		if x, ok := dictionary[element]; ok {
			word = x
		} else if element == code {
			word = currChar + currChar[:1]
		} else {
			panic(fmt.Sprintf("Bad compressed element: %d", element))
		}

		result += word

		dictionary[code] = currChar + word[:1]
		code++

		currChar = word
	}
	return result
}

func main() {
	// fmt.Print("Enter any string :")
	testStr := "Digital communication allows its users to transfer digital data from one place to another over the network. When this data is sent from one place to another it can be intercepted by the intruders. Therefore in this digital world of communication it has become necessary to provide some protection to the data before it leaves the senders place. The techniques like Cryptography & Steganography provide such protection to the data traveling through communication channels. Cryptography scrambles the information, but it reveals the existence of information. Cryptography uses mathematical keys on secret data to encrypt the data which generates the encoded version of secret data in the same form as original data and thereby Cryptography provides security but cannot hide the existence of secret data. Steganography hides the actual existence of information so that anyone else other than the sender and recipient cannot recognize the transmission. Secret data is compressed first using the LZW algorithm before embedding it behind any cover media.  Data is compressed to reduce its size. After compression data encryption is performed to increase security. Here cryptography is blended with steganography and provides two-level security in confidential data transmission over the internet."
	// fmt.Scanln(&testStr)
	fmt.Println(len([]rune(testStr)))

	compressed := compressLZW(testStr)
	fmt.Println("\nAfter Compression :", compressed)

	uncompression := decompressLZW(compressed)
	fmt.Println("\nAfter Uncompression :", uncompression)

	fmt.Printf("a: %T, %d\n", testStr, unsafe.Sizeof("1"))
	fmt.Printf("a: %T, %d\n", compressed, unsafe.Sizeof(1))
	fmt.Printf("testStr size: %T, %d\n", testStr, unsafe.Sizeof(testStr))
	fmt.Printf("compressed size: %T, %d\n", compressed, unsafe.Sizeof(compressed))
	fmt.Printf("testStr len: %T, %d\n", testStr, len(testStr))
	fmt.Printf("compressed len: %T, %d\n", compressed, len(compressed))

}
