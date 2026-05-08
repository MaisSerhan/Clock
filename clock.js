const clock = document.getElementById("clock");

/* إنشاء التدرجات */
for(let i=0;i<60;i++){

    const mark = document.createElement("div");
    mark.className = "mark";

    mark.style.transform =
    `translateX(-50%) rotate(${i*6}deg)`;

    if(i % 5 === 0){
        mark.style.height = "28px";
        mark.style.width = "5px";
        mark.style.opacity = "1";
    }

    clock.appendChild(mark);
}

/* إنشاء الأرقام */
for(let i=1;i<=12;i++){

    const number = document.createElement("div");

    number.className = "number";
    number.innerText = i;

    const angle = (i-3) * (Math.PI*2)/12;

    /* إبعاد الأرقام عن التدرجات */
    const radius = 156;

    const x = 210+ radius*Math.cos(angle);
    const y = 210 + radius*Math.sin(angle);

    number.style.left = `${x}px`;
    number.style.top = `${y}px`;

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

    /* التاريخ */
    const options = {
        weekday:'long',
        year:'numeric',
        month:'long',
        day:'numeric'
    };

    document.getElementById("date").innerText =
    now.toLocaleDateString('ar-EG',options);
}

setInterval(updateClock,1000);

updateClock();