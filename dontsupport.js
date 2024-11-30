texts = [
    "I'll fix it next time",
    "Continue without supporting this time",
    "CONTINUE WITHOUT SUPPORTING THIS TIME",
    "We rely on ads to keep this site free. Consider disabling your ad blocker.",
    "I’ll do it later",
    "Maybe next time",
    "Continue without disabling",
    "Continue without supporting us",
    "Ignore and proceed",
    "Remind me later",
    "Continue with ad blocker",
    "Proceed without support",
    "No thanks, continue",

]
let elements = [];
let counter = 0;
function getElementsByText(str, tag = 'a') {
    return Array.prototype.slice.call(document.getElementsByTagName(tag)).filter(el => el.textContent.trim() === str.trim());
}
time = setInterval(function () {
    find()
}, 250);

function find() {
    if (elements.length == 0) {
        for (let i = 0; i < texts.length; i++) {
            if (getElementsByText(texts[i], 'button').length == 0 && getElementsByText(texts[i], 'a').length == 0) {

            }
            if (getElementsByText(texts[i], 'button').length == 0 && getElementsByText(texts[i], 'a').length > 0) {
                elements.push(getElementsByText(texts[i], 'a'));
            }
            if (getElementsByText(texts[i], 'button').length > 0 && getElementsByText(texts[i], 'a').length == 0) {
                elements.push(getElementsByText(texts[i], 'button'));
            }
            if (getElementsByText(texts[i], 'button').length > 0 && getElementsByText(texts[i], 'a').length > 0) {
                elements.push(getElementsByText(texts[i], 'button'));
                elements.push(getElementsByText(texts[i], 'a'));
            }

        }
        counter++;
        if (counter >= 20) {
            clearInterval(time)
        }
    }
    else {
        clickall()

    }
}
function clickall() {
    for (let i = 0; i < elements.length; i++) {
        elements[i][0].click()
    }
}
