// String Reversal
// Implement a function which given a string argument will return the provided string in reverse.

// Examples..
// Input: "hello world" Output: "dlrow olleh"
// Input: "aba" Output: "aba"
// Input: "ab" Output: "ba"
// Input: "" Output: ""

function stringReversal(string) {
  let reversedString = []

  for (let i = 0; i < string.length; i++) {
    reversedString.push(string[i])
    
  } console.log(reversedString)
}

console.log(stringReversal('hello world'))