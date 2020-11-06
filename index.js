const colorGradients = [
    {
        to: {
            r: 0xFF,
            g: 0x00,
            b: 0x00,
        },
        from: {
            r: 0x00,
            g: 0x00,
            b: 0x77,
        }
    },
    {
        to: {
            r: 0xC0,
            g: 0x24,
            b: 0x25,
        },
        from: {
            r: 0xF0,
            g: 0xCB,
            b: 0x35,
        }
    },
    {
        to: {
            r: 0xC2,
            g: 0xE5,
            b: 0x9C,
        },
        from: {
            r: 0x64,
            g: 0xb3,
            b: 0xF4,
        }
    },
];

let bgElement;
let board;
let player1;
let player2;
let ball;
let titleCard;
let titleText;

let selectedColorGradient;
let noOfPanels;

ready = () => {
    setVariables();

    setColors();
    window.onresize = setColors;

    animateTitleCard();

    setGame();
}

setVariables = () => {
    bgElement = document.getElementById('background');
    board = document.getElementById('board');
    player1 = document.getElementById('player1');
    player2 = document.getElementById('player2');
    ball = document.getElementById('ball');
    titleCard = document.getElementById('title');
    titleText = document.getElementById('text');

    const index = Math.round(Math.random() * (colorGradients.length - 1));
    selectedColorGradient = colorGradients[index];

    const windowRatio = window.innerWidth / window.innerHeight;
    noOfPanels = Math.round(windowRatio * 5);

}

setColors = () => {
    let from = `rgba(${selectedColorGradient.from.r}, ${selectedColorGradient.from.g}, ${selectedColorGradient.from.b}, .9)`;
    let to = `rgba(${selectedColorGradient.to.r}, ${selectedColorGradient.to.g}, ${selectedColorGradient.to.b}, .9)`;
    const gradient = `linear-gradient(to bottom right, ${from}, ${to})`;
    player1.style.backgroundImage = gradient;
    player2.style.backgroundImage = gradient;
    ball.style.backgroundImage = gradient;

    titleCard.style.backgroundImage = `linear-gradient(to bottom right, ${`rgb(${selectedColorGradient.from.r}, ${selectedColorGradient.from.g}, ${selectedColorGradient.from.b})`}, ${`rgb(${selectedColorGradient.to.r}, ${selectedColorGradient.to.g}, ${selectedColorGradient.to.b})`})`;

    while (bgElement.hasChildNodes()) {
        bgElement.removeChild(bgElement.firstChild);
    }

    const rDiff = (selectedColorGradient.to.r - selectedColorGradient.from.r) / (2 * noOfPanels);
    const gDiff = (selectedColorGradient.to.g - selectedColorGradient.from.g) / (2 * noOfPanels);
    const bDiff = (selectedColorGradient.to.b - selectedColorGradient.from.b) / (2 * noOfPanels);

    let i = 0;
    while (i < noOfPanels) {
        const panel = document.createElement('div');
        panel.style.width = 100 / noOfPanels + '%';
        panel.classList.add('panel');

        const rFrom = selectedColorGradient.from.r + rDiff * i;
        const gFrom = selectedColorGradient.from.g + gDiff * i;
        const bFrom = selectedColorGradient.from.b + bDiff * i;
        const rTo = selectedColorGradient.to.r - rDiff * (noOfPanels - (i + 1));
        const gTo = selectedColorGradient.to.g - gDiff * (noOfPanels - (i + 1));
        const bTo = selectedColorGradient.to.b - bDiff * (noOfPanels - (i + 1));

        from = `rgba(${rFrom}, ${gFrom}, ${bFrom}, .9)`;
        to = `rgba(${rTo}, ${gTo}, ${bTo}, .9)`;
        panel.style.backgroundImage = `linear-gradient(${from}, ${to})`;

        panel.setAttribute('gradient', 'primary');

        bgElement.appendChild(panel);
        i++;
    }

    addScrollInteraction();
}

const isTouchDevice = () => {
    const prefixes = ['', '-webkit-', '-moz-', '-o-', '-ms-', ''];
    const mq = query => window.matchMedia(query).matches;

    if (
        'ontouchstart' in window ||
        (window.DocumentTouch && document instanceof DocumentTouch)
    ) {
        return true;
    }
    return mq(['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join(''));
};

raiseCurtain = () => {
    setTimeout(() => {
        let time = 300;
        for (let element of bgElement.children) {
            setTimeout(() => {
                element.classList.add('raise');
                element.setAttribute('gradient', 'secondary');
            }, time += 100);
        }
    }, 300);
}

addScrollInteraction = () => {
    if (isTouchDevice()) {
        raiseCurtain();
        return;
    }

    window.onwheel = (event) => {
        let progress;
        if (event.deltaY > 0) {
            progress = 1;
            for (let element of bgElement.children) {
                const gradientName = element.getAttribute('gradient');
                progress++;
                if (gradientName === 'secondary') { continue; }

                const newGradientName = gradientName === 'primary' ? 'secondary' : 'primary';
                element.classList.add('raise');
                element.setAttribute('gradient', newGradientName);
                break;
            }
        } else if (event.deltaY < 0) {
            progress = 0;
            let previousElement;
            for (let element of bgElement.children) {
                if (element.getAttribute('gradient') === 'primary') { break; }
                progress++;
                previousElement = element;
            }
            if (!previousElement) { return; }

            const gradientName = previousElement.getAttribute('gradient');
            const newGradientName = gradientName === 'primary' ? 'secondary' : 'primary';
            previousElement.classList.remove('raise');
            previousElement.setAttribute('gradient', newGradientName);
        }
    };
}

animateTitleCard = () => {
    if (isTouchDevice()) {
        titleCard.onmouseclick = (event) => {
            const x = (event.clientX - (window.innerWidth / 2)) / (window.innerWidth / 2);
            const y = (event.clientY - (window.innerHeight / 2)) / (window.innerHeight / 2);

            titleCard.style.transform = `translate(-50%, -50%) rotateX(${-20 * y}deg) rotateY(${20 * x}deg)`;
            titleCard.style.boxShadow = `${-30 * x}px ${-30 * y}px 20px 0 #000000a0`;
            titleText.style.textShadow = `${-20 * x}px ${-20 * y}px #00000050`;
        }
        return;
    }

    titleCard.onmouseenter = (event) => {
        const x = (event.clientX - (window.innerWidth / 2)) / (window.innerWidth / 2);
        const y = (event.clientY - (window.innerHeight / 2)) / (window.innerHeight / 2);

        titleCard.style.transition = 'all .5s';
        titleCard.style.transform = `translate(-50%, -50%) rotateX(${-20 * y}deg) rotateY(${20 * x}deg)`;
        titleCard.style.boxShadow = `${-30 * x}px ${-30 * y}px 20px 0 #000000a0`;

        titleText.style.transition = 'all .5s';
        titleText.style.textShadow = `${-20 * x}px ${-20 * y}px #00000050`;

        setTimeout(() => {
            titleCard.onmousemove = (event) => {
                const x = (event.clientX - (window.innerWidth / 2)) / (window.innerWidth / 2);
                const y = (event.clientY - (window.innerHeight / 2)) / (window.innerHeight / 2);

                titleCard.style.transition = 'none';
                titleCard.style.transform = `translate(-50%, -50%) rotateX(${-30 * y}deg) rotateY(${30 * x}deg)`;
                titleCard.style.boxShadow = `${-30 * x}px ${-30 * y}px 20px 0 #000000a0`;

                titleText.style.transition = 'none';
                titleText.style.textShadow = `${-30 * x}px ${-30 * y}px #00000050`;
            }
    
            titleCard.onmouseleave = (event) => {
                titleCard.onmousemove = null;

                titleCard.style.transition = 'all .5s';
                titleCard.style.transform = 'translate(-50%, -50%)';
                titleCard.style.boxShadow = `0px 0px 0px 0 #000000a0`;

                titleText.style.transition = 'all .5s';
                titleText.style.textShadow = `0px 0px #00000050`;
            };
        }, 300);
    }
}

setGame = () => {
    let game = 0;
    let games = [
        'none',
        'pong',
    ];

    board.addEventListener('click', (event) => {
        if (event.srcElement.classList.contains('icon') || event.srcElement.classList.contains('icon')) { return };

        // clean up
        switch(games[game]) {
            case 'none':
                break;
            case 'pong':
                document.getElementById('pong').style.display = 'none';
                clearInterval(pongAnimate);
                break;
        }

        // set new game
        game++;
        game %= games.length
        switch(games[game]) {
            case 'pong':
                document.getElementById('pong').style.display = 'block';
                playPong();
                return;
        }
        controllerPos = event.clientX;
    });
}

let pongAnimate;
playPong = () => {
    const ballStyle = window.getComputedStyle(ball);
    let player1Style = window.getComputedStyle(player1);
    let player2Style = window.getComputedStyle(player2);

    const ballRadius = parseInt(ballStyle.width.replace('px', '')) / 2;
    const padHeight = parseInt(player1Style.height.replace('px', ''));
    const padWidth = parseInt(player1Style.width.replace('px', ''));

    let x = window.innerWidth / 2 + ballRadius / 2;
    let y = window.innerHeight / 2 + ballRadius / 2;

    let ballMovX = 2;
    let ballMovY = 1;

    let player1XPos = window.innerWidth / 2 + padWidth / 2;
    let player1YPos = parseInt(player1Style.top.replace('px', ''));
    let player1MovX = 0;

    let controllerPos;
    board.addEventListener('mousemove', (event) => {
        controllerPos = event.clientX;
    });
    board.addEventListener('mouseleave', (event) => {
        controllerPos = undefined;
    });
    let player2XPos = window.innerWidth / 2 + padWidth / 2;
    let player2YPos = parseInt(player2Style.top.replace('px', ''));
    let player2MovX = 0;

    let playerSpeed = 10;
    let ballSpeed = 2;

    pongAnimate = setInterval(frame, 10);
    function frame() {
        // movePlayer1
        let playerDiff;
        if (y < window.innerHeight / 2) {
            playerDiff = x - player1XPos;
            if (Math.abs(playerDiff / window.innerWidth) < .01) {
                player1MovX = 0;
            } else {
                player1MovX = Math.sign(playerDiff);
            }
        } else {
            playerDiff = (window.innerWidth / 2) - player1XPos;
            if (Math.abs(playerDiff / window.innerWidth) < .01) {
                player1MovX = 0;
            } else {
                player1MovX = Math.sign(playerDiff);
            }
        }

        player1XPos += player1MovX * playerSpeed;
        if (player1XPos < padWidth / 2) player1XPos = padWidth / 2;
        if (player1XPos > window.innerWidth - padWidth / 2) player1XPos = window.innerWidth - padWidth / 2;
        player1.style.left = player1XPos + 'px';

        // movePlayer2
        if (controllerPos !== undefined) {
            playerDiff = controllerPos - player2XPos;
            if (Math.abs(playerDiff / window.innerWidth) < .01) {
                player2MovX = 0;
            } else {
                player2MovX = Math.sign(playerDiff);
            }
        } else {
            if (y > window.innerHeight / 2) {
                playerDiff = x - player2XPos;
                if (Math.abs(playerDiff / window.innerWidth) < .01) {
                    player2MovX = 0;
                } else {
                    player2MovX = Math.sign(playerDiff);
                }
            } else {
                playerDiff = (window.innerWidth / 2) - player2XPos;
                if (Math.abs(playerDiff / window.innerWidth) < .01) {
                    player2MovX = 0;
                } else {
                    player2MovX = Math.sign(playerDiff);
                }
            }
        }

        player2XPos += player2MovX * playerSpeed;
        if (player2XPos < padWidth / 2) player2XPos = padWidth / 2;
        if (player2XPos > window.innerWidth - padWidth / 2) player2XPos = window.innerWidth - padWidth / 2;
        player2.style.left = player2XPos + 'px';

        // moveBall
        if (x - ballRadius <= 0 || x + ballRadius >= window.innerWidth)  { ballMovX *= -1; }

        if (y - ballRadius <= 0 || y + ballRadius >= window.innerHeight)  { ballMovY *= -1; }

        const ballLeft = x - ballRadius;
        const ballRight = x + ballRadius;
        const ballTop = y - ballRadius;
        const ballBottom = y + ballRadius;
        const player1Left = player1XPos - padWidth / 2;
        const player1Right = player1XPos + padWidth / 2;
        const player1Top = player1YPos - padHeight;
        const player1Bottom = player1YPos + padHeight;
        const player2Left = player2XPos - padWidth / 2;
        const player2Right = player2XPos + padWidth / 2;
        const player2Top = player2YPos - padHeight / 2;
        const player2Bottom = player2YPos + padHeight / 2;

        if (ballLeft >= player1Left && ballRight <= player1Right && ballTop <= player1Bottom && ballBottom >= player1Top) {
            ballMovY *= -1;
            ballMovX = (x - player1XPos) * 10 / padWidth;
        }

        if (ballLeft >= player2Left && ballRight <= player2Right && ballBottom >= player2Top && ballTop <= player2Bottom) {
            ballMovY *= -1;
            ballMovX = (x - player2XPos) * 10 / padWidth;
        }

        ballSpeed += 0.0001;

        x += ballMovX * 1;
        y += ballMovY * ballSpeed * 2;

        ball.style.left = x + 'px';
        ball.style.top = y + 'px';
    }
}
