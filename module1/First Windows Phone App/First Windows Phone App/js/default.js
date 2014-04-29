(function () {
  "use strict";

  var app = WinJS.Application;
  var activation = Windows.ApplicationModel.Activation;

  // default.html 頁面 UI 的初始化
  var init = function () {
    // initialize the canvas
    var ctx = document.getElementById('canvas').getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 400, 300);

    // 註冊相機按鈕的事件 -> 叫出 FileOpenPicker 選 jpg 檔
    var cameraBtn = document.getElementById('cmdTakePhoto');
    cameraBtn.addEventListener('click', function (evt) {
      // 使用 Windows Runtime 提供的 FileOpenPicker 元件
      var fileOpenPicker = new Windows.Storage.Pickers.FileOpenPicker();
      fileOpenPicker.viewMode = Windows.Storage.Pickers.PickerViewMode.thumbnail;
      fileOpenPicker.fileTypeFilter.replaceAll([".jpg"]);
      fileOpenPicker.pickSingleFileAndContinue();
    }, false);
  };

  app.onactivated = function (args) {
    if (args.detail.kind === activation.ActivationKind.launch) {
      if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {

      } else {

      }
      args.setPromise(WinJS.UI.processAll());

      // 初始化
      init();
    }

    // 挑完照片之後重新啟動 app，並且將選擇的檔案放在參數中
    if (args.detail.constructor === Windows.UI.WebUI.WebUIFileOpenPickerContinuationEventArgs) {
      var files = args.detail.files;
      if (files.length > 0) {
        var file = files[0];

        // 將傳回的檔案指標轉成 data URI (data:image/jpg;xxxxxxx)
        var objectURL = window.URL.createObjectURL(file, { oneTimeOnly: true });

        // 產生 HTML Image 物件來處理，以便 canvas 繪製
        var img = new Image();
        img.src = objectURL;
        img.onload = function () {
          // 畫圖
          var ctx = document.getElementById('canvas').getContext('2d');
          ctx.drawImage(img, 0, 0, 400, 300);

          // 畫字
          ctx.font = '36px Segou UI';
          ctx.fillStyle = '#000';
          ctx.fillText(document.getElementById('Text').value, 10, 200);
        };
      }
    }
  };

  app.oncheckpoint = function (args) {

  };

  app.start();
})();
