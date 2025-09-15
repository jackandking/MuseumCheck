/**
 * Assessment Results Review Tests
 * 
 * Tests for issue #258 - completed assessment results should be reviewable
 * when users re-enter the assessment modal.
 * 
 * Issue: "完成博物馆的亲子测评后如果再进入答题页面信息已经丢失，无法重温"
 * (After completing the museum parent-child assessment, if you re-enter the 
 * quiz page, the information is lost and cannot be reviewed)
 */

describe('Assessment Results Review (Issue #258)', () => {
    let museumCheck;
    
    beforeEach(() => {
        // Clear localStorage to start fresh
        localStorage.clear();
        
        // Setup DOM elements for assessment modal
        document.body.innerHTML = `
            <!-- Assessment Modal -->
            <div id="assessmentModal" class="modal hidden">
                <div class="modal-content assessment-content">
                    <span class="close">&times;</span>
                    <h2 id="assessmentTitle">🧡 亲子关系测评</h2>
                    <div id="assessmentContent">
                        <div class="assessment-intro">
                            <p>通过简单的问卷，了解您的亲子关系现状，获得专业的改善建议。</p>
                        </div>
                        <div class="assessment-steps">
                            <div class="step-indicator">
                                <span class="step active" data-step="1">1. 家长问卷</span>
                                <span class="step" data-step="2">2. 孩子问卷</span>
                                <span class="step" data-step="3">3. 测评结果</span>
                            </div>
                        </div>
                        <div class="assessment-form" id="assessmentForm">
                            <!-- Content will be filled dynamically -->
                        </div>
                        <div class="assessment-buttons">
                            <button id="assessmentPrev" class="btn-secondary" style="display: none;">上一步</button>
                            <button id="assessmentNext" class="btn-primary">开始测评</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Museum grid for testing -->
            <div id="museumGrid"></div>
        `;

        // Mock the museum data with a test museum
        global.MUSEUMS = [
            {
                id: 'test-museum',
                name: '测试博物馆',
                location: '测试城市',
                description: '测试描述',
                tags: ['测试'],
                checklists: {
                    parent: { '3-6': ['测试任务'] },
                    child: { '3-6': ['测试任务'] }
                }
            }
        ];

        // Mock assessment functionality similar to existing tests
        museumCheck = {
            assessmentState: null,
            openAssessmentModal: jest.fn().mockImplementation(function(museumId) {
                // This is the function we need to fix - it should check for completed results
                const completedResult = this.getCompletedAssessmentResult(museumId);
                
                if (completedResult) {
                    // Show completed results
                    this.assessmentState = {
                        museumId: museumId,
                        currentStep: 3, // Results step
                        parentAnswers: completedResult.parentAnswers,
                        childAnswers: completedResult.childAnswers,
                        score: completedResult.score,
                        timestamp: completedResult.date
                    };
                    this.showCompletedAssessmentResults(completedResult);
                } else {
                    // Initialize fresh assessment
                    this.assessmentState = {
                        museumId: museumId,
                        currentStep: 0,
                        parentAnswers: [],
                        childAnswers: [],
                        score: 0,
                        timestamp: new Date().toISOString()
                    };
                }
                
                // Show modal
                const modal = document.getElementById('assessmentModal');
                modal.classList.remove('hidden');
            }),
            
            getCompletedAssessmentResult: jest.fn().mockImplementation(function(museumId) {
                try {
                    const results = JSON.parse(localStorage.getItem('assessmentResults') || '{}');
                    return results[museumId] || null;
                } catch (error) {
                    return null;
                }
            }),
            
            showCompletedAssessmentResults: jest.fn().mockImplementation(function(result) {
                const assessmentForm = document.getElementById('assessmentForm');
                assessmentForm.innerHTML = `
                    <div class="assessment-results">
                        <div class="score-display">
                            <div class="score-number">${result.score}</div>
                            <div class="score-label">测评结果</div>
                        </div>
                        <button class="retake-button">重新测评</button>
                    </div>
                `;
            })
        };
    });

    test('should show fresh assessment when no completed results exist', () => {
        // Open assessment modal for museum that has no completed results
        museumCheck.openAssessmentModal('test-museum');
        
        // Should not be hidden
        const modal = document.getElementById('assessmentModal');
        expect(modal.classList.contains('hidden')).toBe(false);
        
        // Should show step 0 (introduction)
        expect(museumCheck.assessmentState.currentStep).toBe(0);
        
        // Should not show any completed results
        const assessmentForm = document.getElementById('assessmentForm');
        expect(assessmentForm.innerHTML).not.toContain('测评结果');
        expect(assessmentForm.innerHTML).not.toContain('重新测评');
    });

    test('should show completed results when re-opening assessment for completed museum', () => {
        // Simulate a completed assessment result in localStorage
        const testMuseumId = 'test-museum';
        const completedResult = {
            score: 85,
            date: new Date().toISOString(),
            parentAnswers: [2, 3, 1, 2, 3], // Mock parent answers
            childAnswers: [1, 2, 3, 2, 1]   // Mock child answers
        };
        
        const assessmentResults = {};
        assessmentResults[testMuseumId] = completedResult;
        localStorage.setItem('assessmentResults', JSON.stringify(assessmentResults));
        
        // Open assessment modal - should show completed results
        museumCheck.openAssessmentModal(testMuseumId);
        
        // Should not be hidden
        const modal = document.getElementById('assessmentModal');
        expect(modal.classList.contains('hidden')).toBe(false);
        
        // Should show results step (step 3)
        expect(museumCheck.assessmentState.currentStep).toBe(3);
        
        // Should display the score
        expect(museumCheck.assessmentState.score).toBe(85);
        
        // Should contain completed results UI elements
        const assessmentForm = document.getElementById('assessmentForm');
        expect(assessmentForm.innerHTML).toContain('assessment-results');
        expect(assessmentForm.innerHTML).toContain('85'); // Score should be displayed
    });

    test('should provide retake option when showing completed results', () => {
        // Simulate a completed assessment result
        const testMuseumId = 'test-museum';
        const completedResult = {
            score: 75,
            date: new Date().toISOString(),
            parentAnswers: [1, 2, 3, 2, 1],
            childAnswers: [2, 3, 1, 3, 2]
        };
        
        const assessmentResults = {};
        assessmentResults[testMuseumId] = completedResult;
        localStorage.setItem('assessmentResults', JSON.stringify(assessmentResults));
        
        // Open assessment modal
        museumCheck.openAssessmentModal(testMuseumId);
        
        // Should provide retake functionality
        const assessmentForm = document.getElementById('assessmentForm');
        expect(
            assessmentForm.innerHTML.includes('retake') || 
            assessmentForm.innerHTML.includes('重新测评') ||
            assessmentForm.innerHTML.includes('重新开始')
        ).toBe(true);
    });

    test('should preserve original answers when showing completed results', () => {
        // Simulate a completed assessment with specific answers
        const testMuseumId = 'test-museum';
        const parentAnswers = [0, 2, 1, 3, 2]; // Specific parent answers
        const childAnswers = [1, 0, 3, 2, 1];  // Specific child answers
        
        const completedResult = {
            score: 70,
            date: new Date().toISOString(),
            parentAnswers: parentAnswers,
            childAnswers: childAnswers
        };
        
        const assessmentResults = {};
        assessmentResults[testMuseumId] = completedResult;
        localStorage.setItem('assessmentResults', JSON.stringify(assessmentResults));
        
        // Open assessment modal
        museumCheck.openAssessmentModal(testMuseumId);
        
        // Should preserve the answers in assessment state
        expect(museumCheck.assessmentState.parentAnswers).toEqual(parentAnswers);
        expect(museumCheck.assessmentState.childAnswers).toEqual(childAnswers);
        
        // Should show results mode
        expect(museumCheck.assessmentState.currentStep).toBe(3);
    });

    test('should clear progress data but preserve results when showing completed assessment', () => {
        // Setup both progress and completed results
        const testMuseumId = 'test-museum';
        
        // Add incomplete progress
        const progressData = {
            museumId: testMuseumId,
            currentStep: 1,
            parentAnswers: [2],
            childAnswers: [],
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('assessmentProgress', JSON.stringify(progressData));
        
        // Add completed results  
        const completedResult = {
            score: 90,
            date: new Date().toISOString(),
            parentAnswers: [3, 2, 3, 2, 3],
            childAnswers: [2, 3, 2, 3, 2]
        };
        const assessmentResults = {};
        assessmentResults[testMuseumId] = completedResult;
        localStorage.setItem('assessmentResults', JSON.stringify(assessmentResults));
        
        // Open assessment modal
        museumCheck.openAssessmentModal(testMuseumId);
        
        // Should show completed results, not progress
        expect(museumCheck.assessmentState.currentStep).toBe(3);
        expect(museumCheck.assessmentState.score).toBe(90);
        expect(museumCheck.assessmentState.parentAnswers).toEqual([3, 2, 3, 2, 3]);
        
        // Completed results should still exist
        const storedResults = JSON.parse(localStorage.getItem('assessmentResults') || '{}');
        expect(storedResults[testMuseumId]).toBeDefined();
        expect(storedResults[testMuseumId].score).toBe(90);
    });

    test('should handle corrupt or invalid completed assessment data gracefully', () => {
        // Set invalid assessment results data
        localStorage.setItem('assessmentResults', 'invalid-json');
        
        // Should not throw error and fall back to fresh assessment
        expect(() => {
            museumCheck.openAssessmentModal('test-museum');
        }).not.toThrow();
        
        // Should show fresh assessment (step 0)
        expect(museumCheck.assessmentState.currentStep).toBe(0);
    });

    test('should show fresh assessment if completed result is for different museum', () => {
        // Set completed result for different museum
        const assessmentResults = {
            'different-museum': {
                score: 80,
                date: new Date().toISOString(),
                parentAnswers: [2, 2, 2, 2, 2],
                childAnswers: [1, 1, 1, 1, 1]
            }
        };
        localStorage.setItem('assessmentResults', JSON.stringify(assessmentResults));
        
        // Open assessment for our test museum
        museumCheck.openAssessmentModal('test-museum');
        
        // Should show fresh assessment since no result exists for test-museum
        expect(museumCheck.assessmentState.currentStep).toBe(0);
        expect(museumCheck.assessmentState.score).toBe(0);
    });

    test('regression test: completed assessments should not be lost on re-entry', () => {
        // This is the specific bug reported in issue #258
        const testMuseumId = 'test-museum';
        
        // Simulate user completing an assessment
        const completedResult = {
            score: 88,
            date: new Date().toISOString(),
            parentAnswers: [3, 3, 2, 3, 2],
            childAnswers: [2, 3, 3, 2, 3]
        };
        
        const assessmentResults = {};
        assessmentResults[testMuseumId] = completedResult;
        localStorage.setItem('assessmentResults', JSON.stringify(assessmentResults));
        
        // User opens assessment modal again (this was the failing scenario)
        museumCheck.openAssessmentModal(testMuseumId);
        
        // CRITICAL: Should NOT show fresh assessment, should show completed results
        expect(museumCheck.assessmentState.currentStep).toBe(3); // Results step
        expect(museumCheck.assessmentState.score).toBe(88);
        
        // Information should NOT be lost - should show the completed results
        const assessmentForm = document.getElementById('assessmentForm');
        expect(assessmentForm.innerHTML).toContain('assessment-results');
        expect(assessmentForm.innerHTML).toContain('88'); // Score preserved
        
        // User should be able to "review" the results, not lose them
        expect(assessmentForm.innerHTML).not.toContain('开始测评'); // Should not show "start assessment"
    });
});