
/* ================= CLOCK ================= */
const clock = document.getElementById("clock");

/* ================= MARKS ================= */
for(let i = 0; i < 60; i++){

    const mark = document.createElement("div");
    mark.className = "mark";

    mark.style.left = "50%";
    mark.style.top = "53%";

    mark.style.transform =
    `translate(-50%, -100%) rotate(${i * 6}deg) translateY(-200px)`;

    if(i % 5 === 0){
        mark.classList.add("big");
    }

    clock.appendChild(mark);
}

/* ================= NUMBERS ================= */
const rect = clock.getBoundingClientRect();
const centerX = rect.width / 2;
const centerY = rect.height / 2;

for(let i = 1; i <= 12; i++){

    const number = document.createElement("div");
    number.className = "number";
    number.innerText = i;

    const angle = (i - 3) * (Math.PI * 2) / 12;
    const radius = 160;

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    number.style.left = `${x - 10}px`;
    number.style.top  = `${y - 20}px`;

    clock.appendChild(number);
}

/* ================= CLOCK UPDATE ================= */
function updateClock(){

    const now = new Date();

    const sec = now.getSeconds();
    const min = now.getMinutes();
    const hr  = now.getHours();

    document.getElementById("second").style.transform =
    `translateX(-50%) rotate(${sec * 6}deg)`;

    document.getElementById("minute").style.transform =
    `translateX(-50%) rotate(${min * 6 + sec * 0.1}deg)`;

    document.getElementById("hour").style.transform =
    `translateX(-50%) rotate(${(hr % 12) * 30 + min * 0.5}deg)`;

    document.getElementById("digital").innerText =
    now.toLocaleTimeString('en-EG');

    document.getElementById("date").innerText =
    now.toLocaleDateString('ar-EG', {
        weekday:'long',
        year:'numeric',
        month:'long',
        day:'numeric'
    });
}

setInterval(updateClock, 1000);
updateClock();

/* ================= FULLSCREEN ================= */
const fullscreenBtn = document.getElementById("fullscreenBtn");

fullscreenBtn.addEventListener("click", () => {

    if(!document.fullscreenElement){
        document.documentElement.requestFullscreen();
        fullscreenBtn.style.display = "none";
    }else{
        document.exitFullscreen();
        fullscreenBtn.style.display = "block";
    }
});

document.addEventListener("fullscreenchange", () => {
    if(!document.fullscreenElement){
        fullscreenBtn.style.display = "block";
    }
});


document.addEventListener("keydown", (event) => {

    if (event.key === "1") {

        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            fullscreenBtn.style.display = "none";
        } else {
            document.exitFullscreen();
            fullscreenBtn.style.display = "block";
        }

    }

});

/* ================= APPS ================= */
function openApp(app){

    const frame = document.getElementById("googleFrame");

    if(app === "radio"){
        frame.src = "https://quran-radio.com/";
    }

    if(app === "search"){
        frame.src = "https://www.google.com/webhp?igu=1";
    }

    if(app === "youtube"){
        window.open("https://youtube.me", "_blank");
    }

    if(app === "quran"){
        window.open("https://equran.me/list.html", "_blank");
    }
}


/* ================= TIME ADJUST ================= */
function adjustTime(time, addMinutes = 0, addSeconds = 0){

    let [hours, minutes] = time.split(":").map(Number);

    const date = new Date();

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);

    /* إضافة التعديل */
    date.setMinutes(date.getMinutes() + addMinutes);
    date.setSeconds(date.getSeconds() + addSeconds);

    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");

    return `${h}:${m}`;
}



/* ================= PRAYER TIMES ================= */
async function loadPrayerTimes(){

    const res = await fetch(
        "https://api.aladhan.com/v1/timingsByCity?city=Ramallah&country=Palestine&method=4"
    );

    const data = await res.json();
    const t = data.data.timings;

    const prayers = [

    /* طرح دقيقة من الفجر */
    {name:"الفجر", time: adjustTime(t.Fajr, 2, 0)},

     /* الشروق */
    {name:"الشروق", time:adjustTime(t.Sunrise,-4,0)},

    {name:"الظهر", time: adjustTime(t.Dhuhr, -1,0)},

    /* زيادة دقيقة للعصر */
    {name:"العصر", time: adjustTime(t.Asr, -1, 0)},

    {name:"المغرب", time: adjustTime(t.Maghrib, 6, 0)},

    /* زيادة 3 دقيقة و50 ثانية للعشاء */
    {name:"العشاء", time: adjustTime(t.Isha, 3, 0)}
];

    setInterval(() => updatePrayer(prayers), 1000);
}

/* ================= FIXED LOGIC ================= */
function updatePrayer(prayers){

    const now = new Date();

    let previous = null;
    let next = null;

    /* ================= تحديد السابقة والقادمة ================= */
    for(let i = 0; i < prayers.length; i++){

        const [h, m] = prayers[i].time.split(":");

        let t = new Date();
        t.setHours(+h, +m, 0);

        if(t <= now){
            previous = { ...prayers[i], date: t };
        }

        if(t > now && !next){
            next = { ...prayers[i], date: t };
        }
    }

    /* إذا انتهت كل الصلوات → الفجر غداً */
    if(!next){

        const fajr = prayers[0];
        const [h, m] = fajr.time.split(":");

        let t = new Date();
        t.setDate(t.getDate() + 1);
        t.setHours(+h, +m, 0);

        next = { ...fajr, date: t };
    }

    /* ================= الوقت المتبقي للصلاة القادمة ================= */
    const diffNext = next.date - now;

    const nH = Math.floor(diffNext / 3600000);
    const nM = Math.floor((diffNext % 3600000) / 60000);
    const nS = Math.floor((diffNext % 60000) / 1000);

    /* ================= الوقت الماضي للصلاة السابقة ================= */
    let prevText = "لا توجد صلاة سابقة";

    if(previous){

        const diffPrev = now - previous.date;

        const pH = Math.floor(diffPrev / 3600000);
        const pM = Math.floor((diffPrev % 3600000) / 60000);
        const pS = Math.floor((diffPrev % 60000) / 1000);

        prevText = `
        مضى على ${previous.name}
        <br>
        ${pH}س ${pM}د ${pS}ث
        `;
    }

    /* ================= العرض ================= */

    document.getElementById("nextPrayer").innerHTML =
    `
    الصلاة القادمة: ${next.name}
    <br>
    المتبقي: ${nH}س ${nM}د ${nS}ث
    `;

    document.getElementById("remainingTime").innerHTML =
    prevText;

}

loadPrayerTimes();
