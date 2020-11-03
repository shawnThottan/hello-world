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

let selectedColorGradient;
let noOfPanels = 12;

ready = () => {
    const index = Math.round(Math.random() * (colorGradients.length - 1));
    selectedColorGradient = colorGradients[index];

    setBG();
    window.onresize = setBG;
}

setBG = () => {
    const windowWidth = window.innerWidth;

    if (windowWidth < 230) {
        noOfPanels = 2;
    } else if (windowWidth < 350) {
        noOfPanels = 3;
    } else if (windowWidth < 576) {
        noOfPanels = 4;
    } else if (windowWidth < 768) {
        noOfPanels = 6;
    } else if (windowWidth < 992) {
        noOfPanels = 8;
    } else if (windowWidth < 1220) {
        noOfPanels = 10;
    }

    const bgElement = document.getElementById('background');
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

        const from = `rgba(${rFrom}, ${gFrom}, ${bFrom}, .9)`;
        const to = `rgba(${rTo}, ${gTo}, ${bTo}, .9)`;
        panel.style.backgroundImage = `linear-gradient(${from}, ${to})`;

        panel.setAttribute('gradient', 'primary');

        bgElement.appendChild(panel);
        i++;
    }

    addScrollInteraction(bgElement);
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

raiseCurtain = (bgElement) => {
    setTimeout(() => {
        let time = 300;
        document.getElementById('pull-string').style.height = 80 + '%';
        for (let element of bgElement.children) {
            setTimeout(() => {
                element.classList.add('raise');
                element.setAttribute('gradient', 'secondary');
            }, time += 100);
        }
    }, 300);
}

addScrollInteraction = (bgElement) => {
    if (isTouchDevice()) {
        raiseCurtain(bgElement);
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
        document.getElementById('pull-string').style.height = (progress * 80 / noOfPanels) + '%';
    };
}
