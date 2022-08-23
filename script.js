let localScreenStream;
let screenWrapperDiv = document.getElementById("screenWrapper");
let startScreenShareBtn = document.getElementById("startScreenShare");
let stopScreenShareBtn = document.getElementById("stopScreenShare");
let togglePipBtn = document.getElementById("startPIP");

togglePipBtn.hidden = !document.pictureInPictureEnabled || screenWrapperDiv.innerHTML == "";

togglePipBtn.addEventListener("click", async () => {
    let video = document.getElementById("screenShare");
    try {
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture()
        } else {
            await video.requestPictureInPicture()
        }
    } catch (err) {
        console.log(err)
    }
});

async function startScreenShare() {
    localScreenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
    });
    if (localScreenStream) {
        screen = await attachToDOM("screenShare", localScreenStream);
    }
}

async function stopScreenShare() {
    localScreenStream = null;
    screenWrapperDiv.innerHTML = "";
    togglePipBtn.hidden = !document.pictureInPictureEnabled || screenWrapperDiv.innerHTML == "";
    startScreenShareBtn.removeAttribute("style");
    stopScreenShareBtn.style.display = "none";
    if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
    }
}

async function attachToDOM(id, stream) {
    let videoElem = document.createElement("video");
    videoElem.id = id;
    videoElem.width = 640;
    videoElem.height = 480;
    videoElem.autoplay = true;
    videoElem.setAttribute("playsinline", true);
    videoElem.srcObject = new MediaStream(stream.getTracks());
    screenWrapperDiv.appendChild(videoElem);
    togglePipBtn.hidden = !document.pictureInPictureEnabled || screenWrapperDiv.innerHTML == "";
    startScreenShareBtn.style.display = "none";
    stopScreenShareBtn.removeAttribute("style");
    return videoElem;
}

startScreenShareBtn.addEventListener("click", startScreenShare);
stopScreenShareBtn.addEventListener("click", stopScreenShare);