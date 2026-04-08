// Questions data loaded from Question.json
let questionsData = null;

// Load questions data from JSON file
async function loadQuestionsData() {
    try {
        const response = await fetch('data/Interview_Questions_Refined.json');
        if (!response.ok) {
            throw new Error('Không thể tải dữ liệu câu hỏi');
        }
        questionsData = await response.json();
        return questionsData;
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        // Fallback data nếu không tải được file
        return getFallbackQuestions();
    }
}

// Fallback data nếu không tải được file JSON
function getFallbackQuestions() {
    return {
        meta: {
            title: "Bộ Câu Hỏi Phỏng Vấn Junior Game Developer (Cocos Creator)",
            version: "1.0",
            totalQuestions: 5,
            packages: ["A", "B", "C"],
            scoreScalePerQuestion: "0-3",
            scoreDefinition: {
                "0": "Sai / Không chạm ý chính",
                "1": "Đúng 1 phần nhỏ, thiếu cấu trúc",
                "2": "Đủ ý cốt lõi cấp Junior",
                "3": "Đầy đủ + best practice / cảnh báo / ví dụ"
            },
            passRules: {
                singlePackage: {
                    maxScore: 15,
                    pass: "Tổng >= 10 AND (Engine + Programming) >= 6 AND Engine >= 3 AND Programming >= 3",
                    strongPass: "Tổng >= 12 (không vi phạm ngưỡng nhóm)"
                }
            }
        },
        questions: [
            {
                id: "A1",
                package: "A",
                group: "Engine",
                question: "Giải thích Prefab là gì trong Cocos Creator và khác việc tạo Node thuần bằng code. Tình huống spawn nhiều item giống nhau chọn cách nào? Vì sao?",
                goal: "Hiểu bản chất prefab, tái sử dụng, bảo trì, workflow",
                coreAnswer: "Prefab là template serialized (node + component + thuộc tính). Thay đổi prefab gốc áp dụng các instance mới; tạo node code thủ công phải khai báo lại → dễ sai lệch. Spawn lặp nên dùng prefab để giảm code lặp, hỗ trợ designer, dễ pooling.",
                acceptableVariants: [
                    "Prefab = mẫu tái sử dụng đồng bộ",
                    "Prefab giúp designer chỉnh không cần sửa code",
                    "Dùng prefab + pool tối ưu spawn"
                ],
                upgradeFor3Points: [
                    "Nêu preload prefab",
                    "So sánh drift config khi code tạo thủ công",
                    "Workflow designer ↔ dev",
                    "Pool kết hợp giảm GC"
                ],
                commonMistakes: [
                    "Nói prefab chạy nhanh hơn node code (không đúng bản chất)",
                    "Không phân biệt template và instance"
                ],
                rubric: {
                    "0": "Không phân biệt hoặc sai",
                    "1": "Chỉ nói tái sử dụng",
                    "2": "Template + đồng bộ + use case spawn nhiều",
                    "3": "Thêm workflow, pooling, bảo trì, tối ưu"
                }
            }
        ]
    };
}

// Get all questions
function getAllQuestions() {
    return questionsData ? questionsData.questions : [];
}

// Get questions by package
function getQuestionsByPackage(packageName) {
    const questions = getAllQuestions();
    return questions.filter(q => q.package === packageName);
}

// Get questions by group
function getQuestionsByGroup(groupName) {
    const questions = getAllQuestions();
    return questions.filter(q => q.group === groupName);
}

// Get random questions with difficulty distribution
function getRandomQuestions(count = 10, interviewType = 'core') {
    const meta = getMetaData();
    if (!meta || !meta.sets) {
        // Fallback to old logic if new structure not available
        return getRandomQuestionsLegacy(count);
    }

    let questionIds = [];
    let shouldShuffle = true;
    let finalCount = count;

    if (interviewType === 'quangminh') {
        // Custom set cho Đặng Vũ Quang Minh (theo interview_plan_quang_minh.md)
        questionIds = ["A1", "A2", "B1", "B9", "C5", "C7", "A8", "A6", "A3", "B10", "A4", "A11", "A13"];
        // Lấy đúng danh sách này không randomize và lấy đủ số lượng
        shouldShuffle = false;
        finalCount = questionIds.length;
    } else if (interviewType === 'core') {
        questionIds = meta.sets.core;
    } else {
        questionIds = [...meta.sets.core, ...meta.sets.bonus];
    }

    const allQuestions = getAllQuestions();

    // Lọc câu hỏi theo ID trong set
    let availableQuestions;
    if (interviewType === 'quangminh') {
        // Giữ đúng thứ tự của questionIds
        availableQuestions = questionIds.map(id => allQuestions.find(q => q.id === id)).filter(Boolean);
    } else {
        availableQuestions = allQuestions.filter(q => questionIds.includes(q.id));
    }

    // Chọn ngẫu nhiên từ danh sách có sẵn (nếu cần)
    const selectedQuestions = [];
    const questionsToPick = shouldShuffle ? shuffleArray([...availableQuestions]) : availableQuestions;

    for (let i = 0; i < Math.min(finalCount, questionsToPick.length); i++) {
        selectedQuestions.push(questionsToPick[i]);
    }

    return selectedQuestions;
}

// Legacy function for backward compatibility
function getRandomQuestionsLegacy(count = 10, difficultyDistribution = { easy: 3, medium: 4, hard: 3 }) {
    const allQuestions = getAllQuestions();

    // Phân loại câu hỏi theo độ khó dựa trên package và group
    const easyQuestions = allQuestions.filter(q =>
        q.package === 'A' && (q.group === 'Engine' || q.group === 'Programming')
    );

    const mediumQuestions = allQuestions.filter(q =>
        q.package === 'B' || (q.package === 'A' && (q.group === 'Performance' || q.group === 'Feature'))
    );

    const hardQuestions = allQuestions.filter(q =>
        q.package === 'C' || (q.package === 'B' && q.group === 'Performance')
    );

    // Chọn câu hỏi ngẫu nhiên theo phân bố
    const selectedQuestions = [];

    // Chọn câu dễ
    for (let i = 0; i < difficultyDistribution.easy && easyQuestions.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * easyQuestions.length);
        selectedQuestions.push(easyQuestions.splice(randomIndex, 1)[0]);
    }

    // Chọn câu trung bình
    for (let i = 0; i < difficultyDistribution.medium && mediumQuestions.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * mediumQuestions.length);
        selectedQuestions.push(mediumQuestions.splice(randomIndex, 1)[0]);
    }

    // Chọn câu khó
    for (let i = 0; i < difficultyDistribution.hard && hardQuestions.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * hardQuestions.length);
        selectedQuestions.push(hardQuestions.splice(randomIndex, 1)[0]);
    }

    // Xáo trộn thứ tự
    return shuffleArray(selectedQuestions);
}

// Shuffle array function
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Get question by ID
function getQuestionById(id) {
    const questions = getAllQuestions();
    return questions.find(q => q.id === id);
}

// Get meta information
function getMetaData() {
    return questionsData ? questionsData.meta : null;
}

// Get pass rules
function getPassRules() {
    const meta = getMetaData();
    return meta ? meta.passRules : null;
}

// Get score definition
function getScoreDefinition() {
    const meta = getMetaData();
    return meta ? meta.scoreDefinition : null;
}

// Calculate total possible score
function getMaxScore(questions, scores = []) {
    // If scores provided, calculate based on non-skipped questions
    if (scores.length > 0) {
        const nonSkippedCount = scores.filter(score => score !== 'skip').length;
        return nonSkippedCount * 3;
    }
    // Default: all questions count
    return questions.length * 3; // 3 points per question
}

// Calculate group scores
function calculateGroupScores(questions, scores) {
    const groupScores = {};
    const groupCounts = {};

    questions.forEach((question, index) => {
        const group = question.group;
        const score = scores[index] || 0;

        // Skip questions with 'skip' value
        if (score === 'skip') {
            return;
        }

        if (!groupScores[group]) {
            groupScores[group] = 0;
            groupCounts[group] = 0;
        }

        groupScores[group] += score;
        groupCounts[group]++;
    });

    // Calculate averages
    const groupAverages = {};
    Object.keys(groupScores).forEach(group => {
        groupAverages[group] = {
            total: groupScores[group],
            count: groupCounts[group],
            average: groupScores[group] / groupCounts[group]
        };
    });

    return groupAverages;
}

// Check if candidate passes
function checkPassing(questions, scores) {
    const meta = getMetaData();
    if (!meta) return { passed: false, reason: "Không có quy tắc đánh giá" };

    const totalScore = scores.reduce((sum, score) => {
        return score === 'skip' ? sum : sum + score;
    }, 0);
    const maxScore = getMaxScore(questions, scores);
    const groupScores = calculateGroupScores(questions, scores);

    // Tính điểm theo nhóm chính
    const engineScore = (groupScores.Engine?.total || 0);
    const programmingScore = (groupScores.Programming?.total || 0);
    const performanceScore = (groupScores.Performance?.total || 0);
    const featureScore = (groupScores.Feature?.total || 0);
    const softScore = (groupScores.Soft?.total || 0);

    const engineProgrammingScore = engineScore + programmingScore;

    // Quy tắc pass mới dựa trên cấu trúc refined
    const totalQuestions = questions.length;
    const passThreshold = Math.ceil(totalQuestions * 0.67); // 67% để pass
    const strongPassThreshold = Math.ceil(totalQuestions * 0.8); // 80% để strong pass

    // Yêu cầu tối thiểu cho các nhóm chính
    const minEngineScore = Math.ceil(engineScore / Math.max(1, groupScores.Engine?.count || 1)) >= 2;
    const minProgrammingScore = Math.ceil(programmingScore / Math.max(1, groupScores.Programming?.count || 1)) >= 2;

    const passed = totalScore >= passThreshold &&
                   engineProgrammingScore >= Math.ceil(totalQuestions * 0.4) && // 40% từ Engine + Programming
                   minEngineScore &&
                   minProgrammingScore;

    const strongPass = totalScore >= strongPassThreshold && passed;

    return {
        passed,
        strongPass,
        totalScore,
        maxScore,
        engineScore,
        programmingScore,
        performanceScore,
        featureScore,
        softScore,
        engineProgrammingScore,
        groupScores,
        passThreshold,
        strongPassThreshold
    };
}

// Get strengths and improvements based on scores
function getStrengthsAndImprovements(questions, scores) {
    const strengths = [];
    const improvements = [];
    const groupScores = calculateGroupScores(questions, scores);

    // Analyze group performance
    Object.keys(groupScores).forEach(group => {
        const avg = groupScores[group].average;
        if (avg >= 2.5) {
            strengths.push(`Thể hiện tốt trong ${group} (${avg.toFixed(1)}/3.0)`);
        } else if (avg < 1.5) {
            improvements.push(`Cần cải thiện ${group} (${avg.toFixed(1)}/3.0)`);
        }
    });

    // Analyze individual questions
    questions.forEach((question, index) => {
        const score = scores[index] || 0;
        if (score >= 2) {
            strengths.push(`Trả lời tốt câu ${question.id}: ${question.group}`);
        } else if (score <= 1) {
            improvements.push(`Cần cải thiện câu ${question.id}: ${question.group}`);
        }
    });

    return { strengths, improvements };
}

// Export functions for use in main app
window.QuestionsData = {
    loadQuestionsData,
    getAllQuestions,
    getQuestionsByPackage,
    getQuestionsByGroup,
    getRandomQuestions,
    getQuestionById,
    getMetaData,
    getPassRules,
    getScoreDefinition,
    getMaxScore,
    calculateGroupScores,
    checkPassing,
    getStrengthsAndImprovements
};
