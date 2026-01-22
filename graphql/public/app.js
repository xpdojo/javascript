// GraphQL 쿼리 실행 함수
async function executeGraphQLQuery(query) {
    try {
        const response = await fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

// 결과 표시 함수
function displayResult(data, isError = false) {
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');

    loadingDiv.style.display = 'none';

    if (isError) {
        resultDiv.innerHTML = `<div class="error"><strong>오류:</strong><br>${data}</div>`;
    } else {
        const formattedData = JSON.stringify(data, null, 2);
        resultDiv.innerHTML = `<div class="success"><strong>성공:</strong><pre>${formattedData}</pre></div>`;
    }
}

// 로딩 표시
function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('result').innerHTML = '';
}

// 미리 정의된 쿼리 실행
async function runQuery(type) {
    showLoading();

    let query = '';

    switch (type) {
        case 'hello':
            query = '{ hello }';
            break;
        case 'user':
            query = `{
                user(id: 1) {
                    id
                    name
                    email
                }
            }`;
            break;
        case 'users':
            query = `{
                users {
                    id
                    name
                    email
                }
            }`;
            break;
    }

    // 쿼리 입력란에도 표시
    document.getElementById('queryInput').value = query;

    try {
        const result = await executeGraphQLQuery(query);
        displayResult(result);
    } catch (error) {
        displayResult(error.message, true);
    }
}

// 사용자 정의 쿼리 실행
async function executeCustomQuery() {
    const queryInput = document.getElementById('queryInput');
    const query = queryInput.value.trim();

    if (!query) {
        alert('쿼리를 입력해주세요.');
        return;
    }

    showLoading();

    try {
        const result = await executeGraphQLQuery(query);
        displayResult(result);
    } catch (error) {
        displayResult(error.message, true);
    }
}

// Enter 키로 쿼리 실행 (Ctrl/Cmd + Enter)
document.getElementById('queryInput').addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        executeCustomQuery();
    }
});
