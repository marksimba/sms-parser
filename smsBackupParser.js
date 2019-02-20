var fs = require('fs');

function identifyUsers(sender, receiver, value){
    if(value ==='2'){
        return sender
    }
    else{
        return receiver
    }
}

function lastWhiteSpace(string, i){
    while(i>-1) {
        if (string[i] == " ") {
            return i+1
        }
        else {
            i--
        }
    }

}

function getKeysFromXml(string){
    let ary = []

    let keyStart = null
    let keyEnd = null
    for(var i =0; i<string.length; i++){
        let value = string[i]
        if(value === "="){ //The delimiter between key/value
            keyStart = lastWhiteSpace(string, i)
            keyEnd = i
            ary.push(string.slice(keyStart, keyEnd))
        }

    }
    return ary
}

function parse(string){
    let obj={}

    let keys = getKeysFromXml(string)
    let value = null
    let valueStart = null
    let valueEnd = null
    for(var i=0; i<keys.length; i++){
        let key = keys[i]
        valueStart = string.search(`${key}=`)+key.length +2 //Finds the string index of the key, and adds the key length, to get the value Start index + 2 (To get the =" as well)
        if(i===keys.length-1){ //Handles the last iteration
            valueEnd = string.length-2
        }
        else {
            valueEnd = string.search(`${keys[i + 1]}=`)-2 //Finds the next key and then subtracts 2
        }
        let value = string.slice(valueStart, valueEnd)
        obj[key]=value
    }
    return obj
}

function formatMessage(array, sms, sender, receiver){
    array.push("***********************************************\n")
    array.push( `From: ${identifyUsers(sender, receiver, sms.type)}`)
    array.push(`Date: ${sms.readable_date}`)
    array.push(`Message: ${sms.body}\n`)

    return array
}

let file = process.argv[2]
let sender = process.argv[3]
let receiver = process.argv[4]

fs.readFile( file, "utf8", function(err, data) {
    data = data.split("/>")

    let smsAry = []
    let readableArry = []

    for(var i=0; i< data.length; i++){
        let line = data[i]
        let sms = parse(line)

        //Output format
        formatMessage(readableArry, sms, sender, receiver)

        //adds to json Array
        smsAry.push(sms)
    }

    let newFile = `${sender}-----${receiver}.txt`

    fs.writeFile(newFile, readableArry.join("\n"), function(){
        console.log("Conversion complete!")
    })

});


