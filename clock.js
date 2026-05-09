const clock = document.getElementById("clock");

/* نحسب مركز الساعة الحقيقي */
const rect = clock.getBoundingClientRect();
const centerX = rect.width / 2;
const centerY = rect.height / 2;

/* التدرجات */
for(let i = 0; i < 60; i++){

    const mark = document.createElement("div");
    mark.className = "mark";

    mark.style.left = "50%";
    mark.style.top = "54%";

    mark.style.transform =
    `translate(-50%, -100%) rotate(${i * 6}deg) translateY(-200px)`;

    if(i % 5 === 0){
        mark.classList.add("big");
    }

    clock.appendChild(mark);
}

/* الأرقام */
for(let i = 1; i <= 12; i++){

    const number = document.createElement("div");
    number.className = "number";
    number.innerText = i;

    const angle = (i - 3) * (Math.PI * 2) / 12;
    const radius = 160;

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    number.style.left = `${x-10}px`;
    number.style.top = `${y-20}px`;

    clock.appendChild(number);
}
/* تحديث الساعة */
function updateClock(){

    const now = new Date();

    const sec = now.getSeconds();
    const min = now.getMinutes();
    const hr  = now.getHours();

    const secondDeg = sec * 6;
    const minuteDeg = min * 6 + sec * 0.1;
    const hourDeg   = (hr % 12) * 30 + min * 0.5;

    document.getElementById("second").style.transform =
    `translateX(-50%) rotate(${secondDeg}deg)`;

    document.getElementById("minute").style.transform =
    `translateX(-50%) rotate(${minuteDeg}deg)`;

    document.getElementById("hour").style.transform =
    `translateX(-50%) rotate(${hourDeg}deg)`;

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

/* زر ملء الشاشة */
document.getElementById("fullscreenBtn")
.addEventListener("click", () => {

    if(!document.fullscreenElement){
        document.documentElement.requestFullscreen();
    }else{
        document.exitFullscreen();
    }
});
