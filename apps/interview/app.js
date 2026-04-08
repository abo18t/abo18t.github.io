// Main application logic
class InterviewApp {
    constructor() {
        this.currentQuestionIndex = 0;
        this.questions = [];
        this.scores = [];
        this.currentScore = null;
        this.isInterviewActive = false;
        this.currentSession = null;
        this.candidateName = '';
        this.interviewType = 'core';
        this.questionCount = 10;

        this.initializeApp();
    }

    async initializeApp() {
        try {
            // Load questions data
            await QuestionsData.loadQuestionsData();

            // Setup event listeners
            this.setupEventListeners();

            // Check for existing session
            this.checkExistingSession();

            // Handle auto-config via URL parameter
            const urlParams = new URLSearchParams(window.location.search);
            const candidate = urlParams.get('candidate');
            if (candidate === 'quangminh') {
                const nameInput = document.getElementById('candidateName');
                const typeSelect = document.getElementById('interviewType');
                if (nameInput) nameInput.value = 'Đặng Vũ Quang Minh';
                if (typeSelect) typeSelect.value = 'quangminh';
            }

        } catch (error) {
            console.error('Lỗi khởi tạo ứng dụng:', error);
            this.showError('Không thể khởi tạo ứng dụng phỏng vấn');
        }
    }

    setupEventListeners() {
        // Start panel events
        document.getElementById('startNewInterview').addEventListener('click', () => {
            this.startNewInterview();
        });

        document.getElementById('resumeInterview').addEventListener('click', () => {
            this.resumeInterview();
        });

        document.getElementById('clearSession').addEventListener('click', () => {
            this.clearSession();
        });

        // Back to main button
        document.getElementById('backToMain').addEventListener('click', () => {
            this.showStartPanel();
        });

        // Previous question button
        document.getElementById('prevQuestion').addEventListener('click', () => {
            this.prevQuestion();
        });

        // Next question button
        document.getElementById('nextQuestion').addEventListener('click', () => {
            this.nextQuestion();
        });

        // Finish interview button
        document.getElementById('finishInterview').addEventListener('click', () => {
            this.confirmFinishInterview();
        });

        // Restart interview button
        document.getElementById('restartInterview').addEventListener('click', () => {
            this.showStartPanel();
        });

        // Export results button
        document.getElementById('exportResults').addEventListener('click', () => {
            this.exportResults();
        });

        // Export PDF button
        document.getElementById('exportPDF').addEventListener('click', () => {
            this.exportPDF();
        });

        // Score selection
        document.querySelectorAll('input[name="score"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.currentScore = parseInt(e.target.value);
            });
        });
    }

    startInterview() {
        // Generate random questions using new structure
        this.questions = QuestionsData.getRandomQuestions(this.questionCount, this.interviewType);
        this.scores = new Array(this.questions.length).fill(0);
        this.currentQuestionIndex = 0;
        this.isInterviewActive = true;

        // Update session with questions
        if (this.currentSession) {
            this.currentSession.questions = this.questions;
            this.currentSession.scores = this.scores;
            this.currentSession.currentQuestionIndex = this.currentQuestionIndex;
        }

        // Show interview panel, hide start and results
        document.getElementById('startPanel').style.display = 'none';
        document.getElementById('interviewPanel').style.display = 'block';
        document.getElementById('resultsPanel').style.display = 'none';

        // Load first question
        this.loadQuestion();

        // Update progress
        this.updateProgress();

        // Save session
        this.saveSession();
    }

    loadQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.finishInterview();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];

        // Update question display
        document.getElementById('questionId').textContent = question.id;
        document.getElementById('questionGroup').textContent = question.group;
        document.getElementById('questionText').textContent = question.question;
        document.getElementById('questionGoal').textContent = question.goal;

        // Use modelAnswer if available, otherwise fallback to coreAnswer
        const answerText = question.modelAnswer || question.coreAnswer;
        this.displayStructuredAnswer(answerText);

        // Update upgrade tips
        const upgradeTipsList = document.getElementById('upgradeTips');
        upgradeTipsList.innerHTML = '';
        if (question.upgradeFor3Points && Array.isArray(question.upgradeFor3Points)) {
            question.upgradeFor3Points.forEach(tip => {
                const li = document.createElement('li');
                li.textContent = tip;
                upgradeTipsList.appendChild(li);
            });
        }

        // Set score selection if already answered
        const existingScore = this.scores[this.currentQuestionIndex];
        if (existingScore !== undefined && existingScore !== 0) {
            document.querySelector(`input[name="score"][value="${existingScore}"]`).checked = true;
            this.currentScore = existingScore;
        } else {
            // Reset score selection
            document.querySelectorAll('input[name="score"]').forEach(radio => {
                radio.checked = false;
            });
            this.currentScore = null;
        }

        // Update progress
        this.updateProgress();
    }

    displayStructuredAnswer(answerText) {
        const answerContainer = document.getElementById('coreAnswer');

        // Check if it's a structured modelAnswer or simple coreAnswer
        if (answerText.includes('**Tóm tắt cốt lõi:**')) {
            // Parse structured answer
            this.parseStructuredAnswer(answerText, answerContainer);
        } else {
            // Simple answer - just display as text
            answerContainer.innerHTML = `<p>${answerText}</p>`;
        }
    }

    parseStructuredAnswer(answerText, container) {
        // Clean up the text first
        let cleanText = answerText.replace(/^\n- \*\*/, '').trim();

        // Split by sections
        const sections = cleanText.split(/\n- \*\*/);
        let html = '';

        sections.forEach((section, index) => {
            if (index === 0) {
                // First section - Tóm tắt cốt lõi
                const firstPart = section.replace(/^- \*\*/, '').trim();
                if (firstPart) {
                    html += `<div class="answer-section">`;
                    html += `<h4>📋 Tóm tắt cốt lõi</h4>`;
                    html += `<p>${firstPart}</p>`;
                    html += `</div>`;
                }
            } else {
                // Parse section with **header**
                const parts = section.split(':**');
                if (parts.length >= 2) {
                    const header = parts[0].trim();
                    const content = parts.slice(1).join(':**').trim();

                    // Map headers to icons
                    const headerIcons = {
                        'Chi tiết triển khai/biến thể chấp nhận': '🔧',
                        'Mở rộng để đạt 3 điểm (best practice/adv.)': '⭐',
                        'Lỗi thường gặp cần tránh': '⚠️',
                        'Tiêu chí chấm mức 3': '🎯'
                    };

                    const icon = headerIcons[header] || '📝';

                    html += `<div class="answer-section">`;
                    html += `<h4>${icon} ${header}</h4>`;

                    // Parse content for lists
                    if (content.includes('; ')) {
                        const items = content.split('; ').filter(item => item.trim());
                        html += `<ul>`;
                        items.forEach(item => {
                            html += `<li>${item.trim()}</li>`;
                        });
                        html += `</ul>`;
                    } else {
                        html += `<p>${content}</p>`;
                    }

                    html += `</div>`;
                }
            }
        });

        container.innerHTML = html;
    }

    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            // Save current score if any
            if (this.currentScore !== null) {
                this.scores[this.currentQuestionIndex] = this.currentScore;
            }

            // Move to previous question
            this.currentQuestionIndex--;
            this.loadQuestion();

            // Save session
            this.saveSession();
        }
    }

    nextQuestion() {
        if (this.currentScore === null) {
            alert('Vui lòng chọn điểm cho câu hỏi này!');
            return;
        }

        // Save current score (including 'skip')
        this.scores[this.currentQuestionIndex] = this.currentScore;

        // Move to next question
        this.currentQuestionIndex++;
        this.loadQuestion();

        // Save session
        this.saveSession();
    }

    confirmFinishInterview() {
        const answeredQuestions = this.scores.filter(score => score > 0).length;
        const totalQuestions = this.questions.length;

        let message = `Bạn đã trả lời ${answeredQuestions}/${totalQuestions} câu hỏi.\n\n`;

        if (answeredQuestions < totalQuestions) {
            message += `Còn ${totalQuestions - answeredQuestions} câu chưa trả lời.\n\n`;
        }

        message += 'Bạn có chắc chắn muốn kết thúc phỏng vấn?';

        if (confirm(message)) {
            this.finishInterview();
        }
    }

    finishInterview() {
        if (this.isInterviewActive && this.currentScore !== null) {
            // Save last score
            this.scores[this.currentQuestionIndex] = this.currentScore;
        }

        this.isInterviewActive = false;

        // Save completed interview
        this.saveCompletedInterview();

        this.showResults();
    }

    showResults() {
        // Hide interview panel, show results
        document.getElementById('interviewPanel').style.display = 'none';
        document.getElementById('resultsPanel').style.display = 'block';

        // Calculate results
        const totalScore = this.scores.reduce((sum, score) => sum + score, 0);
        const maxScore = QuestionsData.getMaxScore(this.questions);
        const passResult = QuestionsData.checkPassing(this.questions, this.scores);
        const groupScores = QuestionsData.calculateGroupScores(this.questions, this.scores);
        const strengthsAndImprovements = QuestionsData.getStrengthsAndImprovements(this.questions, this.scores);

        // Update total score
        document.getElementById('totalScore').textContent = totalScore;
        document.getElementById('maxScore').textContent = maxScore;

        // Update score bar
        const percentage = (totalScore / maxScore) * 100;
        document.getElementById('scoreFill').style.width = `${percentage}%`;

        // Update group scores
        this.updateGroupScores(groupScores);

        // Update strengths and improvements
        this.updateStrengthsAndImprovements(strengthsAndImprovements);

        // Update recommendation
        this.updateRecommendation(passResult, totalScore, maxScore);

        // Update progress to 100%
        this.updateProgress(true);
    }

    updateGroupScores(groupScores) {
        const groupStatsContainer = document.getElementById('groupStats');
        groupStatsContainer.innerHTML = '';

        Object.keys(groupScores).forEach(group => {
            const stat = groupScores[group];
            const statElement = document.createElement('div');
            statElement.className = 'group-stat';
            statElement.innerHTML = `
                <div class="group-name">${group}</div>
                <div class="group-score">${stat.total}/${stat.count * 3}</div>
                <div class="group-average">(${stat.average.toFixed(1)}/3.0)</div>
            `;
            groupStatsContainer.appendChild(statElement);
        });
    }

    updateStrengthsAndImprovements(data) {
        const strengthsList = document.getElementById('strengthsList');
        const improvementsList = document.getElementById('improvementsList');

        strengthsList.innerHTML = '';
        data.strengths.forEach(strength => {
            const li = document.createElement('li');
            li.textContent = strength;
            strengthsList.appendChild(li);
        });

        improvementsList.innerHTML = '';
        data.improvements.forEach(improvement => {
            const li = document.createElement('li');
            li.textContent = improvement;
            improvementsList.appendChild(li);
        });
    }

    updateRecommendation(passResult, totalScore, maxScore) {
        const recommendationContainer = document.getElementById('recommendation');
        const percentage = (totalScore / maxScore) * 100;

        let recommendation = '';
        let recommendationClass = '';

        if (passResult.strongPass) {
            recommendation = `
                <div class="recommendation-pass">
                    <h4>🎉 XUẤT SẮC - ĐẠT YÊU CẦU CAO</h4>
                    <p>Ứng viên thể hiện kiến thức vững vàng về Cocos Creator và lập trình game.
                    Điểm số ${totalScore}/${maxScore} (${percentage.toFixed(1)}%) cho thấy khả năng
                    áp dụng kiến thức vào thực tế tốt.</p>
                    <p><strong>Phân tích chi tiết:</strong></p>
                    <ul>
                        <li>Engine: ${passResult.engineScore} điểm</li>
                        <li>Programming: ${passResult.programmingScore} điểm</li>
                        <li>Performance: ${passResult.performanceScore || 0} điểm</li>
                        <li>Feature: ${passResult.featureScore || 0} điểm</li>
                        <li>Soft Skills: ${passResult.softScore || 0} điểm</li>
                    </ul>
                    <p><strong>Khuyến nghị:</strong> Phù hợp cho vị trí Junior Game Developer,
                    có thể giao các task phức tạp hơn.</p>
                </div>
            `;
            recommendationClass = 'pass';
        } else if (passResult.passed) {
            recommendation = `
                <div class="recommendation-pass">
                    <h4>✅ ĐẠT YÊU CẦU</h4>
                    <p>Ứng viên đạt điểm ${totalScore}/${maxScore} (${percentage.toFixed(1)}%)
                    và đáp ứng các tiêu chí cơ bản. Có kiến thức nền tảng về Cocos Creator
                    và lập trình game.</p>
                    <p><strong>Phân tích chi tiết:</strong></p>
                    <ul>
                        <li>Engine: ${passResult.engineScore} điểm</li>
                        <li>Programming: ${passResult.programmingScore} điểm</li>
                        <li>Performance: ${passResult.performanceScore || 0} điểm</li>
                        <li>Feature: ${passResult.featureScore || 0} điểm</li>
                        <li>Soft Skills: ${passResult.softScore || 0} điểm</li>
                    </ul>
                    <p><strong>Khuyến nghị:</strong> Phù hợp cho vị trí Junior Game Developer
                    với sự hướng dẫn ban đầu.</p>
                </div>
            `;
            recommendationClass = 'pass';
        } else {
            recommendation = `
                <div class="recommendation-fail">
                    <h4>❌ CHƯA ĐẠT YÊU CẦU</h4>
                    <p>Ứng viên đạt điểm ${totalScore}/${maxScore} (${percentage.toFixed(1)}%)
                    nhưng chưa đáp ứng đủ tiêu chí. Cần cải thiện kiến thức về Cocos Creator
                    và lập trình game.</p>
                    <p><strong>Phân tích chi tiết:</strong></p>
                    <ul>
                        <li>Engine: ${passResult.engineScore} điểm</li>
                        <li>Programming: ${passResult.programmingScore} điểm</li>
                        <li>Performance: ${passResult.performanceScore || 0} điểm</li>
                        <li>Feature: ${passResult.featureScore || 0} điểm</li>
                        <li>Soft Skills: ${passResult.softScore || 0} điểm</li>
                    </ul>
                    <p><strong>Khuyến nghị:</strong> Cần đào tạo thêm hoặc xem xét vị trí
                    Fresher với chương trình đào tạo chuyên sâu.</p>
                </div>
            `;
            recommendationClass = 'fail';
        }

        recommendationContainer.innerHTML = recommendation;
        recommendationContainer.className = `recommendation ${recommendationClass}`;
    }

    updateProgress(finished = false) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const prevButton = document.getElementById('prevQuestion');

        // Update prev button state
        if (prevButton) {
            prevButton.disabled = this.currentQuestionIndex === 0;
            prevButton.style.opacity = this.currentQuestionIndex === 0 ? '0.5' : '1';
        }

        if (finished) {
            progressFill.style.width = '100%';
            progressText.textContent = `${this.questions.length}/${this.questions.length} câu hỏi - Hoàn thành`;
        } else {
            const percentage = (this.currentQuestionIndex / this.questions.length) * 100;
            progressFill.style.width = `${percentage}%`;
            progressText.textContent = `${this.currentQuestionIndex}/${this.questions.length} câu hỏi`;
        }
    }

    getResultsData() {
        return {
            candidateName: this.candidateName,
            timestamp: new Date().toISOString(),
            questionCount: this.questionCount,
            interviewType: this.interviewType,
            questions: this.questions.map((q, index) => ({
                id: q.id,
                group: q.group,
                package: q.package,
                question: q.question,
                score: this.scores[index] || 0
            })),
            totalScore: this.scores.reduce((sum, score) => sum + score, 0),
            maxScore: QuestionsData.getMaxScore(this.questions),
            groupScores: QuestionsData.calculateGroupScores(this.questions, this.scores),
            passResult: QuestionsData.checkPassing(this.questions, this.scores)
        };
    }

    exportResults() {
        const results = this.getResultsData();

        const dataStr = JSON.stringify(results, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `interview-results-${this.candidateName}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Session Management Methods
    checkExistingSession() {
        const existingSession = localStorage.getItem('interviewSession');
        if (existingSession) {
            try {
                this.currentSession = JSON.parse(existingSession);

                // Kiểm tra xem session có hợp lệ không
                if (this.currentSession && this.currentSession.candidateName &&
                    this.currentSession.questions && this.currentSession.questions.length > 0) {
                    // Có session chưa hoàn thành - hiển thị thông tin và nút resume
                    this.showSessionInfo();
                    this.showStartPanel();
                } else {
                    // Session không hợp lệ - xóa và hiển thị start panel
                    localStorage.removeItem('interviewSession');
                    this.showStartPanel();
                }
            } catch (error) {
                console.error('Lỗi đọc session:', error);
                localStorage.removeItem('interviewSession');
                this.showStartPanel();
            }
        } else {
            // Không có session - hiển thị start panel
            this.showStartPanel();
        }
    }

    showSessionInfo() {
        if (this.currentSession) {
            document.getElementById('sessionCandidateName').textContent = this.currentSession.candidateName;
            document.getElementById('sessionStartTime').textContent = new Date(this.currentSession.startTime).toLocaleString('vi-VN');

            // Tính số câu đã trả lời
            const answeredQuestions = this.currentSession.scores ?
                this.currentSession.scores.filter(score => score > 0).length : 0;

            document.getElementById('sessionProgress').textContent =
                `${answeredQuestions}/${this.currentSession.questionCount} câu hỏi đã trả lời`;

            document.getElementById('sessionInfo').style.display = 'block';
            document.getElementById('resumeInterview').style.display = 'inline-block';
            document.getElementById('clearSession').style.display = 'inline-block';

            // Cập nhật form với thông tin session
            document.getElementById('candidateName').value = this.currentSession.candidateName;
            document.getElementById('questionCount').value = this.currentSession.questionCount;
            document.getElementById('interviewType').value = this.currentSession.interviewType;
        }
    }

    startNewInterview() {
        const candidateName = document.getElementById('candidateName').value.trim();
        const questionCount = parseInt(document.getElementById('questionCount').value);
        const interviewType = document.getElementById('interviewType').value;

        if (!candidateName) {
            alert('Vui lòng nhập tên ứng viên!');
            return;
        }

        this.candidateName = this.generateUniqueName(candidateName);
        this.questionCount = questionCount;
        this.interviewType = interviewType;

        // Create new session (questions will be generated in startInterview)
        this.currentSession = {
            candidateName: this.candidateName,
            questionCount: this.questionCount,
            interviewType: this.interviewType,
            startTime: new Date().toISOString(),
            currentQuestionIndex: 0,
            questions: null, // Will be set in startInterview
            scores: []
        };

        this.startInterview();
    }

    resumeInterview() {
        if (this.currentSession) {
            this.candidateName = this.currentSession.candidateName;
            this.questionCount = this.currentSession.questionCount;
            this.interviewType = this.currentSession.interviewType;
            this.currentQuestionIndex = this.currentSession.currentQuestionIndex;
            this.questions = this.currentSession.questions;
            this.scores = this.currentSession.scores;

            this.startInterview();
        }
    }

    generateUniqueName(baseName) {
        const existingSessions = this.getAllSessions();
        const today = new Date().toISOString().split('T')[0];

        // Check if name exists today
        const todaySessions = existingSessions.filter(session =>
            session.candidateName === baseName &&
            session.startTime.startsWith(today)
        );

        if (todaySessions.length === 0) {
            return baseName;
        }

        // Add timestamp to make unique
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
        return `${baseName}_${timeStr}`;
    }

    getAllSessions() {
        const sessions = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('interviewSession_')) {
                try {
                    const session = JSON.parse(localStorage.getItem(key));
                    sessions.push(session);
                } catch (error) {
                    console.error('Lỗi đọc session:', error);
                }
            }
        }
        return sessions;
    }

    saveSession() {
        if (this.currentSession) {
            this.currentSession.currentQuestionIndex = this.currentQuestionIndex;
            this.currentSession.questions = this.questions;
            this.currentSession.scores = this.scores;
            this.currentSession.lastUpdated = new Date().toISOString();

            localStorage.setItem('interviewSession', JSON.stringify(this.currentSession));
        }
    }

    saveCompletedInterview() {
        if (this.currentSession) {
            const sessionKey = `interviewSession_${this.currentSession.candidateName}_${this.currentSession.startTime}`;
            this.currentSession.completed = true;
            this.currentSession.endTime = new Date().toISOString();
            this.currentSession.results = this.getResultsData();

            localStorage.setItem(sessionKey, JSON.stringify(this.currentSession));
            localStorage.removeItem('interviewSession'); // Remove active session
        }
    }

    clearSession() {
        if (confirm('Bạn có chắc chắn muốn xóa session hiện tại? Hành động này không thể hoàn tác.')) {
            localStorage.removeItem('interviewSession');
            this.currentSession = null;

            // Reset form
            document.getElementById('candidateName').value = '';
            document.getElementById('questionCount').value = '10';
            document.getElementById('interviewType').value = 'core';

            // Hide session info
            document.getElementById('sessionInfo').style.display = 'none';
            document.getElementById('resumeInterview').style.display = 'none';
            document.getElementById('clearSession').style.display = 'none';

            // Show start panel
            this.showStartPanel();
        }
    }

    showStartPanel() {
        document.getElementById('startPanel').style.display = 'block';
        document.getElementById('interviewPanel').style.display = 'none';
        document.getElementById('resultsPanel').style.display = 'none';
        this.isInterviewActive = false;
    }

    exportPDF() {
        // Simple PDF export using browser print
        const printWindow = window.open('', '_blank');
        const resultsData = this.getResultsData();

        printWindow.document.write(`
            <html>
                <head>
                    <title>Kết quả phỏng vấn - ${resultsData.candidateName}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1, h2 { color: #2c3e50; }
                        .score-summary { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
                        .detailed-results { margin: 20px 0; }
                        .question-item { margin: 15px 0; padding: 10px; border-left: 3px solid #007bff; }
                        .pass { color: #28a745; }
                        .fail { color: #dc3545; }
                    </style>
                </head>
                <body>
                    <h1>📊 Kết quả phỏng vấn Junior Game Developer</h1>
                    <h2>Ứng viên: ${resultsData.candidateName}</h2>
                    <p><strong>Ngày phỏng vấn:</strong> ${new Date().toLocaleDateString('vi-VN')}</p>

                    <div class="score-summary">
                        <h3>📈 Tổng kết điểm số</h3>
                        <p><strong>Tổng điểm:</strong> ${resultsData.totalScore}/${resultsData.maxScore}</p>
                        <p><strong>Kết quả:</strong> <span class="${resultsData.passResult.passed ? 'pass' : 'fail'}">${resultsData.passResult.passed ? '✅ ĐẠT' : '❌ CHƯA ĐẠT'}</span></p>
                    </div>

                    <div class="detailed-results">
                        <h3>📋 Chi tiết từng câu hỏi</h3>
                        ${resultsData.questions.map((q, index) => `
                            <div class="question-item">
                                <h4>Câu ${index + 1}: ${q.question}</h4>
                                <p><strong>Nhóm:</strong> ${q.group} | <strong>Điểm:</strong> ${q.score}/3</p>
                            </div>
                        `).join('')}
                    </div>
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.print();
    }

    showError(message) {
        alert(message);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InterviewApp();
});
