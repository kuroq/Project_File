// 게시판 관련 자바스크립트(script 는 자바스크립트 파일로~)

// 데이터 입력 & 저장
async function addData() {
// async = 비동기 함수로 선언. 이 함수 내에서 await 키워드를 사용.
// function addData() = addData라는 이름의 함수를 선언. 데이터 입력과 저장을 처리.
    const input1 = document.getElementById('input1').value;
    // document.getElementById('inputX').value = HTML 문서에서 id가 inputX인 요소의 값을 가져온다. (X는 1~9)
    const input2 = document.getElementById('input2').value;
    const input3 = document.getElementById('input3').value;
    const input4 = document.getElementById('input4').value;
    const input5 = document.getElementById('input5').value;
    const input6 = document.getElementById('input6').value;
    const input7 = document.getElementById('input7').value;
    const input8 = document.getElementById('input8').value;
    const input9 = document.getElementById('input9').value;

    // const data = {
    // // const data = 데이터를 담을 객체를 생성
    //     purposeIdx: input1,
    //     message: input2,
    //     mean: input3,
    //     meanAddPhrase: input4,
    //     meanAddMor: input5,
    //     meanAddAll: input6,
    //     runningTime: input7,
    //     yesValue: input8,
    //     noValue: input9,
    //     confirmStatus: false  // 기본값 설정
    // };

    const data = {
        purposeIdx: input1,
        message: input2,
        mean: parseFloat(input3),
        meanAddPhrase: parseFloat(input4),
        meanAddMor: parseFloat(input5),
        meanAddAll: parseFloat(input6),
        runningTime: input7,
        yesValue: parseFloat(input8),
        noValue: parseFloat(input9),
        confirmStatus: false
    };
    

    // 서버로 데이터 전송
    try {
    // try = 오류가 발생할 가능성이 있는 코드 블록을 시작. 오류가 발생하면 catch 블록에서 처리
        const response = await fetch('http://57.180.41.44:5006/boardDB/firstmessages', {
        // fetch API를 사용하여 비동기 HTTP 요청을 보냄
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // 요청 헤더를 설정. 전송할 데이터가 JSON 형식임을 지정함
            body: JSON.stringify(data)
            // 요청 본문에 보낼 데이터를 JSON 문자열로 변환하여 설정
        });

        const result = await response.json();
        // 서버로부터 받은 응답을 JSON 형식으로 변환
        if (response.ok) {
            alert('Data inserted successfully');
            // 데이터 삽입이 성공적임을 알리는 경고 창을 띄움
            location.reload();  // 페이지 새로고침
            // 페이지를 새로고침하여 변경 사항을 반영
        } else {
            alert('Error: ' + result.detail);
            // 응답이 성공적이지 않은 경우 오류 메시지를 표시
        }
    } catch (error) {
    // try 에서 오류가 발생한 경우
        console.error('Error:', error);
        // 콘솔에 오류를 출력
        alert('Failed to insert data');
        // 데이터 삽입 실패를 알리는 경고 창을 띄움
    }
}

// 메시지 전송 함수
async function sendMessage(messageId) {
// async = 비동기 함수를 정의. await 키워드를 사용할 수 있음
// function sendMessage(messageId) = sendMessage라는 이름의 함수를 정의. messageId라는 매개변수를 받음
    try {
    // try = 오류가 발생할 가능성이 있는 코드 블록을 시작. 오류가 발생하면 catch 블록에서 처리
        const response = await fetch(`http://57.180.41.44:5006/boardDB1/firstmessages/${messageId}`, {
        // fetch 함수는 네트워크 요청을 수행. await 키워드는 이 요청이 완료될 때까지 기다림
            method: 'PUT',
            // 요청의 옵션. HTTP PUT 요청을 사용함
            headers: { 'Content-Type': 'application/json' }
            // 요청 헤더 설정. 전송할 데이터가 JSON 형식임을 지정함
        });

        if (!response.ok) throw new Error('Failed to send message');
        // response.ok가 false인 경우 오류를 발생. 이는 요청이 성공하지 않았음을 의미

        const result = await response.json();
        // response.json() = 응답 본문을 JSON으로 파싱. await 키워드를 사용하여 파싱이 완료될 때까지 기다림

        const sendDateElement = document.querySelector(`#sendDate-${messageId}`);
        // document.querySelector = CSS 선택자를 사용하여 문서에서 요소를 선택
        // 여기서 '#sendDate-${messageId}'는 ID가 sendDate-messageId인 요소를 선택
        if (sendDateElement) {
        // sendDateElement가 존재하는지 확인
            const sendDate = new Date(result.sendDate);
            // result.sendDate를 Date 객체로 변환
            const formattedSendDate = `${sendDate.getFullYear()}-${String(sendDate.getMonth() + 1).padStart(2, '0')}-${String(sendDate.getDate()).padStart(2, '0')} ${String(sendDate.getHours()).padStart(2, '0')}:${String(sendDate.getMinutes()).padStart(2, '0')}:${String(sendDate.getSeconds()).padStart(2, '0')}`;
            // sendDate를 형식화된 문자열로 변환. 연도, 월, 일, 시간, 분, 초를 각각 두 자리 숫자로 포맷
            sendDateElement.innerText = formattedSendDate;
            // sendDateElement의 텍스트 내용을 formattedSendDate로 설정
        }
        alert('Message sent and updated successfully');
        // 메시지 전송이 성공했음을 알리는 경고 메시지를 표시
    } catch (error) {
    // try 에서 오류가 발생한 경우
        console.error('Error:', error);
        // 콘솔에 오류를 출력
        alert('Failed to send message');
        // 데이터 삽입 실패를 알리는 경고 창을 띄움
    }
}

// 테이블2,3 조회 기능
async function loadData() {
// loadData라는 이름의 비동기 함수를 정의. async = 함수가 비동기적으로 실행되며 await 키워드를 사용할 수 있음
    // table2에 대한 데이터 로드 (boardDB2)
    try {
    // try = 오류가 발생할 가능성이 있는 코드 블록을 시작. 오류가 발생하면 catch 블록에서 처리
        const response2 = await fetch('http://57.180.41.44:5006/api/boardDB2/firstmessages');
        // fetch 함수는 주어진 URL로 HTTP 요청을 보냄. await 키워드를 사용하여 요청이 완료될 때까지 기다림
        const data2 = await response2.json();
        // 응답 객체 response2에서 JSON 데이터를 추출. await 키워드를 사용하여 데이터 추출이 완료될 때까지 기다림
        console.log('Data for table2:', data2);
        // 콘솔에 data2를 출력하여 확인. 디버깅에 유용
        const table2Body = document.getElementById('team2Data');
        // HTML 문서에서 ID가 team2Data인 요소를 선택. 데이터를 삽입할 테이블의 본문
        data2.forEach(item => {
        // data2 배열의 각 요소에 대해 반복. 각 요소는 item으로 참조
            const row = document.createElement('tr');
            // 새로운 테이블 행(tr) 요소를 생성
            row.innerHTML = `<td>${item.messageId}</td><td>${item.message}</td>`;
            // 행의 HTML 내용을 설정. 각 행에는 messageId와 message 값이 포함
            table2Body.appendChild(row);
            // 생성한 행을 테이블 본문에 추가
        });
    } catch (error) {
    // try 에서 오류가 발생한 경우 실행
        console.error('Error fetching data for table2:', error);
        // 오류 메시지를 콘솔에 출력하여 오류를 기록
    }

    // table23에 대한 데이터 로드 (boardDB3)
    try {
    // try = 오류가 발생할 가능성이 있는 코드 블록을 시작. 오류가 발생하면 catch 블록에서 처리
        const response3 = await fetch('http://57.180.41.44:5006/api/boardDB3/firstmessages');
        // fetch 함수는 주어진 URL로 HTTP 요청을 보냄. await 키워드를 사용하여 요청이 완료될 때까지 기다림
        const data3 = await response3.json();
        // 응답 객체 response3에서 JSON 데이터를 추출. await 키워드를 사용하여 데이터 추출이 완료될 때까지 기다림
        console.log('Data for table23:', data3);
        // 콘솔에 data3를 출력하여 확인. 디버깅에 유용
        const table23Body = document.getElementById('allData');
        // HTML 문서에서 ID가 team23Data인 요소를 선택. 데이터를 삽입할 테이블의 본문
        data3.forEach(item => {
        // data3 배열의 각 요소에 대해 반복. 각 요소는 item으로 참조
            const row = document.createElement('tr');
            // 새로운 테이블 행(tr) 요소를 생성
            row.innerHTML = `<td>${item.messageId}</td><td>${item.message}</td>`;
            // 행의 HTML 내용을 설정. 각 행에는 messageId와 message 값이 포함
            table23Body.appendChild(row);
            // 생성한 행을 테이블 본문에 추가
        });
    } catch (error) {
    // try 에서 오류가 발생한 경우 실행
        console.error('Error fetching data for table23:', error);
        // 오류 메시지를 콘솔에 출력하여 오류를 기록
    }
}

// 테이블1 조회 & 수정
async function loadDataTable1() {
// loadDataTable1라는 이름의 비동기 함수를 정의. async = 함수가 비동기적으로 실행되며 await 키워드를 사용할 수 있음
    try {
    // try = 오류가 발생할 가능성이 있는 코드 블록을 시작. 오류가 발생하면 catch 블록에서 처리
        const response1 = await fetch('http://57.180.41.44:5006/api/boardDB1/firstmessages');
        // fetch 함수는 주어진 URL로 HTTP 요청을 보냄. await 키워드를 사용하여 요청이 완료될 때까지 기다림
        const data1 = await response1.json();
        // 응답 객체 response1에서 JSON 데이터를 추출. await 키워드를 사용하여 데이터 추출이 완료될 때까지 기다림
        console.log('Data for table1:', data1);
        // 콘솔에 data1를 출력하여 확인. 디버깅에 유용
        const table1Body = document.getElementById('personalData');
        // HTML 문서에서 ID가 team1Data인 요소를 선택. tbody 요소를 저장하는 변수
        const firstMessagesMap = {};
        // 빈 객체를 선언하여 firstmessages 행을 저장할 변수

        // 먼저, firstmessages를 렌더링
        data1.forEach(item => {
        // data1 배열의 각 요소에 대해 콜백 함수를 실행. item = 배열의 각 요소를 나타냄
            const sendDate = item.sendDate ? new Date(item.sendDate) : null;
            // sendDate 값이 있으면 이를 Date 객체로 변환하고, 없으면 null을 저장
            const formattedSendDate = sendDate ? `${sendDate.getFullYear()}-${String(sendDate.getMonth() + 1).padStart(2, '0')}-${String(sendDate.getDate()).padStart(2, '0')} ${String(sendDate.getHours()).padStart(2, '0')}:${String(sendDate.getMinutes()).padStart(2, '0')}:${String(sendDate.getSeconds()).padStart(2, '0')}` : '';
            // sendDate가 존재하면 이를 포맷팅한 문자열을 저장하고, 그렇지 않으면 빈 문자열을 저장

            const row = document.createElement('tr');
            // 새로운 tr 요소를 생성
            // row.innerHTML = 생성된 행(tr)의 내부 HTML을 설정
            // column-messageId = 테이블 데이터(td) 요소를 생성하고, item 객체의 messageId 값을 넣음
            row.innerHTML = `
                <td class="column-messageId">${item.messageId}</td>
                <td class="column-purpose">${item.purposeIdx}</td>
                <td class="column-message">${item.message}</td>
                <td class="column-mean">${item.mean}</td>
                <td class="column-meanAddPhrase">${item.meanAddPhrase}</td>
                <td class="column-meanAddMor">${item.meanAddMor}</td>
                <td class="column-meanAddAll">${item.meanAddAll}</td>
                <td class="column-runningTime">${item.runningTime}</td>
                <td class="column-sendDate" id="sendDate-${item.messageId}">${formattedSendDate}</td>
                <td class="column-receiveDate" id="receiveDate-${item.messageId}">
                    <button class="sendbutton" onclick="sendMessage('${item.messageId}')">메세지보내기</button>
                </td>
                <td class="column-yesValue">${item.yesValue}</td>
                <td class="column-noValue">${item.noValue}</td>
                <td class="column-confirmStatus">${item.confirmStatus}</td>
            `;
            table1Body.appendChild(row);
            // 생성된 행을 테이블에 추가
            
            firstMessagesMap[item.messageId] = row;
            // 객체에 messageId를 키로 사용하여 행(tr)을 저장
        });

        // answermessages를 가져와서 렌더링
        const responseAnswer = await fetch('http://57.180.41.44:5006/api/boardDB1/answermessages');
        // 서버 응답을 저장하는 변수
        const answerData = await responseAnswer.json();
        // JSON으로 변환된 answermessages 데이터를 저장하는 변수
        console.log('Data for answermessages:', answerData);
        // 콘솔에 answerData를 출력하여 확인. 디버깅에 유용

        answerData.forEach(item => {
        // answerData 배열의 각 요소에 대해 콜백 함수를 실행
            const sendDate = new Date(item.sendDate);
            // sendDate 상수이름
            const formattedSendDate = `${sendDate.getFullYear()}-${String(sendDate.getMonth() + 1).padStart(2, '0')}-${String(sendDate.getDate()).padStart(2, '0')} ${String(sendDate.getHours()).padStart(2, '0')}:${String(sendDate.getMinutes()).padStart(2, '0')}:${String(sendDate.getSeconds()).padStart(2, '0')}`;
            // formattedSendDate 상수의 이름. 시간을 보기좋게 재배열
            // 백틱(`)으로 감싸진 부분은 템플릿 리터럴로, 문자열을 생성하는데 사용
            // 템플릿 리터럴 안에서는 ${} 구문을 사용해 변수나 표현식을 삽입할 수 있음
            // ${} 안에 연도를 삽입해 문자열에 포함

            const receiveDate = item.receiveDate ? new Date(item.receiveDate) : null;
            // receiveDate 값이 있으면 이를 Date 객체로 변환하고, 없으면 null을 저장
            const formattedReceiveDate = receiveDate ? `${receiveDate.getFullYear()}-${String(receiveDate.getMonth() + 1).padStart(2, '0')}-${String(receiveDate.getDate()).padStart(2, '0')} ${String(receiveDate.getHours()).padStart(2, '0')}:${String(receiveDate.getMinutes()).padStart(2, '0')}:${String(receiveDate.getSeconds()).padStart(2, '0')}` : '';
            // receiveDate가 존재하면 이를 포맷팅한 문자열을 저장하고, 그렇지 않으면 빈 문자열을 저장

            const row = document.createElement('tr');
            // 새로운 tr 요소를 생성
            // row.innerHTML = 생성된 행(tr)의 내부 HTML을 설정
            row.innerHTML = `
                <td class="column-messageId-2">${item.answerId}</td>
                <td class="column-purpose-2">ㄴ</td>
                <td class="column-message-2">${item.answer}</td>
                <td class="column-mean-2">${item.mean}</td>
                <td class="column-meanAddPhrase-2">${item.meanAddPhrase}</td>
                <td class="column-meanAddMor-2">${item.meanAddMor}</td>
                <td class="column-meanAddAll-2">${item.meanAddAll}</td>
                <td class="column-runningTime-2"></td>
                <td class="column-sendDate-2">${formattedSendDate}</td>
                <td class="column-receiveDate-2">${formattedReceiveDate}</td>
                <td class="column-yesValue-2"></td>
                <td class="column-noValue-2"></td>
                <td class="column-confirmStatus-2">${item.yesOrNo}</td>
            `;

            // 해당하는 firstmessages 행 뒤에 행을 삽입
            const messageId = item.messageId;
            // const messageId = messageId 값을 저장하는 변수
            if (firstMessagesMap[messageId]) {
            // firstMessagesMap 객체에 messageId 키가 존재하는지 확인
                firstMessagesMap[messageId].insertAdjacentElement('afterend', row);
                // 해당 행(tr) 다음에 새로운 행을 삽입
            }
        });
    } catch (error) {
    // try 에서 오류가 발생한 경우 실행
        console.error('Error fetching data for table1:', error);
        // 오류 메시지를 콘솔에 출력하여 오류를 기록
    }
}

// '새로고침' 버튼 클릭 이벤트 리스너 추가
document.querySelector('.button2').addEventListener('click', () => {
// HTML 문서에서 클래스 이름이 button2인 첫 번째 요소를 선택+선택한 요소에 'click' 이벤트 리스너를 추가. 버튼이 클릭시 지정된 함수가 실행
// document = 현재 웹 페이지의 문서 객체.
// querySelector('.button2'): 선택자 .button2(클래스)에 해당하는 요소를 반환
// () => { location.reload(); } = 클릭 이벤트가 발생할 때 실행할 함수. 여기서는 화살표 함수(익명 함수)를 사용
    location.reload();
    // 현재 페이지를 새로고침
    // location = 현재 페이지의 URL을 나타내는 객체.
    //reload() = 페이지를 다시 로드
});

// 페이지 로드 시 데이터 로드
window.onload = function() {
// 페이지가 완전히 로드될 때 실행할 함수를 지정
// window = 브라우저 창을 나타내는 전역 객체
// onload = 페이지 로드 이벤트. 페이지가 완전히 로드되면 이 이벤트가 발생함
// function() { ... } = 페이지가 로드되었을 때 실행할 익명 함수
// 익명함수 = 이름이 없는 함수, 보통 함수 표현식이나 즉시 실행 함수 표현식으로 사용됨
    loadData();
    // loadData 함수를 호출. 데이터를 불러오고 이를 DOM에 추가함
    loadDataTable1();
    // loadDataTable1 함수를 호출. 첫 번째 데이터 테이블을 불러오고 이를 DOM에 추가함
    // DOM = D웹 페이지의 구조를 표현하는 객체 모델. HTML 문서가 브라우저에 로드되면, 브라우저는 이 문서를 DOM으로 변환함.
};
