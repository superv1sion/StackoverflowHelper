// Content extraction
function extractContent() {
    const questionTitle = document.querySelector('.question-hyperlink').innerText;
    const questionBody = document.querySelector('.js-post-body').innerText;

    const answers = document.querySelectorAll('.answer');
    const answerData = [];
    answers.forEach((answer) => {
        const answerText = answer.querySelector('.js-post-body').innerText;
        const answerScore = answer.querySelector('.js-vote-count').innerText;
        answerData.push({ text: answerText, score: answerScore });
    });

    return {
        questionTitle,
        questionBody,
        answers: answerData
    };
}

function main() {
    const extractedContent = extractContent();
    const answersHeader = document.querySelector('.answers-subheader');
    const oldAnswer = document.getElementById('chatGPTAnswer')
    if(oldAnswer) {
        oldAnswer.remove()
    }
    const loading = '<div id="chatGPTLoader" class="js-spinner p24 d-flex ai-center jc-center ">' +
        '   <div style="width: 100px; height: 100px;" class="s-spinner s-spinner__sm fc-orange-400">' +
        '   </div>' +
        '</div>'
    answersHeader.insertAdjacentHTML('afterend', loading);
    const answersLimit = 20
    const answersContainer = [];
    extractedContent.answers.slice(0, answersLimit).forEach((answer) => {
        answersContainer.push(answer.text);
    });
    const questionToAI = 'question Title: '
        + extractedContent.questionTitle
        + "\n question body: "
        + extractedContent.questionBody
        + "\n answers: "
        +  JSON.stringify(answersContainer)
        + "\n choose best answer or most liked if can't decide."
   fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages:  [{"role": "user", "content": questionToAI}],
        })
    }).then( (response) => {
       response.text().then((data) => {
           document.getElementById('chatGPTLoader').remove()
           const parsedData = JSON.parse(data)
           const pre = document.createElement('pre')
           pre.style.cssText = 'width: 700px;white-space: break-spaces;'
           pre.textContent = parsedData.choices[0].message.content
           const answerHTML = '<div id="chatGPTAnswer"><h1>ChatGPT assistance:</h1>' + pre.outerHTML + '</div>';
           answersHeader.insertAdjacentHTML('afterend', answerHTML);
       })
   })
}
main()
