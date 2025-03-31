const jsonOutput = document.getElementById("json_output");
const saveButton = document.getElementById("save_button");
const logList = document.getElementById("log_list");
const reinjectUrl = document.getElementById("reinject_url");

let currentData = null;

// URLからinjectを取得して表示
function loadInjectData() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("inject");
  if (!raw) return;

  try {
    const decoded = decodeURIComponent(raw);
    const parsed = JSON.parse(decoded);
    currentData = parsed;
    jsonOutput.textContent = JSON.stringify(parsed, null, 2);
    reinjectUrl.value = window.location.origin + "/Raven-command/?inject=" + encodeURIComponent(JSON.stringify(parsed));
  } catch (e) {
    jsonOutput.textContent = "エラー: " + e.message;
  }
}

// 保存処理
saveButton.addEventListener("click", () => {
  if (!currentData) return alert("保存できるデータがありません。");

  const logs = JSON.parse(localStorage.getItem("memory_logs") || "[]");
  logs.unshift({
    timestamp: new Date().toISOString(),
    data: currentData
  });
  localStorage.setItem("memory_logs", JSON.stringify(logs));
  updateLogList();
  alert("保存完了。");
});

// ログ一覧更新
function updateLogList() {
  logList.innerHTML = "";
  const logs = JSON.parse(localStorage.getItem("memory_logs") || "[]");
  logs.forEach((entry, i) => {
    const li = document.createElement("li");
    li.textContent = `[${entry.timestamp}] ${entry.data.name || "NoName"} (v${entry.data.version || "?"})`;
    li.onclick = () => {
      jsonOutput.textContent = JSON.stringify(entry.data, null, 2);
      currentData = entry.data;
      reinjectUrl.value = window.location.origin + "/Raven-command/?inject=" + encodeURIComponent(JSON.stringify(entry.data));
    };
    logList.appendChild(li);
  });
}

loadInjectData();
updateLogList();
