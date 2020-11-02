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
    {
        to: {
            r: 0xFF,
            g: 0xFF,
            b: 0xFF,
        },
        from: {
            r: 0xFF,
            g: 0xFF,
            b: 0xFF,
        }
    },
    {
        to: {
            r: 0x00,
            g: 0xBF,
            b: 0x8F,
        },
        from: {
            r: 0x00,
            g: 0x15,
            b: 0x10,
        }
    },
]

let selectedColorGradient1, selectedColorGradient2;

ready = () => {
    setBG();
    window.onresize = setBG;
}

setBG = () => {
    const windowWidth = window.innerWidth;

    let noOfPanels = 12;
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
    let panelWidth = windowWidth / noOfPanels;

    const bgElement = document.getElementById('background');
    while (bgElement.hasChildNodes()) {  
        bgElement.removeChild(bgElement.firstChild);
    }

    const index1 = Math.round(Math.random() * (colorGradients.length - 1));
    selectedColorGradient1 = colorGradients[index1];
    let index2 = Math.round(Math.random() * (colorGradients.length - 1));
    if (index1 === index2) {
        if (index2 === colorGradients.length - 1) {
            index2--;
        } else {
            index2++;
        }
    }
    selectedColorGradient2 = colorGradients[index2];

    const rDiff1 = (selectedColorGradient1.to.r - selectedColorGradient1.from.r) / (2 * noOfPanels);
    const gDiff1 = (selectedColorGradient1.to.g - selectedColorGradient1.from.g) / (2 * noOfPanels);
    const bDiff1 = (selectedColorGradient1.to.b - selectedColorGradient1.from.b) / (2 * noOfPanels);

    const rDiff2 = (selectedColorGradient2.to.r - selectedColorGradient2.from.r) / (2 * noOfPanels);
    const gDiff2 = (selectedColorGradient2.to.g - selectedColorGradient2.from.g) / (2 * noOfPanels);
    const bDiff2 = (selectedColorGradient2.to.b - selectedColorGradient2.from.b) / (2 * noOfPanels);

    let i = 0;
    while (i < noOfPanels) {
        const panel = document.createElement('div');
        panel.style.height = '100%';
        panel.style.minHeight = '100%';
        panel.style.width = 100 / noOfPanels + '%';
        panel.style.minWidth = 100 / panelWidth + '%';
        panel.classList.add('panel');

        const rHex1 = getGradientHex(selectedColorGradient1.from.r, selectedColorGradient1.to.r, rDiff1, noOfPanels, i);
        const gHex1 = getGradientHex(selectedColorGradient1.from.g, selectedColorGradient1.to.g, gDiff1, noOfPanels, i);
        const bHex1 = getGradientHex(selectedColorGradient1.from.b, selectedColorGradient1.to.b, bDiff1, noOfPanels, i);

        const rHex2 = getGradientHex(selectedColorGradient2.from.r, selectedColorGradient2.to.r, rDiff2, noOfPanels, i);
        const gHex2 = getGradientHex(selectedColorGradient2.from.g, selectedColorGradient2.to.g, gDiff2, noOfPanels, i);
        const bHex2 = getGradientHex(selectedColorGradient2.from.b, selectedColorGradient2.to.b, bDiff2, noOfPanels, i);

        panel.setAttribute('gradient', 'primary');
        panel.setAttribute('colors', JSON.stringify({
            primary: {
                r: rHex1,
                g: gHex1,
                b: bHex1,
            },
            secondary: {
                r: rHex2,
                g: gHex2,
                b: bHex2,
            }
        }));
        panel.style.backgroundImage = `linear-gradient(#${rHex1.from + gHex1.from + bHex1.from}, #${rHex1.to + gHex1.to + bHex1.to})`;

        bgElement.appendChild(panel);
        i++;
    }

    addFlipInteraction(bgElement);
}

getGradientHex = (from, to, diff, noOfPanels, i) => {
    from = from + diff * i;
    to = to - diff * (noOfPanels - (i + 1));

    return {
        from: ("00" + Math.round(from).toString(16)).substr(-2),
        to: ("00" + Math.round(to).toString(16)).substr(-2),
    }
}

addFlipInteraction = (bgElement) => {
    const flip = (element, gradientName) => {
        element.classList.toggle('rotate');
        const colors = JSON.parse(element.getAttribute('colors'));
        element.setAttribute('gradient', gradientName);
        const gradient = colors[gradientName];
        element.style.backgroundImage = `linear-gradient(#${gradient.r.from + gradient.g.from + gradient.b.from}, #${gradient.r.to + gradient.g.to + gradient.b.to})`;
    }

    const flipFirst = (element, event) => {
        const gradientName = element.getAttribute('gradient') === 'primary' ? 'secondary' : 'primary';
        if (
            (gradientName === 'secondary' && event.offsetX >= element.offsetWidth ) ||
            (gradientName === 'primary' && event.offsetX <= 0)
        ) { flip(element, gradientName); }
    }

    const flipRest = (element, event) => {
        const gradientName = element.getAttribute('gradient') === 'primary' ? 'secondary' : 'primary';
        if (
            (gradientName === 'secondary' && event.offsetX <= element.offsetWidth / 2 ) ||
            (gradientName === 'primary' && event.offsetX >= element.offsetWidth / 2)
        ) { flip(element, gradientName); }
    }

    for (let element of bgElement.children) {
        let mousefunction = 'onmouseenter';
        let flipFunction = (event) => {
            flipRest(element, event);
        }
        if (element === bgElement.firstChild) {
            mousefunction = 'onmouseleave';
            flipFunction = (event) => {
                flipFirst(element, event)
            };
        }

        element[mousefunction] = flipFunction;
    }
}
