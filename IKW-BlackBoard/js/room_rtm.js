let handleMemberJoined = async (MemberId) => {
  console.log("A new member has joined the room:\t", MemberId);
  await addMemberToDom(MemberId);

  let members = await channel.getMembers();
  updateMemberTotal(members);

  let { name } = await rtmClient.getUserAttributesByKeys(MemberId, ["name"]);
  addBotMessageToDom(`${name} just joined the room🆕👶🏽`);
};

let addMemberToDom = async (MemberId) => {
  try {
    let { name } = await rtmClient.getUserAttributesByKeys(MemberId, ["name"]);

    let memberWrapper = document.getElementById("member__list");
    if (memberWrapper) {
      let memberItem = `<div class="member__wrapper" id="member__${MemberId}__wrapper">
                              <span class="green__icon"></span>
                              <p class="member_name">${name}</p>
                          </div>`;
      memberWrapper.insertAdjacentHTML("beforeend", memberItem);
    }
  } catch (error) {
    console.error("Error adding member to DOM:", error);
  }
};

let updateMemberTotal = async (members) => {
  let total = document.getElementById("members__count");
  if (total) total.innerText = members.length;
};

let handleMemberLeft = async (MemberId) => {
  await removeMemberFromDom(MemberId);

  let members = await channel.getMembers();
  updateMemberTotal(members);
  let { name } = await rtmClient.getUserAttributesByKeys(MemberId, ["name"]);
  addBotMessageToDom(`${name} left the room👻😿`);
};

let removeMemberFromDom = async (MemberId) => {
  let memberWrapper = document.getElementById(`member__${MemberId}__wrapper`);
  if (memberWrapper) memberWrapper.remove();
};

let getMembers = async () => {
  let members = await channel.getMembers();
  updateMemberTotal(members);

  for (let i = 0; i < members.length; i++) {
    await addMemberToDom(members[i]);
  }
};

let handleChannelMessage = async (messageData, MemberId) => {
  console.log("A new message was received");
  let data = JSON.parse(messageData.text);

  if (data.type === "chat") {
    addMessageToDom(data.displayName, data.message);
  }

  if (data.type === "user_left") {
    document.getElementById(`user-container-${data.uid}`).remove();

    if (userIdInDisplayFrame === `user-container-${uid}`) {
      displayFrame.style.display = null;
      for (let x = 0; videoFrames.length > x; x++) {
        videoFrames[x].style.height = "260px";
        videoFrames[x].style.width = "260px";
      }
    }
  }
};

let sendMessage = async (e) => {
  e.preventDefault();
  let message = e.target.message.value;
  await channel.sendMessage({
    text: JSON.stringify({
      type: "chat",
      message: message,
      displayName: displayName, // Ensure displayName is defined
    }),
  });

  addMessageToDom(displayName, message);

  e.target.reset();
};

let addMessageToDom = (name, message) => {
  let messagesWrapper = document.getElementById("messages");
  if (messagesWrapper) {
    let newMessage = `<div class="message__wrapper">
                            <div class="message__body">
                                <strong class="message__author">${name}</strong>
                                <p class="message__text">${message}</p>
                            </div>
                        </div>`;
    messagesWrapper.insertAdjacentHTML("beforeend", newMessage);

    let lastMessage = document.querySelector(
      "#messages .message__wrapper:last-child"
    );
    if (lastMessage) lastMessage.scrollIntoView({ behavior: "smooth" });
  }
};

let addBotMessageToDom = (botMessage) => {
  let messagesWrapper = document.getElementById("messages");
  if (messagesWrapper) {
    let newMessage = `<div class="message__wrapper">
              <div class="message__body__bot">
                <strong class="message__author__bot">
                  <img
                    src="images/icons/icons8-r2-d2.svg"
                    alt=""
                    width="25"
                    height="25"
                  />
                  IKWorx-Bot</strong
                >
                <p class="message__text__bot">
                  ${botMessage}
                </p>
              </div>
            </div>`;
    messagesWrapper.insertAdjacentHTML("beforeend", newMessage);

    let lastMessage = document.querySelector(
      "#messages .message__wrapper:last-child"
    );
    if (lastMessage) lastMessage.scrollIntoView({ behavior: "smooth" });
  }
};

let leaveChannel = async () => {
  await channel.leave();
  await channel.logout();
};

window.addEventListener("beforeunload", leaveChannel);
let messageForm = document.getElementById("message__form");
if (messageForm) messageForm.addEventListener("submit", sendMessage);
