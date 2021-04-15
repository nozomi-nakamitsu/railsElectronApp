$(document).on('turbolinks:load', function() {
  var client = AgoraRTC.createClient({
    mode: "live",
    codec: "vp8",
    role: "host"
  });

  var localTracks = {
    videoTrack: null,
    audioTrack: null
  };
  var remoteUsers = {};
  // URLからuidを取得
  var query = location.search;
  var value = query.split('=');
  var UID = decodeURIComponent(value[1]);



  var options = {
    appid: "2a4e9255decc40dd9e11a410e2b832bf",
    channel_rtm: "demo",
    channel: "test3",
    uid: UID,
    token: null
  };

  var camera, microphone;
  var clientRtm, channelRtm, currentMessage;
  var random = Math.floor(Math.random() * 99999) + 1;
  var uidRtm;


  function login() {
    clientRtm = AgoraRTM.createInstance(options.appid);
    channelRtm = clientRtm.createChannel(options.channel_rtm);
    clientRtm.on("ConnectionStateChange", function (newState, reason) {
      console.log("on connection state changed to " + newState + " reason:" + reason);
    });
    uidRtm = document.getElementById("uid").innerHTML
    //channelName=uidRtm;
    options.uid = document.getElementById("uid").innerHTML
    options.channel = document.getElementById("uid").innerHTML
    clientRtm.login({
      uid: options.uid,
      token: options.token
    }).then(function () {
      channelRtm.join().then(function () {
        // appendProc(options.uid, options.uid + "(you)");
        receiveChannelMessage();
        console.log("ログインできました");
        $("#show-uid").text("ログインユーザーID：" + options.uid);
        // var showUserList = document.getElementById("after-logined");
        // showUserList.classList.remove("after-logined");
        // var LoginForm = document.getElementById("div_join");
        // LoginForm.classList.add("login-form");
        // var logoutBtn = document.getElementById("logout_btn");
        // logoutBtn.classList.remove("logout_btn");
        console.log(clientRtm);
      }).catch(function (err) {
        console.error("AgoraRTM client join failure, ", err);
      });
    }).catch(function (err) {
      console.error("AgoraRTM client login failure, ", err);
    });


  }


  async function subscribe(user, mediaType, localTracks) {
    if (localTracks === undefined) {
      const uid = user.uid;
      // subscribe to a remote user
      await client.subscribe(user, mediaType);
      console.log("subscribe success");
      if (mediaType === 'video') {

        if ($('#local-player' + uid).length === 0) {
          $('#local-player').append('<div class="player arrange" id="agora_remote' + uid +
            '" style="float:left; height:100%;"></div>');
        }
        user.videoTrack.play('agora_remote' + uid);
        var trackId = user.videoTrack.getTrackId();
        console.log(trackId);
        console.log(user);
        $("[id*='agora-video-player-" + trackId + '\'' + ']').append('<div class="badge badge-pill badge-dark">' +
        uid + '</div>');
        $("[id*='agora-video-player-" + trackId + '\'' + ']').append(`'<a id="reaction${uid}" class="reaction"></a>'`);
        $("[id*='agora-video-player-" + trackId + '\'' + ']').append(`'<img src="/assets/screensizebtn.png" width="20" height="20" class="screenSizeBtn" id=${trackId}>'`);
        $("#"+trackId).on('click', function() {
          makeLocalScreenLarge(trackId,uid);
        });
        showChannelMemberslist(uid);
      }
      if (mediaType === 'audio') {
        user.audioTrack.play();
      }
    } else {
      const uid = user.uid;
      // subscribe to a remote user
      await client.subscribe(user, mediaType);
      console.log("subscribe success");
      if (mediaType === 'video') {

        if ($('#local-player' + uid).length === 0) {
          $('#local-player').append('<div class="player" id="agora_remote' + uid +
            '" style="float:left; height:100%;"></div>');
        }
        user.videoTrack.play('agora_remote' + uid);
        localTracks.play('agora_remote' + uid);
        var trackId = user.videoTrack.getTrackId();
        $("[id*='agora-video-player-" + trackId + '\'' + ']').append('<div class="badge badge-pill badge-dark">' +
        uid + '</div>');
        $("[id*='agora-video-player-" + trackId + '\'' + ']').append(`'<a id="reaction${uid}" class="reaction"></a>'`);
        $("[id*='agora-video-player-" + trackId + '\'' + ']').append(`'<img src="/assets/screensizebtn.png" width="20" height="20" class="screenSizeBtn" id=${trackId}>'`);
        $("#"+trackId).on('click', function() {
          makeLocalScreenLarge(trackId);
        });
        console.log(user);
        showChannelMemberslist(uid);
      }
      if (mediaType === 'audio') {
        user.audioTrack.play();
      }
    }


  }

  function handleUserPublished(user, mediaType) {
    const id = user.uid;
    remoteUsers[id] = user;
    subscribe(user, mediaType);
  }

  function handleUserUnpublished(user) {
    const id = user.uid;
    delete remoteUsers[id];
    //$(`#player-wrapper-${id}`).remove();
    $('#agora_remote' + id).remove();
    $(".makeScreenLarge").remove();
    // 参加者一覧から名前削除
      removeChannelMemberslist(user.uid)
  }
  async function join(channelName) {

    // var token = null;
    if (channelName === undefined) {
      channelName = options.channel
    }
    console.log("Init AgoraRTC client with App ID: " + options.appid);
    console.log("options.channel" + options.channel);
    console.log("options.uid" + options.uid);
    var uid = null;
    // setUid = $("#loginId").val();

    // add event listener to play remote tracks when remote user publishs.
    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);

    // join a channel and create local tracks, we can use Promise.all to run them concurrently
    [options.uid, localTracks.audioTrack, localTracks.videoTrack] = await Promise.all([
      // join the channel
      client.join(options.appid, channelName, options.token || null, options.uid),
      // create local tracks, using microphone and camera
      AgoraRTC.createMicrophoneAudioTrack(),
      AgoraRTC.createCameraVideoTrack(),
    ]);

    // play local video track
    localTracks.videoTrack.play("local-player");
    showMyUid();
    // publish local tracks to channel
    console.log(Object.values(localTracks));
    await client.publish(Object.values(localTracks));
    console.log("publish success");

  }


  // 部屋から退出する
  async function leave() {
    console.log(localTracks);
    const processA = async function () {
         //  ビデオを終了する
        console.log(localTracks.videoTrack);
        var trackVideo = localTracks.videoTrack
        if (trackVideo) {
          trackVideo.stop();
          trackVideo.close();
          trackVideo = undefined;
          clientRtm
        }
         //  音声を終了する
        console.log(localTracks.audioTrack);
        var trackAudio = localTracks.audioTrack
        if (trackAudio) {
          trackAudio.stop();
          trackAudio.close();
          trackAudio = undefined;
          clientRtm
        }
    }

    const processB = async function () {
      // remove remote users and player views
      remoteUsers = {};

      // leave the channel
      await client.leave();
    }

    const processC = async function () {
      console.log("client leaves channel success");
      var showUserList = document.getElementById("after-logined");
      showUserList.classList.remove("after-logined");
      // home戻るボタンを非表示
      var redirectToHome = document.getElementById("home");
      redirectToHome.classList.add("showHome");
      $("#channelName").text("チャネル名:" + channelName);
      removeVideo()
    
    }
    // ABCの順番で処理を回す
    const processAll = async function () {
      await processA()
      await processB()
      await processC()
    }

    processAll()
    console.log( $('#agora_remote' +  options.uid + "scree").length);
    window.location.reload();
  }
  // ログインしているユーザー名を取得
  async function refresh() {
    $('#useradd').empty();
    console.log(clientRtm);
    var result = new Promise(function (resolve) {
      resolve(channelRtm.getMembers());
    })
    console.log("result:" + result);
    result.then(function (data) {
      for (let i = 0; i < data.length; i++) {
        var txt;
        if (data[i] != options.uid) {
          txt = data[i];
        $('#useradd').append(`<tr><th scope="row"><span id="senderId">${txt}</span> <button type="button" class="btn btn-success mx-3" id="${txt}${i}" >招待する</button></th></tr>`)
        }
        (function (n) {
          $("#"+txt + i).click(function(){
               call(n);
          });
      })(txt);
      }
    });
  }

  // ユーザーリストの表示
  function showUserList() {
    refresh();
    var showUserList = document.getElementById("user-list");
    showUserList.classList.remove("showUserList");
  }
  // ユーザーリストの非表示にする
  function removeUserList() {
    var showUserList = document.getElementById("user-list");
    showUserList.classList.add("showUserList");
  }
  //「 招待されました」メッセージをリモート側に送信
  function sendChannelMessage(msg) {
    var localMessage = msg;
    console.log(localMessage);
    channelRtm.sendMessage({
      text: localMessage
    }).then(function () {
      console.log("AgoraRTM client succeed in sending channel message: " + localMessage);
    }).catch(function (err) {
      console.log("AgoraRTM client failed to sending role" + err);
    });
  }

  //「 招待しましたメッセージをローカルに表示
  function sendChannelMessage2(memberId) {
    var localMessage = "RequestCall:" + memberId;
    $(".banner").append('<div class="alert alert-primary" role="alert">' + memberId +
      'を招待しました <button type="button" class="close" data-dismiss="alert">&times;</button></div>');
    sendChannelMessage(localMessage);
  }

  // 招待メッセージ送信
  function call(memberId) {
    var result = confirm('Do you invite ' + memberId + '?');
    if (result) {
      sendChannelMessage2(memberId);
      console.log("招待メッセージ送信");
    }
  }

  // video画面表示
  function showVideo(channelName) {
    console.log("new-mtg-view");
    if (channelName === undefined) {
      channelName = options.channel
    }
    join(channelName);
    var showVideo = document.getElementById("new-mtg-view");
    showVideo.classList.remove("new-mtg-view");
    var afterLogined = document.getElementById("after-logined");
    afterLogined.classList.add("after-logined");
    // home戻るボタンを表示
    var redirectToHome = document.getElementById("home");
    redirectToHome.classList.remove("showHome");
    $("#channelName").text("チャネル名:" + channelName);
  }
  // video画面非表示
  function removeVideo() {
    var showVideo = document.getElementById("new-mtg-view");
    showVideo.classList.add("new-mtg-view");
  }

  // 他人のチャンネルに参加する
  async function remoteJoin(uid) {
    await showVideo(uid);
    await $(".banner").remove();

  }
  //「 招待されました」メッセージをリモートで表示
  function receiveChannelMessage() {
    channelRtm.on("MemberJoined", memberId => {
      console.log("MemberJoined: " + memberId);
      appendProc(memberId, memberId);
    });
    channelRtm.on("ChannelMessage", function (sentMessage, senderId) {
      console.log("AgoraRTM client got message: " + JSON.stringify(sentMessage) + " from " + senderId);
      var msgtxt = sentMessage.text
      var result = msgtxt.split(':');
      console.log("msg1 " + result[0]);
      console.log("msg2 " + result[1]);
      if(result[1]===undefined){
        $("#reaction"+senderId).text(result[0]);
        $(function(){
          setTimeout(function(){
            $("#reaction"+senderId).text("");
          },10000);
      });
      }
      if (result[0] == "RequestCall") {
        if (options.uid == result[1]) {
          console.log(senderId + "invited you.");
          $(".banner").append('<div class="alert alert-primary" role="alert">' + senderId +
            'があなたを招待しました<button class="btn btn-primary remoteJoin")">参加する</button> <button type="button" class="close" data-dismiss="alert">&times;</button></div>'
          );
          options.channel = senderId;
          $('.remoteJoin').on('click', function() {
            remoteJoin(senderId);
          });
        }
      }
    });
  }
  // ログアウト
  function logout() {
    console.log("RTM Logout start ");
    channelRtm.leave();
    clientRtm.logout();
    options.uid = null;
    $(".user-info").remove();
    var showUserList = document.getElementById("after-logined");
    showUserList.classList.add("after-logined");
    console.log("RTM Logout completed ");
  }

  // index.htmlが表示されたときの動作
  window.onload = function () {
    var channels = [];
    // チャンネル配列表示
    channels.forEach(function (channelName) {
      console.log(channelName);
      $("#output").append("<p>" + channelName + "</p>")
    });
    //チャンネルへのログインする
    login();
    // ログアウト処理
    $("#logout").on("confirm:complete", function (e) {
      if (e.originalEvent.detail[0]) {
        // user confirmed!
        logout();
      } else {
        // user canceled!
        console.log("ログアウトしてない");
      }
    });
    // ホーム画面へのリダイレクト処理
    $("#home").on("confirm:complete", function (e) {
      if (e.originalEvent.detail[0]) {
        leave();
      } else {
        console.log("ホームに戻らない🥺");
      }
    });
  }

  // 新規チャンネルを作成
  var channels = [];
  function addName() {
    var input = document.getElementById("text_name");
    var output = document.getElementById("output");

    if (isHanEisu(input.value)) {
      channels.push(input.value); // 配列に要素を追加
      output.innerHTML = "";

      // 配列の要素を先頭から順番にすべて出力
      var i = 0;
      while (i < channels.length) {
        output.innerHTML += "<p class='getChanneName' id='" + channels[i] + "'> " + channels[i] +
          "<span class='btn btn-info m-1 joinVideo'>参加する</span><span class='btn btn-info m-1 removeChannel'>削除する</span></p>"
        i = i + 1;
      }

      $('\'' +  channels[i] +'\'').on('click', function() {
        // const target = document.querySelector('.getChanneName');
        // console.log(target.id);
        showVideo(channels[i]);
      });
      $('.removeChannel').on('click', function() {
        const target = document.querySelector('.getChanneName');
        console.log(target.id);
        removeChannel(target.id,channels);
      });
    } else {
      $(".banner").append(
        '<div class="alert alert-danger" role="alert">チャンネル名は半角英数字で記入してくださいね🥺<button type="button" class="close" data-dismiss="alert">&times;</button> </div>'
      );
    }


  }
  // チャンネルを削除
  function removeChannel(channelName,channels) {
    var remove_obj = document.getElementById(channelName);
    console.log(remove_obj);
    var output = document.getElementById("output");
    channels.forEach(function (channel, index) {
      if (channel == channelName) {
        channels.splice(index, 1);
      }
    });
    output.innerHTML = "";
    // // 配列の要素を先頭から順番にすべて出力
    var i = 0;
    while (i < channels.length) {
      output.innerHTML += "<p class='getChanneName' id='" + channels[i] + "'> " + channels[i] +
      "<span class='btn btn-info m-1 joinVideo'>参加する</span><span class='btn btn-info m-1 removeChannel'>削除する</span></p>";
      i = i + 1;
    }
  }


  // 画面共有
  async function shareScreen() {
    const screenClient = AgoraRTC.createClient({ mode: "live", codec: "h264", role: 'host' });
      var myShareUid = await screenClient.join(options.appid, options.channel, options.token || null, options.uid + "screen");
      const screenTrack = await AgoraRTC.createScreenVideoTrack();
      await screenClient.publish(screenTrack);
      console.log('screenTrack', screenTrack)
    // 画面共有終了ボタン表示
      var stopScreensharing = document.getElementById("stopScreensharing");
      stopScreensharing.classList.remove("stopScreensharing");
      console.log(screenTrack);
      $('#stopScreensharing').on('click', function() {
        unPublish(screenTrack);
      });
      $('#leave').on('click', function() {
        finishscreen(screenTrack,screenClient);
      });
      return
}


  //画面共有ON機能
  async function screenON(screenTrack) {
    await screenTrack.setEnabled(true);
    console.log("画面ON");
    // 画面共有終了ボタン再表示
    var stopScreensharing = document.getElementById("stopScreensharing");
    stopScreensharing.classList.remove("stopScreensharing");
  }

  // 画面共有一時停止
  async function unPublish(screenTrack) {
    screenTrack.setEnabled(false);
    console.log(screenTrack);

    // 画面共有終了ボタン非表示
    var stopScreensharing = document.getElementById("stopScreensharing");
    stopScreensharing.classList.add("stopScreensharing");

    // 画面共有ボタン非表示
      var stopScreensharing = document.getElementById("screensharing");
      stopScreensharing.classList.add("stopScreensharing");
    // 画面共有ボタン再表示
    var stopScreensharing = document.getElementById("Rescreensharing");
    stopScreensharing.classList.remove("stopScreensharing");
    $('#Rescreensharing').on('click', function() {
      screenON(screenTrack);
      console.log("画面ON");
  });
  }
  // 退出時の画面共有終了処理
  async function finishscreen(screenTrack,screenClient) {
    console.log(screenTrack);
   await screenTrack.stop();
   await screenTrack.close();
   screenTrack = undefined;
   await screenClient.leave();
   if( $('#agora_remote' +  options.uid + "scree").length>=1){
    $("[id*='scree']").remove();
   }
}


  // POPUP表示
  function subWindow() {
    try {
      ipcRenderer.send('add-todo-window');
    } catch (error) {
      console.log("ボタンうごかんぜよ")
      const url = 'index.html'
      window.open(url, '_blank')
    }
  }

  // ローカルでのミュート機能
  function muteON() {
    const level = localTracks.audioTrack.getVolumeLevel();
    console.log("local stream audio level", level);
    const mute = localTracks.audioTrack.setVolume(0);
    var muteON = document.getElementById("muteON");
    muteON.classList.add("stopScreensharing");
    var muteOFF = document.getElementById("muteOFF");
    muteOFF.classList.remove("stopScreensharing");
    console.log("local stream audio level", mute);
  }

  // ローカルでのミュート解除機能
  function muteOFF() {
    const level = localTracks.audioTrack.getVolumeLevel();
    console.log("local stream audio level", level);
    const mute = localTracks.audioTrack.setVolume(100);
    console.log("local stream audio level", mute);
    var muteOFF = document.getElementById("muteOFF");
    muteOFF.classList.add("stopScreensharing");
    var muteON = document.getElementById("muteON");
    muteON.classList.remove("stopScreensharing");
  }


  //ビデオOFF機能
  async function videoOFF() {
    await localTracks.videoTrack.setEnabled(false);
    console.log("ビデオOFF");
    var videoOFF = document.getElementById("videoOFF");
    videoOFF.classList.add("stopScreensharing");
    var videoON = document.getElementById("videoON");
    videoON.classList.remove("stopScreensharing");
    await showMyUid();
    await showUserUid();
    var trackId=localTracks.videoTrack.getTrackId();
    await   $("#"+trackId).on('click', function() {
      makeLocalScreenLarge(trackId);
    });
  }
  //ビデオON機能
  async function videoON() {
    await localTracks.videoTrack.setEnabled(true);
    var videoOFF = document.getElementById("videoOFF");
    videoOFF.classList.remove("stopScreensharing");
    var videoON = document.getElementById("videoON");
    videoON.classList.add("stopScreensharing");
    console.log("ビデオON");
    await showMyUid();
    await showUserUid();
    var trackId=localTracks.videoTrack.getTrackId();
    $("#"+trackId).on('click', function() {
      makeLocalScreenLarge(trackId);
    });
  }
  // チャンネル名が半角英数字かチェックする
  function isHanEisu(str) {
    str = (str == null) ? "" : str;
    if (str.match(/^[A-Za-z0-9]*$/)) {
      return true;
    } else {
      return false;
    }
  }

  // ローカルUIDをビデオ表示時に表示
  async function showMyUid() {
    $(".badge").remove();
    // trackID取得
    var trackId = localTracks.videoTrack.getTrackId();
    $("[id*='agora-video-player-" + trackId + '\'' + ']').append('<div class="badge badge-pill badge-dark">' +
      options.uid + '(あなた)</div>');
    if($('#'+trackId).length){
    $("#" +trackId).remove();
    }
    $("[id*='agora-video-player-" + trackId + '\'' + ']').append(`'<img src="/assets/screensizebtn.png" width="20" height="20" class="screenSizeBtn" id=${trackId}>'`);
    await $("#"+trackId).on('click', function() {
      makeLocalScreenLarge(trackId);
    });
    $("[id*='agora-video-player-" + trackId + '\'' + ']').addClass("arrange");
  }

  // リモートユーザーのUIDをビデオ表示時に表示
    async function showUserUid() {
      for (let key in remoteUsers) {
        console.log('key:' + key + ' value:' + remoteUsers[key].videoTrack);
        var trackId=remoteUsers[key].videoTrack
        $("[id*='agora-video-player-" + trackId + '\'' + ']').append('<div class="badge badge-pill badge-dark">' +
        key + '</div>');
        if($('#'+trackId).length){
          $("#" +trackId).remove();
          }
        $("[id*='agora-video-player-" + trackId + '\'' + ']').append(`'<img src="/assets/screensizebtn.png" width="20" height="20" class="screenSizeBtn" id=${trackId}>'`);
        await $("#"+trackId).on('click', function() {
          makeLocalScreenLarge(trackId,key);
        });
      }
    }
  // メンバーリストに名前表示
  function showChannelMemberslist(uid){
    $(".member-list").append(`<li class="nav-item my-auto" id=${uid}><p class="navbar-text mx-2 my-auto">${uid}</p></li>`);
  }
  // メンバーリストに名前非表示
  function removeChannelMemberslist(uid){

    $("#"+uid).remove();
  }



    //画面サイズ変更
    async function makeLocalScreenLarge(trackId,uid){
      // 今大きい物を小さくする
      const makeSmall = async function () {
        await $(".makeScreenLarge").appendTo("#local-player");
        await $(".makeScreenLarge").addClass("arrange");
        await $(".makeScreenLarge").removeClass("makeScreenLarge");
      }
      // 選んだ物を大きくする
      const makeLarge = async function () {
        $("[id*='agora-video-player-" + trackId + '\'' + ']').prependTo("#local-player");
        $("[id*='agora-video-player-" + trackId + '\'' + ']').removeClass("arrange");
        $("[id*='agora-video-player-" + trackId + '\'' + ']').addClass("makeScreenLarge");

      }
      const removeDefaltElement = async function () {
        if(!(uid==undefined)){
          $("#"+"agora_remote"+uid).remove();
        }
      }

      // 順番で処理を回す
      const processAll = async function () {
        if($(".makeScreenLarge").length){
          await makeSmall();
        }
        await makeLarge();
        await removeDefaltElement();
      }
      processAll();
    }
  // ギャラリー表示
  async function gallery() {
    await $(".makeScreenLarge").appendTo("#local-player");
    await $(".makeScreenLarge").addClass("arrange");
    await $(".makeScreenLarge").removeClass("makeScreenLarge");
  }
// グッド表示
  function good (){
    // ローカルでリアクションボタンを押す
    channelRtm.sendMessage({
      text: "👍"
    }).then(function () {
      console.log("AgoraRTM client succeed in sending channel message: 👍" );
    }).catch(function (err) {
      console.log("AgoraRTM client failed to sending role" + err);
    });
  }

// ピエン表示
  function pien (){
    // ローカルでリアクションボタンを押す
    channelRtm.sendMessage({
      text: "🥺"
    }).then(function () {
      console.log("AgoraRTM client succeed in sending channel message: 🥺" );
    }).catch(function (err) {
      console.log("AgoraRTM client failed to sending role" + err);
    });
  }
  // リアクションリストの表示・非表示の切り替え
  function reactionCreate(){
    const reactionsList = document.getElementById("reactionsList");
    if(reactionsList.style.display=="flex"){
      // noneで非表示
      reactionsList.style.display ="none";
    }else{
      // blockで表示
      reactionsList.style.display ="flex";
    }
  }



  //イベント呼び出し
  $('#showVideo').on('click', function() {
    showVideo();
  });
  $('#addName').on('click', function() {
    addName();
  });

  $('#leave').on('click', function() {
    leave();
  });

  $('#showUserList').on('click', function() {
    showUserList();
  });

  $('#screensharing').on('click', function() {
    shareScreen();
  });

  $('#muteON').on('click', function() {
    muteON();
  });

  $('#muteOFF').on('click', function() {
    muteOFF();
  });
  $('#videoOFF').on('click', function() {
    videoOFF();
  });
  $('#videoON').on('click', function() {
    videoON();
  });
  $('#removeUserList').on('click', function() {
    removeUserList();
  });

  $('#scre').on('click', function() {
    showUserUid();
  });
  $('#gallery').on('click', function() {
    gallery();
  });
  $('#good').on('click', function() {
    good();
  });
  $('#pien').on('click', function() {
    pien();
  });
  $('#reactionCreate').on('click', function() {
    reactionCreate();
  });

});


