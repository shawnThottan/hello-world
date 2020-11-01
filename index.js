ready = () => {
    setBG();
    window.onresize = setBG;
}

setBG = () => {
    const windowWidth = window.innerWidth;

    console.log('WINDOWIDTH', windowWidth);
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

    const rFrom = 255;
    const rTo = 0;
    const rDiff = (rTo - rFrom) / (2 * noOfPanels);

    const gFrom = 0;
    const gTo = 0;
    const gDiff = (gTo - gFrom) / (2 * noOfPanels);

    const bFrom = 0;
    const bTo = 119;
    const bDiff = (bTo - bFrom) / (2 * noOfPanels);

    let i = 0;
    while (i < noOfPanels) {
        const panel = document.createElement('div');
        panel.style.height = '100%';
        panel.style.minHeight = '100%';
        panel.style.width = 100 / noOfPanels + '%';
        panel.style.minWidth = 100 / panelWidth + '%';
        panel.classList.add('panel');

        const rHex = getGradientHex(rFrom, rTo, rDiff, noOfPanels, i);
        const gHex = getGradientHex(gFrom, gTo, gDiff, noOfPanels, i);
        const bHex = getGradientHex(bFrom, bTo, bDiff, noOfPanels, i);

        panel.style.backgroundImage = `linear-gradient(#${rHex.from + gHex.from + bHex.from}, #${rHex.to + gHex.to + bHex.to})`;
        
        bgElement.appendChild(panel);
        i++;
    }
}

getGradientHex = (from, to, diff, noOfPanels, i) => {
    from = from + diff * i;
    to = to - diff * (noOfPanels - (i + 1));

    return {
        from: ("00" + Math.round(from).toString(16)).substr(-2),
        to: ("00" + Math.round(to).toString(16)).substr(-2),
    }
}
