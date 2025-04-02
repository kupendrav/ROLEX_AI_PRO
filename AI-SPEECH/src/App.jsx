import React, { useState, useEffect, useRef } from 'react';

const Rolex = () => {
    const [time, setTime] = useState('');
    const [batteryLevel, setBatteryLevel] = useState('');
    const [internetStatus, setInternetStatus] = useState('offline');
    const [messages, setMessages] = useState([]);
    const [setupInfo, setSetupInfo] = useState(
        JSON.parse(localStorage.getItem('rolex_setup')) || {
            name: '',
            bio: '',
            github: '',
            twitter: '',
            linkedin: '',
        }
    );
    const audioTurnOnRef = useRef(null);
    const recognition = useRef(null);
    const [showCommands, setShowCommands] = useState(false); // State to control command display
    const [showSetup, setShowSetup] = useState(!setupInfo); // State to control setup display

    const rolexComs = [
        'hi rolex',
        'what are your commands',
        'close this - to close opened popups',
        'change my information - information regarding your accounts and you',
        'are you there - to check rolexs presence',
        'shut down - stop voice recognition',
        'open google',
        'search for "your keywords" - to search on google',
        'open whatsapp',
        'open youtube',
        'play "your keywords" - to search on youtube',
        'close this youtube tab - to close opened youtube tab',
        'open firebase',
        'open netlify',
        'open twitter',
        'open my twitter profile',
        'open my linkedin profile',
        'open github',
        'open my coding profile',
        'Find my deivice',
        'loacte',
    ];

    // Time update effect
    useEffect(() => {
        const updateTime = () => {
            const date = new Date();
            const hrs = date.getHours();
            const mins = date.getMinutes();
            const secs = date.getSeconds();
            setTime(`${hrs}:${mins}:${secs}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    // Battery update effect
    useEffect(() => {
        const updateBatteryStatus = async () => {
            try {
                const batteryObject = await navigator.getBattery();
                setBatteryLevel(`${(batteryObject.level * 100).toFixed(0)}% ${batteryObject.charging ? 'Charge' : ''}`);

                const batteryInterval = setInterval(async () => {
                    const batteryObject = await navigator.getBattery();
                    setBatteryLevel(`${(batteryObject.level * 100).toFixed(0)}% ${batteryObject.charging ? 'Charge' : ''}`);
                }, 5000);

                return () => clearInterval(batteryInterval);
            } catch (error) {
                console.error('Error getting battery status:', error);
            }
        };

        updateBatteryStatus();
    }, []);

    // Internet connectivity effect
    useEffect(() => {
        const updateInternetStatus = () => {
            setInternetStatus(navigator.onLine ? 'online' : 'offline');
        };

        updateInternetStatus();
        window.addEventListener('online', updateInternetStatus);
        window.addEventListener('offline', updateInternetStatus);

        const internetInterval = setInterval(updateInternetStatus, 6000);

        return () => {
            window.removeEventListener('online', updateInternetStatus);
            window.removeEventListener('offline', updateInternetStatus);
            clearInterval(internetInterval);
        };
    }, []);

    // Speech recognition setup and handling
    useEffect(() => {
        recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

        recognition.current.onstart = () => {
            console.log('vr active');
        };

        recognition.current.onresult = (event) => {
            const current = event.resultIndex;
            const transcript = event.results[current][0].transcript.toLowerCase();

            createMsg('usermsg', transcript);
            console.log(event);

            // Command handling logic (similar to your original code)
            if (transcript.includes('hello rolex')) {
                readOut('hello sir');
            }
            if (transcript.includes('close this')) {
                readOut('closed');
                setShowCommands(false); // Hide commands
                setShowSetup(false); // Hide setup
            }
            if (transcript.includes('commands')) {
                readOut('Sir, I follow the following commands ');
                setShowCommands(true); // Show commands
            }
            if (transcript.includes('open youtube')) {
                readOut('opening youtube sir!');
                window.open('https://www.youtube.com/');
            }
            if (transcript.includes('open google')) {
                readOut('opening google sir!');
                window.open('https://www.google.com/');
            }
            if (transcript.includes('motivational')) {
                readOut('you only fail, when you stop trying!');
            }
            if (transcript.includes('drive')) {
                readOut('opening your drive sir!');
                window.open('https://drive.google.com/drive/my-drive');
            }
            if (transcript.includes('mails')) {
                readOut('checking your mails sir!');
                window.open('https://mail.google.com/mail/u/0/#inbox');
            }
            if (transcript.includes('amazon')) {
                readOut('opening amazon shopping sir!');
                window.open('https://www.amazon.in/');
            }
            if (transcript.includes('find my device')) {
                readOut('locating your device sir!');
                window.open('https://www.google.com/android/find/');
            }
            if (transcript.includes('weather today') || transcript.includes('todays weather report')) {
                readOut('here is the report');
                window.open('https://www.accuweather.com/en/in/bengaluru/204108/weather-forecast/204108');
            }
            if (transcript.includes('stocks today') || transcript.includes('stocks to buy today')) {
                readOut('here are some suggestions!');
                window.open('https://in.investing.com/equities/most-active-stocks');
            }
            if (transcript.includes('open whatsapp')) {
                readOut('Opening whats app Sir');
                window.open('https://web.whatsapp.com/');
            }
            if (transcript.includes('search for')) {
                const input = transcript.split('search for').at(-1);
                readOut(`searching for ${input}`);
                window.open(`https://www.google.com/search?q=${input}`);
            }
            if (transcript.includes('play the song')) {
                let input = transcript.split('play the song').at(-1);
                readOut(`playing ${input} from spotify`);
                input = input.replace(' ', '%20');
                window.open(`https://open.spotify.com/search/${input}`);
            }
            if (transcript.includes('play')) {
                let input = transcript.split('play').at(-1);
                readOut(`playing ${input} from youtube! sir..`);
                window.open(`https://www.youtube.com/results?search_query=${input}`);
            }
            if (transcript.includes('locate')) {
                let input = transcript.split('locate').at(-1);
                readOut(`locating ${input} from google maps`);
                input = input.replace(' ', '+');
                window.open(`https://www.google.com/maps/search/${input}/`);
            }
            if (transcript.includes('open my github profile') || transcript.includes('open my coding profile')) {
                readOut('Opening your github profile sir');
                window.open(`https://github.com/${setupInfo.github}`);
            }
            if (transcript.includes('open my linkedin profile')) {
                readOut('Opening your linkedin profile sir');
                window.open(`https://www.linkedin.com/${setupInfo.linkedin}`);
            }
            if (transcript.includes('owner')) {
                readOut(`Currently my owner is ${setupInfo.name}`);
            }
            if (transcript.includes('founder')) {
                readOut('I was created by my god kupendra sir');
            }
            if (transcript.includes('open github')) {
                readOut('Opening github sir');
                window.open('https://github.com/');
            }
            if (transcript.includes('twitter profile')) {
                readOut('opening your twitter profile sir!');
                window.open('https://twitter.com/kupendrav99');
            }
            if (transcript.includes('linkedin profile')) {
                readOut('opening your linkedin profile sir!');
                window.open('https://www.linkedin.com/in/kupendra-v2903/');
            }
        };

        recognition.current.onend = () => {
            console.log('vr deactive');
        };

        recognition.current.continuous = true;

        // Initial audio and recognition start
        audioTurnOnRef.current.play();
        audioTurnOnRef.current.addEventListener('ended', () => {
            setTimeout(() => {
                startRecognition();
                if (!setupInfo) {
                    readOut('Please fill out the form');
                }
                readOut('Ready To Go Sir');
            }, 200);
        });
    }, [setupInfo]);

    const startRecognition = () => {
        recognition.current.start();
    };

    const stopRecognition = () => {
        recognition.current.stop();
    };

    const createMsg = (who, msg) => {
        setMessages((prevMessages) => [...prevMessages, { who, msg }]);
    };

    const readOut = (message) => {
        const speech = new SpeechSynthesisUtterance();
        const allVoices = window.speechSynthesis.getVoices();
        speech.text = message;
        speech.voice = allVoices[0];
        speech.volume = 1;
        window.speechSynthesis.speak(speech);
        console.log('speaking out');
        createMsg('jmsg', message);
    };

    const handleSetupSubmit = () => {
        const setupForm = document.querySelector('.rolex_setup');
        const name = setupForm.querySelectorAll('input')[0].value;
        const bio = setupForm.querySelectorAll('input')[1].value;
        const github = setupForm.querySelectorAll('input')[2].value;
        const twitter = setupForm.querySelectorAll('input')[3].value;
        const linkedin = setupForm.querySelectorAll('input')[4].value;

        const testArr = [name, bio, github, twitter, linkedin];
        if (testArr.includes('')) {
            readOut('⚠️Please Enter your complete information');
        } else {
            localStorage.clear();
            const newSetupInfo = { name, bio, github, twitter, linkedin };
            localStorage.setItem('rolex_setup', JSON.stringify(newSetupInfo));
            setSetupInfo(newSetupInfo);
            setShowSetup(false); // Hide setup form
        }
    };

    return (
      <div className="machine bg-gradient-to-br from-gray-900 to-black via-blue-900/80 h-screen w-screen select-none overflow-hidden relative">
          <audio src="./assets/audio/power up.mp3" id="turn_on" ref={audioTurnOnRef}></audio>
  
          <div className="clock count absolute top-6 left-6 flex items-center gap-2">
              <img src="./assets/img/icons8-clock.gif" alt="" className="icon h-6 w-6 object-cover rounded-full" />
              <p id="time" className="text-white text-sm font-semibold">{time}</p>
          </div>
  
          <div className="internet count absolute top-6 right-24 flex items-center gap-2">
              <img src="./assets/img/icons8-wifi.gif" alt="" className="icon h-6 w-6 object-cover rounded-full" />
              <p id="internet" className="text-white text-sm font-semibold">{internetStatus}</p>
          </div>
  
          <div className="battery count absolute top-15 right-15 flex items-center gap-2">
              <img src="./assets/img/icons8-battery.gif" alt="" className="icon h-6 w-6 object-cover rounded-full" />
              <p id="battery" className="text-white text-sm font-semibold">{batteryLevel}</p>
          </div>
  
          {/* Data visualization (adjust styling as needed) */}
          {/* <div className="data absolute top-1/6 left-1/30 transform -translate-x-1/2 -translate-y-1/2">
              <img src="./assets/img/dataanaly.gif" alt="" className="w-80 h-60 object-contain" />
              <p id="data" className="text-gray-400 text-xs text-center"></p>
          </div> */}
  
          <img
              src="./assets/img/iron.gif"
              alt=""
              id="heart"
              className="absolute bottom-4 right-4 w-20 h-auto cursor-pointer"
              onClick={() => {
                  const audio = new Audio('assets/audio/Jarvis.mp3');
                  audio.play();
              }}
          />
          {/* <img src="./assets/img/heart.gif" alt="" id="iron_man" className="absolute bottom-4 left-4 w-20 h-auto" /> */}
  
          <div
              id="start_rolex_btn"
              title="START ROLEX"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex justify-center items-center cursor-pointer"
              onClick={startRecognition}
          >
              <div className="relative rounded-full shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-lg opacity-75 animate-pulse"></div>
                  <img src="./assets/img/super.gif" alt="" className="relative rounded-full w-48 h-48 object-contain p-4 bg-gray-900 border-2 border-cyan-400" />
              </div>
              {/* Optional pulsing glow */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-cyan-500 rounded-full blur-xl opacity-50 animate-ping"></div>
          </div>
  
          {/* User Info Setup */}
          {showSetup && (
              <div className="rolex_setup in_middle fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 rounded-xl flex justify-center flex-col z-50 items-center border-2 border-cyan-400 bg-gray-800 text-white shadow-lg">
                  <label htmlFor="name" className="text-cyan-300 text-left block mb-2">
                      Your Name
                  </label>
                  <input type="text" id="name" className="bg-gray-700 text-white border-none rounded-md py-2 px-3 w-72 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                  <br />
                  <label htmlFor="bio" className="text-cyan-300 text-left block mb-2">
                      Your Bio
                  </label>
                  <input type="text" id="bio" className="bg-gray-700 text-white border-none rounded-md py-2 px-3 w-72 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                  <br />
                  <label htmlFor="github" className="text-cyan-300 text-left block mb-2">
                      Github profile
                  </label>
                  <input type="text" id="github" className="bg-gray-700 text-white border-none rounded-md py-2 px-3 w-72 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                  <br />
                  <label htmlFor="twitter" className="text-cyan-300 text-left block mb-2">
                      Twitter profile
                  </label>
                  <input type="text" id="twitter" className="bg-gray-700 text-white border-none rounded-md py-2 px-3 w-72 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                  <br />
                  <label htmlFor="linkedin" className="text-cyan-300 text-left block mb-2">
                      Linkedin profile
                  </label>
                  <input type="text" id="linkedin" className="bg-gray-700 text-white border-none rounded-md py-2 px-3 w-72 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                  <br />
                  <br />
                  <button
                      id="sub-btn"
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white w-24 py-2 px-4 rounded-md outline-none border-none shadow-md hover:shadow-lg focus:ring-2 focus:ring-cyan-400"
                      onClick={handleSetupSubmit}
                  >
                      Submit
                  </button>
              </div>
          )}
  
          {/* Messages */}
          <div className="messages absolute bottom-4 left-1/2 transform -translate-x-1/2 w-96 h-48 overflow-y-auto whitespace-normal flex flex-col-reverse items-start justify-end pb-2 text-sm rounded-md bg-black/70 backdrop-blur-md p-4 shadow-lg">
              {messages.map((message, index) => (
                  <p
                      key={index}
                      className={`${message.who === 'usermsg'
                          ? 'usermsg text-right text-blue-300 max-w-full mb-1'
                          : 'jmsg text-left text-cyan-300 max-w-full mb-1'
                          }`}
                  >
                      {message.msg}
                  </p>
              ))}
          </div>
  
          <button id="start" style={{ display: 'none' }} onClick={startRecognition}>
              start
          </button>
          <button id="end" style={{ display: 'none' }} onClick={stopRecognition}>
              end
          </button>
          <button id="speak" style={{ display: 'none' }}>
              Speak out
          </button>
  
          {/* <div className="new_rolex_window absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <img src="./assets/img/blueiron.gif" height="230" id="jarvis_start" className="object-contain" />
          </div> */}
  
          {showCommands && (
              <div className="commands fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-xl flex justify-center flex-col z-50 items-start border-2 border-cyan-400 bg-gray-800 text-white shadow-lg">
                  <h2 className="text-cyan-400 text-lg font-semibold mb-2">Available Commands:</h2>
                  {rolexComs.map((command, index) => (
                      <p key={index} className="text-gray-300 text-sm mb-1">
                          #{command}
                      </p>
                  ))}
                  <button
                      className="mt-4 bg-gray-700 text-white py-1 px-2 rounded-md text-xs hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                      onClick={() => setShowCommands(false)}
                  >
                      Close Commands
                  </button>
              </div>
          )}
      </div>
  );
};

export default Rolex;
