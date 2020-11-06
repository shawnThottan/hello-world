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
let siPlayer

let controllerPos;

let selectedColorGradient;
let noOfPanels;

ready = () => {
    setVariables();

    setColors();

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
    siPlayer = document.getElementById('siPlayer');

    const index = Math.round(Math.random() * (colorGradients.length - 1));
    selectedColorGradient = colorGradients[index];

    const windowRatio = window.innerWidth / window.innerHeight;
    noOfPanels = Math.round(windowRatio * 5);

    board.addEventListener('mousemove', (event) => {
        controllerPos = event.clientX;
    });
    board.addEventListener('mouseleave', (event) => {
        controllerPos = undefined;
    });
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
            }, time += 200);
        }
    }, 600);
}

addScrollInteraction = () => {
    raiseCurtain();

    if (isTouchDevice()) {
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
    const move = (event) => {
        const xPos = event.clientX || event.touches[0].clientX;
        const yPos = event.clientY || event.touches[0].clientY;
        const x = (xPos - (window.innerWidth / 2)) / (window.innerWidth / 2);
        const y = (yPos - (window.innerHeight / 2)) / (window.innerHeight / 2);

        titleCard.style.transition = 'none';
        titleCard.style.transform = `translate(-50%, -50%) rotateX(${-30 * y}deg) rotateY(${30 * x}deg)`;
        titleCard.style.boxShadow = `${-30 * x}px ${-30 * y}px 20px 0 #000000a0`;

        titleText.style.transition = 'none';
        titleText.style.textShadow = `${-30 * x}px ${-30 * y}px #00000050`;

        event.preventDefault();
    };

    const end = (event) => {
        titleCard.onmousemove = null;

        titleCard.style.transition = 'all .5s';
        titleCard.style.transform = 'translate(-50%, -50%)';
        titleCard.style.boxShadow = `0px 0px 0px 0 #000000a0`;

        titleText.style.transition = 'all .5s';
        titleText.style.textShadow = `0px 0px #00000050`;
    };

    titleCard.ontouchstart = titleCard.onmouseenter = (event) => {
        const xPos = event.clientX || event.touches[0].clientX;
        const yPos = event.clientY || event.touches[0].clientY;
        const x = (xPos - (window.innerWidth / 2)) / (window.innerWidth / 2);
        const y = (yPos - (window.innerHeight / 2)) / (window.innerHeight / 2);

        titleCard.style.transition = 'all .5s';
        titleCard.style.transform = `translate(-50%, -50%) rotateX(${-20 * y}deg) rotateY(${20 * x}deg)`;
        titleCard.style.boxShadow = `${-30 * x}px ${-30 * y}px 20px 0 #000000a0`;

        titleText.style.transition = 'all .5s';
        titleText.style.textShadow = `${-20 * x}px ${-20 * y}px #00000050`;

        setTimeout(() => {
            titleCard.ontouchmove = titleCard.onmousemove = move;
            titleCard.ontouchend = titleCard.onmouseleave = end;
        }, 300);
    }
}

setGame = () => {
    if (isTouchDevice()) { return; }

    let game = 0;
    let games = [
        'none',
        'pong',
        'space-invader',
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
            case 'space-invader':
                const spaceInvader = document.getElementById('space-invader');
                for (invader of invaders) { invader.remove(); }
                for (bullet of bullets) { bullet.remove(); }

                spaceInvader.style.display = 'none';
                clearInterval(siAnimate);
                break;
        }

        // set new game
        game++;
        game %= games.length
        switch(games[game]) {
            case 'pong':
                document.getElementById('pong').style.display = 'block';
                playPong();
                break;
            case 'space-invader':
                document.getElementById('space-invader').style.display = 'block';
                playSpaceInvaders();
                break;
        }

        if (game) {
            titleCard.style.filter = 'blur(5px)';
            document.getElementById('icon-group').style.pointerEvents = 'none';
        } else {
            titleCard.style.filter = 'blur(0)';
            document.getElementById('icon-group').style.pointerEvents = 'auto';
        }
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
    let ballMovY = -1;

    let player1XPos = window.innerWidth / 2 + padWidth / 2;
    let player1YPos = parseInt(player1Style.top.replace('px', ''));
    let player1MovX = 0;

    let player2XPos = window.innerWidth / 2 + padWidth / 2;
    let player2YPos = parseInt(player2Style.top.replace('px', ''));
    let player2MovX = 0;

    let playerSpeed = 5;
    let ballSpeed = 1;

    pongAnimate = setInterval(frame, 5);

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

        if (y - ballRadius <= 0 || y + ballRadius >= window.innerHeight)  {
            clearInterval(pongAnimate);
            playPong();
        }

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

let siAnimate;
let invaders = [];
let bullets = [];
playSpaceInvaders = () => {
    const spaceInvader = document.getElementById('space-invader');

    let player = document.getElementById('siPlayer');
    let playerXPos = window.innerWidth / 2;
    let playerMovX = 0;
    let playerSpeed = 5;

    invaders = [];
    bullets = [];

    for (let i = 0; i < window.innerWidth - 300; i+=100) {
        for (let j = 0; j < window.innerHeight - 500; j+=100) {
            const invader = document.createElement('div');
            const invaderType = Math.round(Math.random() * 2) + 1;
            invader.classList.add('space-invader', `space-invader-${invaderType}` , 'animate');

            const parent = document.createElement('a');
            parent.href = 'https://codepen.io/DDN-Shep/pen/pvggaX';
            parent.target = '_target';
            parent.classList.add('siEnemy');
            parent.style.bottom = 300 + j + 'px';
            parent.style.left = 200 + i + 'px';
            parent.appendChild(invader);

            spaceInvader.appendChild(parent);
            invaders.push(parent);
        }
    }

    let frameCount = 0;
    const frame = () => {
        frameCount++;

        // move player
        if (controllerPos !== undefined) {
            playerDiff = controllerPos - playerXPos;
            if (Math.abs(playerDiff / window.innerWidth) < .01) {
                playerMovX = 0;
            } else {
                playerMovX = Math.sign(playerDiff);
            }

            playerXPos += playerMovX * playerSpeed;
            player.style.left = playerXPos + 'px';
        }

        // shoot
        if (!(frameCount % 50)) {
            const bullet = document.createElement('div');
            bullet.classList.add('bullet');
            bullet.style.left = playerXPos + 'px';
            bullet.style.bottom = '40px';
            spaceInvader.appendChild(bullet);
            bullets.push(bullet);    
        }

        // move bullet
        for (let i = 0; i < bullets.length; i++) {
            const bullet = bullets[i];
            const bottom = parseInt(bullet.style.bottom.replace('px', ''));
            const left = parseInt(bullet.style.left.replace('px', ''));
            bullet.style.bottom = bottom + 2 + 'px';

            if (bottom > window.innerHeight) {
                bullets.splice(i, 1);
                bullet.remove();
            }

            for (let j = 0; j < invaders.length; j++) {
                const invader = invaders[j];
                const invaderBottom = parseInt(invader.style.bottom.replace('px', ''));
                const invaderLeft = parseInt(invader.style.left.replace('px', ''));
                yDiff = Math.abs(invaderBottom - bottom);
                xDiff = Math.abs(invaderLeft - left);
                if (yDiff < 10 && xDiff < 20) {
                    invaders.splice(j, 1);
                    invader.remove();
                    bullets.splice(i, 1);
                    bullet.remove();

                    if (!invaders.length) {
                        for (let invader of invaders) { invader.remove(); }
                        for (let bullet of bullets) { bullet.remove(); }

                        clearInterval(siAnimate);
                        playSpaceInvaders();
                    }
                    break;
                }
            };
        };
    };
    siAnimate = setInterval(frame, 1);
}
