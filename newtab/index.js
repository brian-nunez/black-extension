const storage = {
  getItems: (arr, cb) => chrome.storage.sync.get(arr, cb),
  setItems: (o, cb = () => {}) => chrome.storage.sync.set(o, cb),
};

function updateMessage(message) {
  const elements = document.querySelectorAll('[data-message]');
  elements.forEach(el => el.innerText = message);
}

function timeSetup(type) {
  const time = document.querySelector('#time');
  let timeType = type;
  const toggleType = (t = timeType) => {
    timeType = t === 'm' ? 'n' : 'm';
    setTime();
    storage.setItems({ timeType });
  };

  function getTime() {
    const date = new Date();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const formatHour = (hour) => {
      if (timeType === 'm' || hour < 12) {
        return hour;
      } else {
        return hour - 12;
      }
    }
    const formatMinute = (minutes) => {
      if (minutes < 10) return `0${minutes}`;
      return minutes;
    }
    return `${formatHour(hour)}:${formatMinute(minutes)}`;
  }

  function setTime() {
    time.innerText = getTime();
  }

  function startInterval(t = 1000) {
    return setInterval(() => {
      setTime();
    }, t);
  }

  setTime();

  let interval = startInterval();

  time.addEventListener('click', () => {
    toggleType();
    clearInterval(interval);
    interval = startInterval();
  });
}

function messageListener() {
  document.querySelector('#heading').addEventListener("blur", (e) => {
    console.log(e);
    message = e.target.textContent;
    updateMessage(e.target.textContent);
    storage.setItems({ message: e.target.textContent });
  }, false);
}

window.addEventListener('load', () => {
  storage.getItems(['message', 'timeType'], ({ message, timeType }) => {
    updateMessage(message || "Welcome");
    messageListener();
    timeSetup(timeType || 'n');
  });
});