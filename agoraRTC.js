
function handleFail(error) {
    console.log(error);
}

function addVideoStream(streamId){
    console.log()
    let remoteTab = document.getElementById("remoteStream");
    let streamDiv = document.createElement("div");
    streamDiv.id = streamId;
    streamDiv.style.transform = "rotateY(180deg)";
    streamDiv.style.height = "18vh";
    streamDiv.className = "styledBorder";
    remoteTab.appendChild(streamDiv)
} 

document.getElementById("joinButton").onclick = function () {
    let username = document.getElementById("userName").value;
    let channelName = document.getElementById("channelName").value;
    let appId = "20fc27f50162422ba71af828a10f105c";
    let client = AgoraRTC.createClient({
        mode: "live",
        codec: "h264"
    })
    client.init(appId,() => console.log("AgoraRTC Client Connected"),handleFail
    )

    client.join(
        null,
        channelName,
        username,
        () =>{
            var localStream = AgoraRTC.createStream({
                video: true,
                audio: true,
            })

            localStream.init(function(){
                localStream.play("localStream")
                console.log(`App id: ${appId}\nChannel id: ${channelName}`)
                client.publish(localStream)
            })
        }
    )
    client.on("stream-added", function (event){
        console.log("Stream is Added");
        client.subscribe(event.stream,handleFail)
    })

    client.on("stream-subscribed", function(event){
        console.log("Stream is subscribed");
        let stream = event.stream;
        addVideoStream(stream.getId());
        stream.play(stream.getId());
    })
}
