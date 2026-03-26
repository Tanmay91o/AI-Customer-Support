(function () {

    const api_Url = "http://localhost:3000/api/chat"
    const scriptTag = document.currentScript;
    const ownerId = scriptTag.getAttribute("data-owner-id")

    if (!ownerId) {
        console.log("owner id not found")
        return
    }

    const button = document.createElement("div")
    button.innerHTML = "💬"

    Object.assign(button.style, {
        position: "absolute",
        top: "680px",
        buttom: "20px",
        right: "24px",
        width: "56px",
        hight: "100px",
        borderRadius: "90px",
        background: "#000",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: "25px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    })

    document.body.appendChild(button)

    const box = document.createElement("div")
    Object.assign(box.style, {
        position: "absolute",
        top: "500px",
        buttom: "90px",
        right: "30px",
        width: "300px",
        hight: "50%",
        borderRadius: "15px",
        background: "#fff",
        display: "none",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        zIndex: "999999",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "Inter , system-ui , sans-serif",
    })

    box.innerHTML = `<div style="
    background:#000;
    color:#fff;
    padding:12px 14px;
    font-size:14px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    ">

    <span>Customer Support</span>
    <span id="chat-close" style="curser:pointer;font-size:16px">⛌</span>
    </div>
    
    <div id="chat-messages" style="
    flex:1;
    padding:12px;
    overflow-y:auto;
    background:#f9fafb;
    display:flex;
    flex-direction:column;
    "></div>

    <div style="
    display:flex;
    border-top:1px solid #e5e7eb;
    padding:8px;
    gap:6px;
    ">

    <input id="chat-input" type:""text style:"
    flex:1;
    padding:8px 10px;
    border:1px solid #d1d5db;
    border-radius:8px;
    font-size:13px;
    outline:none;

    "placeholder="type a message"/>
    <button id:"chat-send" style:"
    padding:8px 12px;
    border:none;
    background:#000;
    color:#fff;
    border-radius:8px;
    font-size:13px;
    coursor:pointer;
    ">send</button>
    </div>
    `
    document.body.appendChild(box)

    button.onclick = () => {
        box.style.display = box.style.display === "none" ? "flex" : "none"
    }

    document.querySelector("#chat-close").onclick = () => {
        box.style.display = "none"
    }

    const input = document.querySelector("#chat-input")
    const sendBtn = document.querySelector("#chat-send")
    const messageArea = document.querySelector("#chat-messages")

    function addMessage(text, from) {
        const bubble = document.createElement("div")
        bubble.innerHTML = text
        Object.assign(bubble.style, {
            maxWidth: "78%",
            padding: "8px 12px",
            borderRadius: "14px",
            fontSize: "13px",
            lineHeight: "1.4",
            marginBottom: "8px",
            alignSelf: from === "user" ? "flex-end" : "flex-start",
            background: from === "user" ? "#000" : "#e5e7eb",
            color: from === "user" ? "#fff" : "#111",

            /* bubble direction polish */
            borderTopRightRadius: from === "user" ? "4px" : "14px",
            borderTopLeftRadius: from === "user" ? "14px" : "4px",
        })
        messageArea.appendChild(bubble)
        messageArea.scrollTop = messageArea.scrollHeight
    }

    sendBtn.onclick = async () => {
        const text = input.value.trim()
        if (!text) {
            return
        }
        addMessage(text, "user")
        input.value = ""
        const typing = document.createElement("div")
        typing.innerHTML = "Typing..."
        Object.assign(typing.style, {
            fontSize: "12px",
            color: "#6b7280",
            marginBottom: "8px",
            alignSelf: "flex-start",
        })
        messageArea.appendChild(typing)
        messageArea.scrollTop = messageArea.scrollHeight

        try {
            const response = await fetch(api_Url, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    ownerId, message: text
                })
            })

            const data = await response.json()
            messageArea.removeChild(typing)
            addMessage(data || "something went wrong", "ai")

        } catch (error) {
            console.log(error);
            messageArea.removeChild(typing)
            addMessage(data || "something went wrong", "ai")
        }

    }

})()
