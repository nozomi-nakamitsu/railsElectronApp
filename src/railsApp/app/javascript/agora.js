
// var client = AgoraRTC.createClient({ mode: "live", codec: "vp8", role: "host" });

// var localTracks = {
//     videoTrack: null,
//     audioTrack: null
// };
// var remoteUsers = {};
// // URLからuidを取得
// var query = location.search;
// var value = query.split('=');
// var UID = decodeURIComponent(value[1]);



// var options = {
//     appid: "2a4e9255decc40dd9e11a410e2b832bf",
//     channel_rtm: "demo",
//     channel: "test3",
//     uid: UID,
//     token: null
// };

// var camera, microphone;
// var clientRtm, channelRtm, currentMessage;
// var random = Math.floor(Math.random() * 99999) + 1;
// var uidRtm;


// var client2 = AgoraRTC.createClient({ mode: "live", codec: "vp8", role: "host" });

// var localTracks2 = {
//     videoTrack: null,
//     audioTrack: null
// };

// function login() {
//     clientRtm = AgoraRTM.createInstance(options.appid);
//     channelRtm = clientRtm.createChannel(options.channel_rtm);
//     clientRtm.on("ConnectionStateChange", function (newState, reason) {
//         console.log("on connection state changed to " + newState + " reason:" + reason);
//     });
//     uidRtm = $("#loginId").val();
//     //channelName=uidRtm;
//     options.uid = $("#loginId").val();
//     options.channel = $("#loginId").val();
//     clientRtm.login({ uid: options.uid, token: options.token }).then(function () {
//         channelRtm.join().then(function () {
//             // appendProc(options.uid, options.uid + "(you)");
//             receiveChannelMessage();
//             console.log("ログインできました");
//             $("#show-uid").text("ログインユーザーID：" + options.uid);
//             var showUserList = document.getElementById("after-logined");
//             showUserList.classList.remove("after-logined");
//             var LoginForm = document.getElementById("div_join");
//             LoginForm.classList.add("login-form");
//             var logoutBtn = document.getElementById("logout_btn");
//             logoutBtn.classList.remove("logout_btn");
//             console.log(clientRtm);
//         }).catch(function (err) {
//             console.error("AgoraRTM client join failure, ", err);
//         });
//     }).catch(function (err) {
//         console.error("AgoraRTM client login failure, ", err);
//     });


// }


// async function subscribe(user, mediaType, localTracks) {
//     if (localTracks === undefined) {
//         const uid = user.uid;
//         // subscribe to a remote user
//         await client.subscribe(user, mediaType);
//         console.log("subscribe success");
//         if (mediaType === 'video') {

//             if ($('#local-player' + uid).length === 0) {
//                 $('#local-player').append('<div id="agora_remote' + uid + '" style="float:left; width:810px;height:607px;display:inline-block;"></div>');
//             }
//             user.videoTrack.play('agora_remote' + uid);
//         }
//         if (mediaType === 'audio') {
//             user.audioTrack.play();
//         }
//     } else {
//         const uid = user.uid;
//         // subscribe to a remote user
//         await client.subscribe(user, mediaType);
//         console.log("subscribe success");
//         if (mediaType === 'video') {

//             if ($('#local-player' + uid).length === 0) {
//                 $('#local-player').append('<div id="agora_remote' + uid + '" style="float:left; width:810px;height:607px;display:inline-block;"></div>');
//             }
//             // user.videoTrack.play('agora_remote' + uid);
//             localTracks.play('agora_remote' + uid);
//         }
//         if (mediaType === 'audio') {
//             user.audioTrack.play();
//         }
//     }


// }
// function handleUserPublished(user, mediaType) {
//     const id = user.uid;
//     remoteUsers[id] = user;
//     subscribe(user, mediaType);
// }

// function handleUserUnpublished(user) {
//     const id = user.uid;
//     delete remoteUsers[id];
//     //$(`#player-wrapper-${id}`).remove();
//     $('#agora_remote' + id).remove();
// }
// async function join(channelName) {

//     // var token = null;
//     if (channelName === undefined) {
//         channelName = options.channel
//     }
//     console.log("Init AgoraRTC client with App ID: " + options.appid);
//     console.log("options.channel" + options.channel);
//     console.log("options.uid" + options.uid);
//     var uid = null;
//     setUid = $("#loginId").val();

//     // add event listener to play remote tracks when remote user publishs.
//     client.on("user-published", handleUserPublished);
//     client.on("user-unpublished", handleUserUnpublished);

//     // join a channel and create local tracks, we can use Promise.all to run them concurrently
//     [options.uid, localTracks.audioTrack, localTracks.videoTrack] = await Promise.all([
//         // join the channel
//         client.join(options.appid, channelName, options.token || null, options.uid),
//         // create local tracks, using microphone and camera
//         AgoraRTC.createMicrophoneAudioTrack(),
//         AgoraRTC.createCameraVideoTrack(),
//     ]);

//     // play local video track
//     localTracks.videoTrack.play("local-player");

//     // publish local tracks to channel
//     await client.publish(Object.values(localTracks));
//     console.log("publish success");

// }


// // 部屋から退出する
// async function leave() {
//     // document.getElementById("leave").disabled = true;
//     for (trackName in localTracks) {
//         console.log(trackName);
//         console.log(localTracks);
//         console.log(localTracks[trackName]);
//         // debugger
//         var track = localTracks[trackName];
//         if (track) {
//             track.stop();
//             track.close();
//             localTracks[trackName] = undefined;
//         }
//     }
//     // 画面共有を終了する
//     var track2 = localTracks2["videoTrack"];
//     if (track2 != null) {
//         handleTrackEnded();
//     }

//     // remove remote users and player views
//     remoteUsers = {};

//     // leave the channel
//     await client.leave();

//     // await logout();

//     // await reset();
//     console.log("client leaves channel success");
//     var showUserList = document.getElementById("after-logined");
//     showUserList.classList.remove("after-logined");
//     var LoginForm = document.getElementById("div_join");
//     LoginForm.classList.add("login-form");
//     var logoutBtn = document.getElementById("logout_btn");
//     logoutBtn.classList.remove("logout_btn");
//     // window.location.href = '/Users/nakamitsunozomi/Desktop/my-electron-app/src/AgoraWebSDK-NG/Demo/index.html?uid=' + options.uid;
//     removeVideo()
// }
// // ログインしているユーザー名を取得
// function refresh() {
//     // const clientRtm = AgoraRTM.createInstance(options.appid)
//     // const channelRtm = clientRtm.createChannel(options.channel_rtm)
//     $('#useradd').empty();
//     // var client = AgoraRTC.createClient({ mode: "live", codec: "vp8", role: "host" });
//     // var channelRtm = clientRtm.createChannel(options.channel_rtm);
//     console.log(clientRtm);
//     var result = new Promise(function (resolve) {
//         resolve(channelRtm.getMembers());
//     })
//     console.log("result:" + result);
//     result.then(function (data) {
//         for (let i = 0; i < data.length; i++) {
//             var txt;
//             if (data[i] != options.uid) {
//                 txt = data[i];
//                 $('#useradd').append('<tr><th scope="row"><span>' + txt + '</span> <button type="button" class="btn btn-success mx-3" onclick="call(\'' + txt + '\')">招待する</button></th></tr>');
//             }
//         }
//     });
// }

// // ユーザーリストの表示
// function showUserList() {
//     // refresh();
//     var showUserList = document.getElementById("user-list");
//     showUserList.classList.remove("showUserList");
// }
// function removeUserList() {
//     var showUserList = document.getElementById("user-list");
//     showUserList.classList.add("showUserList");
// }

// function sendChannelMessage(msg) {
//     // clientRtm = AgoraRTM.createInstance(options.appid);
//     // channelRtm = clientRtm.createChannel(options.channel_rtm);
//     var localMessage = msg;
//     console.log(localMessage);
//     channelRtm.sendMessage({ text: localMessage }).then(function () {
//         console.log("AgoraRTM client succeed in sending channel message: " + localMessage);
//     }).catch(function (err) {
//         console.log("AgoraRTM client failed to sending role" + err);
//     });

// }
// function sendChannelMessage2(memberId) {

//     var localMessage = "RequestCall:" + memberId;
//     $(".banner").append('<div class="alert alert-primary" role="alert">' + memberId + 'を招待しました <button type="button" class="close" data-dismiss="alert">&times;</button></div>');

//     sendChannelMessage(localMessage);
// }


// // 招待メッセージ送信
// function call(memberId) {
//     var result = confirm('Do you invite ' + memberId + '?');
//     if (result) {
//         sendChannelMessage2(memberId);
//         console.log("招待メッセージ送信");
//     }
// }



// // video画面表示
// function showVideo(channelName) {
//     console.log("new-mtg-view");
//     if (channelName === undefined) {
//         channelName = options.channel
//     }
//     join(channelName);
//     var showVideo = document.getElementById("new-mtg-view");
//     showVideo.classList.remove("new-mtg-view");
//     var afterLogined = document.getElementById("after-logined");
//     afterLogined.classList.add("after-logined");
//     $("#channelName").text("チャネル名:" + channelName);
// }
// // video画面非表示
// function removeVideo() {
//     var showVideo = document.getElementById("new-mtg-view");
//     showVideo.classList.add("new-mtg-view");
//     // var afterLogined = document.getElementById("after-logined");
//     // afterLogined.classList.add("after-logined");
// }


// function remoteJoin(uid) {
//     // client.on("user-published", async (uid, mediaType) => {
//     //     await client.subscribe(uid, mediaType);
//     //     if (mediaType === 'video') {

//     //         if ($('div#video #agora_remote' + uid).length === 0) {
//     //             $('div#video').append('<div id="agora_remote' + uid + '" style="float:left; width:810px;height:607px;display:inline-block;"></div>');
//     //         }
//     //         user.videoTrack.play('agora_remote' + uid);
//     //     }
//     //     if (mediaType === 'audio') {
//     //         user.audioTrack.play();
//     //     }
//     // });
//     showVideo(uid)
// }

// function receiveChannelMessage() {

//     channelRtm.on("MemberJoined", memberId => {
//         console.log("MemberJoined: " + memberId);
//         appendProc(memberId, memberId);
//     });

//     channelRtm.on("ChannelMessage", function (sentMessage, senderId) {
//         console.log("AgoraRTM client got message: " + JSON.stringify(sentMessage) + " from " + senderId);
//         var msgtxt = sentMessage.text
//         var result = msgtxt.split(':');
//         console.log("msg1 " + result[0]);
//         console.log("msg2 " + result[1]);
//         if (result[0] == "RequestCall") {
//             if (options.uid == result[1]) {
//                 console.log(senderId + "invited you.");
//                 $(".banner").append('<div class="alert alert-primary" role="alert">' + senderId + 'があなたを招待しました<button class="btn btn-primary" onclick="remoteJoin(\'' + senderId + '\')">参加する</button> <button type="button" class="close" data-dismiss="alert">&times;</button></div>');
//                 options.channel = senderId;
//             }
//         }


//     });
// }
// // ログアウト
// function logout() {
//     console.log("RTM Logout start ");
//     channelRtm.leave();
//     clientRtm.logout();
//     options.uid = null;
//     $(".user-info").remove();
//     var showUserList = document.getElementById("after-logined");
//     showUserList.classList.add("after-logined");
//     var LoginForm = document.getElementById("div_join");
//     LoginForm.classList.remove("login-form");
//     console.log("RTM Logout completed ");
// }

// // 配列表示
// window.onload = function () {
//     var channels = [];
//     // 配列表示
//     channels.forEach(function (channelName) {
//         console.log(channelName);
//         $("#output").append("<p>" + channelName + "</p>")
//     });
// }
// var channels = [];

// function addName() {
//     var input = document.getElementById("text_name");
//     var output = document.getElementById("output");
//     channels.push(input.value);// 配列に要素を追加
//     output.innerHTML = "";

//     // 配列の要素を先頭から順番にすべて出力
//     var i = 0;
//     while (i < channels.length) {
//         output.innerHTML += "<p id='" + channels[i] + "'> " + channels[i] + "<span class='btn btn-info m-1' onclick= showVideo(" + '"' + channels[i] + '"' + ")>参加する</span><span class='btn btn-info m-1' onclick= removeChannel(" + '"' + channels[i] + '"' + ")>削除する</span></p>";
//         i = i + 1;
//     }
// }


// function removeChannel(channelName) {
//     var remove_obj = document.getElementById(channelName);
//     console.log(remove_obj);
//     var output = document.getElementById("output");
//     channels.forEach(function (channel, index) {
//         if (channel == channelName) {
//             this.channels.splice(index, 1);
//         }
//     });
//     output.innerHTML = "";
//     // // 配列の要素を先頭から順番にすべて出力
//     var i = 0;
//     while (i < channels.length) {
//         output.innerHTML += "<p id='" + channels[i] + "'>" + channels[i] + "<span class='btn btn-info m-1' onclick= showVideo(" + '"' + channels[i] + '"' + ")>参加する</span><span class='btn btn-info m-1' onclick= (" + '"' + channels[i] + '"' + ")>削除する</span></p>";
//         i = i + 1;
//     }

// }




// // 画面共有
// async function screensharing(channelName) {

//     // var localPlayer = document.getElementById("local-player");
//     // localPlayer.classList.remove("stopScreensharing");
//     if (channelName === undefined) {
//         channelName = options.channel
//     }
//     // client.on("user-published", handleUserPublished);
//     // client.on("user-unpublished", handleUserUnpublished);

//     [localTracks2.videoTrack] = await Promise.all([
//         AgoraRTC.createScreenVideoTrack({ encoderConfig: { width: { max: 1280 }, height: { max: 720 }, frameRate: 30 } }, "disable"),
//         client2.join(options.appid, channelName, options.token || null, options.uid + "aaa"),
//     ]);
//     localTracks2.videoTrack.on("track-ended", handleTrackEnded);
//     localTracks2.videoTrack.play("local-player");

//     var stopScreensharing = document.getElementById("stopScreensharing");
//     stopScreensharing.classList.remove("stopScreensharing");
//     // publish local tracks to channel
//     await client2.publish(Object.values(localTracks2));
//     // console.log("publish success");
//     subscribe(options.uid + "aaa", "video", localTracks2);


// }




// // 画面共有停止
// async function handleTrackEnded() {
//     var track = localTracks2["videoTrack"];
//     console.log(track);
//     if (track) {
//         track.stop();
//         track.close();
//         localTracks2["videoTrack"] = undefined;
//     }
//     await client2.leave();
//     var stopScreensharing = document.getElementById("stopScreensharing");
//     stopScreensharing.classList.add("stopScreensharing");

//     // var localPlayer = document.getElementById("local-player");
//     // localPlayer.classList.add("stopScreensharing");
//     // $("#local-player-name").text("");
//     // client.unpublish(track);
//     // console.log("handleTrackEnded");
// }


// document.addEventListener('DOMContentLoaded', () => {
//     console.log('hello');
//   });



