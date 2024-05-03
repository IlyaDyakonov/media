export default class Text {
  constructor() {
    this.errorWin = null;
  }

  addText() {
    this.enterText = document.querySelector(".enter-text");
    this.rec = document.querySelector(".record");
    this.addVoice();
    this.addVideo();
    this.enterText.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        const inputText = this.enterText.value.trim();
        if (inputText !== "") {
          this.divRec = document.createElement('div');
          this.divRec.classList.add('recordText');
          this.divRec.textContent = inputText;

          // Создаем текстовый узел для даты и времени и добавляем всю запись на стену
          const dateT = document.createElement('div');
          dateT.classList.add('recordTime');
          const dateTime = new Date().toLocaleString();
          const dateTimeNode = document.createTextNode(dateTime.slice(0, -3));
          dateT.appendChild(dateTimeNode)
          this.divRec.appendChild(dateT);
          this.rec.appendChild(this.divRec);

          this.geolocation();

          this.enterText.value = "";
        }
      }
    });
  }

  // геопозиция
  geolocation() {
    this.geoPosition = document.createElement('div');
    this.geoPosition.classList.add('recordGeo');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((data) => {
      const { latitude, longitude } = data.coords;
      const roundedLatitude = latitude.toFixed(5);
      const roundedLongitude = longitude.toFixed(5);
      const coordinat = document.createTextNode(`${roundedLatitude}, ${roundedLongitude}`);
      this.geoPosition.appendChild(coordinat);
      this.divRec.appendChild(this.geoPosition);
      this.rec.appendChild(this.divRec);
      }, (err) => {
        if (err.code === 1) {
          this.errorWin = document.createElement('div');
          this.errorWin.classList.add('error-geolocation');
          this.errorWin.classList.toggle('active');
          const errorDivOne = document.createElement('div');
          errorDivOne.classList.add('error-div');
          errorDivOne.textContent = "Что то пошло не так :(";
          const errorDivTwo = document.createElement('div');
          errorDivTwo.classList.add('error-div');
          errorDivTwo.textContent = "К сожалению, нам не удалось получить ваше местоположение, пожалуйста, дайте разрешение на использование геолокации, либо введите координаты вручную.";
          const errorDivThree = document.createElement('div');
          errorDivThree.classList.add('error-div');
          errorDivThree.textContent = "Широта и долгота через запятую. Например: 51.50851, -0.12572";
          this.errorWin.appendChild(errorDivOne);
          this.errorWin.appendChild(errorDivTwo);
          this.errorWin.appendChild(errorDivThree);

          this.inputGeo = document.createElement('input');
          this.inputGeo.classList.add('input-text');
          this.errorWin.appendChild(this.inputGeo);

          const buttonOk = document.createElement('button');
          buttonOk.classList.add('button-ok');
          buttonOk.textContent = "OK";
          this.errorWin.appendChild(buttonOk);

          const buttonCancel = document.createElement('button');
          buttonCancel.classList.add('button-cancel');
          buttonCancel.textContent = "Отмена";
          this.errorWin.appendChild(buttonCancel);
          this.divRec.appendChild(this.errorWin);
          this.rec.appendChild(this.divRec);

          buttonOk.addEventListener('click', () => {
            this.regex();
          });

          buttonCancel.addEventListener('click', () => {
            alert ('Введите геопозицию!')
          });
        }
      }, {enableHighAccuracy: true})
    }
  }

  // валидация
  regex() {
    const regex = /^\[?-?\d{1,2}.\d{5},\s?-?\d{1,2}.\d{5}\]?$/;
    const userInput = this.inputGeo.value;
    if (regex.test(userInput)) {
      const value = this.inputGeo.value;
      const valuePosition = document.createTextNode(value);
      this.geoPosition.appendChild(valuePosition);
      this.divRec.appendChild(this.geoPosition);
      this.rec.appendChild(this.divRec);
      this.errorWin.classList.toggle('active');
    } else {
      alert ('Введена не корректная геопозиция, перепроверьте данные и попробуйте ещё раз.');
    }
  }

  // аудио
  addVoice() {
    this.microIcon = document.querySelector('.microphone-icon');

  }

  // видео
  addVideo() {
    this.videoIcon = document.querySelector('.video-icon');
    this.videoPlayer = document.querySelector('.video');
    this.startStop = document.querySelector('.start-stop');
    this.stop = document.querySelector('.stop-rec');
    this.start = document.querySelector('.start-rec');

    this.videoIcon.addEventListener('click', async() => {
      this.videoPlayer.classList.toggle('active');
      this.videoIcon.classList.toggle('active');
      this.microIcon.classList.toggle('active');
      this.startStop.classList.toggle('inactive');
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        this.videoPlayer.srcObject = this.stream;
        this.videoPlayer.addEventListener('canplay', () => {
          this.videoPlayer.play();
        });

        this.recorder = new MediaRecorder(this.stream);
        const chunks = [];
        this.recorder.addEventListener('dataavailable', (event) => {
          chunks.push(event.data);
        });
        this.recorder.addEventListener('stop', () => {
          const blob = new Blob(chunks);
          this.videoPlayer.src = URL.createObjectURL(blob);
        });
        this.recorder.start();
      } catch (error) {
        console.error('Ошибка при получении видеопотока:', error);
        this.startStop.classList.toggle('inactive');
        this.videoIcon.classList.toggle('active');
        this.microIcon.classList.toggle('active');
        this.videoPlayer.classList.toggle('active');
        alert('Разрешите использование видеокамеры устройства.')
      }
    });

    this.stop.addEventListener('click', () => {
      if (this.recorder && this.recorder.state !== 'inactive') {
        this.recorder.stop();
        this.startStop.classList.toggle('inactive');
        this.videoIcon.classList.toggle('active');
        this.microIcon.classList.toggle('active');
        this.videoPlayer.classList.toggle('active');
      }
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }
    });

    this.start.addEventListener('click', () => {
      const videoElement = document.createElement('video');
      videoElement.controls = true;
      this.divRec = document.createElement('div');
      this.divRec.classList.add('recordVideo');
      this.divRec.appendChild(videoElement);

      // Создаем текстовый узел для даты и времени и добавляем всю запись на стену
      const dateT = document.createElement('div');
      dateT.classList.add('recordTime');
      const dateTime = new Date().toLocaleString();
      const dateTimeNode = document.createTextNode(dateTime.slice(0, -3));
      dateT.appendChild(dateTimeNode)
      this.divRec.appendChild(dateT);
      this.rec.appendChild(this.divRec);

      this.geolocation();

      if (this.recorder && this.recorder.state !== 'inactive') {
        this.recorder.stop();
        this.recorder.ondataavailable = (event) => {
          videoElement.src = URL.createObjectURL(event.data);
        };
      }

      this.startStop.classList.toggle('inactive');
      this.videoIcon.classList.toggle('active');
      this.microIcon.classList.toggle('active');
      this.videoPlayer.classList.toggle('active');

      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }
    });
  }
}