
let saveKernelList = [];

function saveKernel(name, kernel){
    saveKernelList.push({"name": name, "data": kernel})
    window.localStorage.setItem("savedKernels", JSON.stringify(saveKernelList));
}

function loadKernelList() {
    if(window.localStorage.getItem("savedKernels") == null) return;
    
    saveKernelList = JSON.parse(window.localStorage.getItem("savedKernels"));
}

function getKernelList() {
    return saveKernelList;
}

loadKernelList();
