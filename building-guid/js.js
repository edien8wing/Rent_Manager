console.info("guide start");
body = document.getElementById("all");
column = 2;
//let roomColumn = 1;
//
clear = () => {
  let childs = body.childNodes;
  for (let i = childs.length - 1; i >= 0; i--) {
    childs[i].innerHTML = "";
  }
};

addFloor = (arr, calHeight) => {
  block = document.getElementById("block_0");
  console.info(arr.length);

  for (let i = 0; i < arr.length; i++) {
    var para = document.createElement("div");
    para.id = "F" + arr[i].id;
    para.className = "floor";
    var node = document.createTextNode(arr[i].name);
    para.appendChild(node);
    para.setAttribute("style", "font-size: " + calHeight + "px");
    block.appendChild(para);
  }
};
addRoom = (arr, calHeight) => {
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i].part_B) {
      continue;
    }
    let floor = document.getElementById("F" + arr[i].floorId);
    var para = document.createElement("div");
    para.className = "room";

    var node = document.createTextNode(arr[i].part_B);

    para.appendChild(node);
    para.setAttribute("style", "font-size: " + calHeight + "px");
    floor.appendChild(para);
  }
};
addFloor_Room = (floorArr, roomArr, calHeight) => {
  let currentHeight = 0;
  let blocks = document.getElementsByClassName("block");
  let blockIndex = 0;

  for (let i = 0; i < floorArr.length; i++) {
    var floor = document.createElement("div");
    floor.id = "F" + floorArr[i].id;
    floor.className = "floor";
    var floorTextNode = document.createTextNode(floorArr[i].name);
    floor.appendChild(floorTextNode);
    floor.setAttribute("style", "font-size: " + calHeight + "px");
    let countRoom = 0;
    console.info("F", floorArr[i].id, floorArr[i].name);
    for (let j = 0; j < roomArr.length; j++) {
      if (roomArr[j].floorId == floorArr[i].id) {
        //得到当前楼层户数 和属性
        console.info("R", roomArr[j].floorId);
        countRoom++;
        var room = document.createElement("div");
        room.className = "room";
        var textRoomNode = document.createTextNode(roomArr[j].part_B);
        room.appendChild(textRoomNode);
        room.setAttribute("style", "font-size: " + calHeight + "px");
        floor.appendChild(room);
      }
    }
    let thisFloorHeight = (calHeight + 7) * countRoom + calHeight + 19 + 10;
    countRoom = 0;
    currentHeight += thisFloorHeight;
    console.info("currentHeight", currentHeight);
    if (currentHeight < window.screen.availHeight - 300) {
      blocks[blockIndex].appendChild(floor);
    } else {
      blockIndex++;
      blocks[blockIndex].appendChild(floor);
      currentHeight = thisFloorHeight;
    }
  }
};

getData = (link) => {
  let result = fetch("http://192.168.3.123:3000/api", {
    //jsonpCallbackFunction: 'search_results',
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    // body: 'fun=&type=1'
    body: link,
  });
  return result;
};
main = () => {
  clear();
  floorINfo_result = getData(floorInfoUrl);
  floorINfo_result
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      let floorArr = JSON.parse(json).data;
      //let cbox=JSON.parse(JSON.stringify(arr).replace(/name/g, 'label').replace(/id/g,'value'))  ;
      console.info(floorArr);

      json = null;
      return floorArr;
    })
    .then((floorArr) => {
      roomInfo_result = getData(roomInfoUrl);
      roomInfo_result
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          let arr = JSON.parse(json).data;
          //let cbox=JSON.parse(JSON.stringify(arr).replace(/name/g, 'label').replace(/id/g,'value'))  ;
          console.info(arr);

          json = null;
          let calHeight =
            (column * (window.screen.availHeight - 500) -
              floorArr.length * 10 -
              19 * floorArr.length -
              7 * arr.length) /
            (arr.length + floorArr.length);
          //  addFloor(floorArr, calHeight);
          //  addRoom(arr, calHeight);
          addFloor_Room(floorArr, arr, calHeight);
          console.info(
            "剩余高度",
            window.screen.availHeight,
            floorArr.length,
            calHeight
          );
        });
    });
};

let buildingData = [1];

let roomInfoUrl =
  "type=rent&fun=getContractByBuildingId&data=" +
  JSON.stringify(buildingData) +
  "&isFinished=[0]";

let floorInfoUrl =
  "type=rent&fun=getFloorByBuildingId&buildingId=" +
  JSON.stringify(buildingData);
//屏幕高度
body.setAttribute(
  "style",
  "height:" + (window.screen.availHeight - 180) + "px"
);
for (let i = 0; i < column; i++) {
  let node = document.createElement("div");

  node.id = "block_" + i;
  node.className = "block";
  node.setAttribute(
    "style",
    "width: " +
      ((window.screen.availWidth - 50) / column) * 0.9 +
      "px;height:" +
      (window.screen.availHeight - 500) +
      "px;"
  );
  body.appendChild(node);
}

//clearPage
main();
setInterval(main, 50000);
