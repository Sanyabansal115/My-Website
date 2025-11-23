/**
 * Bug Smasher Game - jQuery Implementation
 * Enhanced version with countdown, good luck message, and bonus zone
 * 
 * This implementation uses jQuery for DOM manipulation and event handling,
 * and jQuery UI for effects and animations.
 */

$(document).ready(function() {
    // Game state variables
    let gameState = {
        score: 0,
        gameTime: 119, // 1:59 in seconds
        gameActive: false,
        gameTimer: null,
        ajaxTimer: null,
        bugMoveTimer: null,
        initialHopInterval: 1500,
        currentHopInterval: 1500,
        canvas: null,
        ctx: null
    };

    // Initialize the game
    initializeGame();

    /**
     * Initialize all game components
     */
    function initializeGame() {
        // Get canvas and context
        gameState.canvas = $('#gameCanvas')[0];
        gameState.ctx = gameState.canvas.getContext('2d');
        
        // Set up event listeners using jQuery
        setupEventListeners();
        
        // Initial display updates
        updateDisplay();
        drawCanvas();
        
        // Position elements initially (hidden)
        positionBug();
        positionGreenZone();
        
        console.log('Bug Smasher Game initialized with jQuery');
    }

    /**
     * Set up all event listeners using jQuery event handling
     */
    function setupEventListeners() {
        // Button event handlers using jQuery
        $('#resetScore').on('click', function() {
            $(this).effect('bounce', { times: 2 }, 300);
            resetScore();
        });

        $('#resetSpeed').on('click', function() {
            $(this).effect('shake', { distance: 5 }, 200);
            resetSpeed();
        });

        $('#startGame').on('click', function() {
            $(this).effect('pulsate', { times: 1 }, 300);
            startGameWithCountdown();
        });

        $('#showRules').on('click', function() {
            $(this).effect('bounce', { times: 1 }, 200);
            showRulesModal();
        });

        $('#closeRules').on('click', function() {
            hideRulesModal();
        });

        // Close modal when clicking outside
        $('#rulesModal').on('click', function(e) {
            if (e.target === this) {
                hideRulesModal();
            }
        });

        // Canvas click handler for bug catching and miss effects
        $('#gameCanvas').on('click', function(event) {
            if (gameState.gameActive) {
                handleCanvasClick(event);
            }
        });

        // Bug click handler with jQuery effects
        $('#bug').on('click', function(event) {
            event.stopPropagation();
            if (gameState.gameActive) {
                catchLadybug();
            }
        });

        // Touch support for mobile devices
        $('#bug').on('touchstart', function(event) {
            event.preventDefault();
            event.stopPropagation();
            if (gameState.gameActive) {
                catchLadybug();
            }
        });

        // Prevent context menu on canvas
        $('#gameCanvas').on('contextmenu', function(e) {
            e.preventDefault();
        });
    }

    /**
     * Handle canvas clicks (for background clicks)
     */
    function handleCanvasClick(event) {
        // Get click position relative to canvas
        const rect = gameState.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Create miss effect positioned relative to game area
        showMissEffect(x, y);
    }

    /**
     * Show visual effect for missed clicks
     */
    function showMissEffect(x, y) {
        const $missEffect = $('<div>').addClass('miss-effect').text('Miss!');
        $missEffect.css({
            position: 'absolute',
            left: x + 'px',
            top: y + 'px',
            color: '#dc3545',
            fontSize: '18px',
            fontWeight: 'bold',
            pointerEvents: 'none',
            zIndex: 15
        });
        
        $('.game-area').append($missEffect);
        
        // Animate the miss effect
        $missEffect.effect('fade', { mode: 'hide' }, 1000, function() {
            $(this).remove();
        });
    }

    /**
     * Show rules modal with jQuery effects
     */
    function showRulesModal() {
        $('#rulesModal').show().effect('fade', { mode: 'show' }, 400);
        $('.rules-content').effect('slide', { direction: 'up' }, 500);
    }

    /**
     * Hide rules modal with jQuery effects
     */
    function hideRulesModal() {
        $('.rules-content').effect('slide', { direction: 'up', mode: 'hide' }, 300, function() {
            $('#rulesModal').effect('fade', { mode: 'hide' }, 200);
        });
    }

    /**
     * Start game with countdown
     */
    function startGameWithCountdown() {
        // Disable start button
        $('#startGame').prop('disabled', true).text('Starting...');
        
        // Show countdown on canvas area
        showCountdown();
    }

    /**
     * Show countdown with effects on canvas area
     */
    function showCountdown() {
        const $countdown = $('#countdown');
        const $number = $('.countdown-number');
        let count = 3;
        
        $countdown.show().effect('fade', { mode: 'show' }, 300);
        
        const countdownInterval = setInterval(() => {
            $number.text(count).removeClass('animate__animated animate__pulse');
            
            // Trigger reflow to restart animation
            $number[0].offsetHeight;
            
            if (count === 1) {
                $('.countdown-text').text('GO!');
            }
            
            // jQuery UI bounce effect for each number
            $number.effect('bounce', { times: 1 }, 800);
            
            count--;
            
            if (count < 0) {
                clearInterval(countdownInterval);
                
                // Hide countdown and show good luck message
                $countdown.effect('fade', { mode: 'hide' }, 300, function() {
                    showGoodLuckMessage();
                });
            }
        }, 1000);
    }

    /**
     * Show good luck message on canvas area
     */
    function showGoodLuckMessage() {
        const $goodLuck = $('#goodLuckMessage');
        
        $goodLuck.show().effect('scale', { 
            percent: 120,
            direction: 'both'
        }, 800, function() {
            // Hide good luck message and start actual game
            setTimeout(() => {
                $goodLuck.effect('fade', { mode: 'hide' }, 400, function() {
                    startGame();
                });
            }, 1000);
        });
    }

    /**
     * Start the actual game
     */
    function startGame() {
        gameState.gameActive = true;
        gameState.gameTime = 119; // Reset timer to 1:59
        
        // Show bug and green zone
        $('#bug').show().effect('bounce', { times: 2 }, 600);
        $('#greenZone').show().effect('pulsate', { times: 2 }, 800);
        
        // Start timers
        startGameTimer();
        startAjaxTimer();
        startBugMovement();
        
        console.log('Game started!');
    }

    /**
     * Start the bug movement timer
     */
    function startBugMovement() {
        // Clear existing timer
        if (gameState.bugMoveTimer) {
            clearInterval(gameState.bugMoveTimer);
        }
        
        // Set new movement timer
        gameState.bugMoveTimer = setInterval(function() {
            if (gameState.gameActive) {
                moveBug();
            }
        }, gameState.currentHopInterval);
    }

    /**
     * Move bug to a random position with jQuery effects
     */
    function moveBug() {
        const $bug = $('#bug');
        const canvas = $('#gameCanvas');
        
        // Calculate boundaries within the canvas
        const maxX = canvas.width() - 50; // bug width + margin
        const maxY = canvas.height() - 45; // bug height + margin  
        const minX = 10;
        const minY = 10;
        
        // Generate random position
        const newX = minX + Math.random() * (maxX - minX);
        const newY = minY + Math.random() * (maxY - minY);
        
        // Apply jQuery UI effect based on score level
        let effectType = 'slide';
        let effectOptions = { direction: getRandomDirection() };
        
        if (gameState.score > 20) {
            effectType = 'bounce';
            effectOptions = { times: 2 };
        } else if (gameState.score > 10) {
            effectType = 'shake';
            effectOptions = { distance: 10 };
        }
        
        // Hide bug with effect, then show at new position
        $bug.effect(effectType, effectOptions, 200, function() {
            // Position bug at new location RELATIVE TO CANVAS
            $bug.css({
                left: newX + 'px',
                top: newY + 'px',
                position: 'absolute'
            });
            
            // Show bug with entrance effect
            $bug.effect('pulsate', { times: 1 }, 300);
        });
    }

    /**
     * Get random direction for slide effects
     */
    function getRandomDirection() {
        const directions = ['up', 'down', 'left', 'right'];
        return directions[Math.floor(Math.random() * directions.length)];
    }

    /**
     * Position bug initially
     */
    function positionBug() {
        $('#bug').css({
            left: '300px',
            top: '200px',
            position: 'absolute'
        });
    }

    /**
     * Position green zone randomly within canvas
     */
    function positionGreenZone() {
        const canvas = $('#gameCanvas');
        
        // Calculate boundaries (keep zone fully within canvas)
        const maxX = canvas.width() - 150; // zone width + margin
        const maxY = canvas.height() - 110; // zone height + margin
        const minX = 10;
        const minY = 10;
        
        // Generate random position
        const zoneX = minX + Math.random() * (maxX - minX);
        const zoneY = minY + Math.random() * (maxY - minY);
        
        $('#greenZone').css({
            left: zoneX + 'px',
            top: zoneY + 'px',
            position: 'absolute'
        });
    }

    /**
     * Check if bug is in green zone
     */
    function isBugInGreenZone() {
        const $bug = $('#bug');
        const $greenZone = $('#greenZone');
        
        const bugPos = $bug.position();
        const zonePos = $greenZone.position();
        
        const bugCenterX = bugPos.left + 22.5; // bug width/2
        const bugCenterY = bugPos.top + 20; // bug height/2
        
        return (bugCenterX >= zonePos.left && 
                bugCenterX <= zonePos.left + 140 &&
                bugCenterY >= zonePos.top && 
                bugCenterY <= zonePos.top + 100);
    }

    /**
     * Handle ladybug catch with jQuery effects
     */
    function catchLadybug() {
        const $bug = $('#bug');
        const bugPosition = $bug.position();
        
        // Check if bug is in green zone for bonus points
        const inGreenZone = isBugInGreenZone();
        const pointsEarned = inGreenZone ? 2 : 1;
        
        // Increment score
        gameState.score += pointsEarned;
        $('#scoreValue').text(gameState.score);
        
        // Show appropriate catch effect
        if (inGreenZone) {
            showBonusEffect(bugPosition.left, bugPosition.top);
            // Move green zone to new location after bonus
            setTimeout(() => {
                positionGreenZone();
                $('#greenZone').effect('bounce', { times: 2 }, 500);
            }, 800);
        } else {
            showCatchEffect(bugPosition.left, bugPosition.top);
        }
        
        // Increase difficulty (make bug move faster)
        gameState.currentHopInterval = Math.max(300, gameState.currentHopInterval - 50);
        updateSpeedIndicator();
        
        // Bug catch effect using jQuery UI - different effects for bonus
        if (inGreenZone) {
            $bug.effect('puff', { percent: 150 }, 400, function() {
                setTimeout(() => moveBug(), 200);
            });
        } else {
            $bug.effect('explode', { pieces: 16 }, 300, function() {
                setTimeout(() => moveBug(), 200);
            });
        }
        
        // Update score display with effect
        $('#scoreValue').parent().effect('highlight', { 
            color: inGreenZone ? '#ffc107' : '#28a745' 
        }, 400);
        
        // Special milestone effects
        if (gameState.score % 10 === 0) {
            showMilestoneEffect();
        }
        
        // Restart movement timer with new speed
        startBugMovement();
        
        console.log(`Ladybug caught! ${inGreenZone ? 'BONUS! ' : ''}Score: ${gameState.score}, Speed: ${gameState.currentHopInterval}ms`);
    }

    /**
     * Show catch effect animation
     */
    function showCatchEffect(x, y) {
        const $bug = $('#bug');
        const bugPos = $bug.position();
        
        const $effect = $('#catchEffect');
        $effect.css({
            left: bugPos.left + 'px',
            top: bugPos.top + 'px',
            display: 'block'
        });
        
        // Animate the effect
        $effect.effect('puff', { percent: 200 }, 800, function() {
            $(this).hide();
        });
    }

    /**
     * Show bonus catch effect animation
     */
    function showBonusEffect(x, y) {
        const $bug = $('#bug');
        const bugPos = $bug.position();
        
        const $effect = $('#bonusEffect');
        $effect.css({
            left: bugPos.left + 'px',
            top: bugPos.top + 'px',
            display: 'block'
        });
        
        // Animate the bonus effect with dramatic jQuery UI effect
        $effect.effect('scale', { 
            percent: 200,
            direction: 'both'
        }, 1000, function() {
            $(this).hide();
        });
        
        // Add screen flash for bonus
        $('body').effect('highlight', { color: '#ffc107' }, 300);
    }

    /**
     * Show milestone celebration effect
     */
    function showMilestoneEffect() {
        $('body').effect('shake', { 
            direction: 'up',
            distance: 10,
            times: 2 
        }, 600);
        
        // Flash score area
        $('.score').addClass('milestone-effect');
        setTimeout(() => {
            $('.score').removeClass('milestone-effect');
        }, 1000);
        
        console.log(`Milestone reached: ${gameState.score} points!`);
    }

    /**
     * Start the main game timer
     */
    function startGameTimer() {
        gameState.gameTimer = setInterval(function() {
            gameState.gameTime--;
            updateTimerDisplay();
            
            if (gameState.gameTime <= 0) {
                endGame();
            }
        }, 1000);
    }

    /**
     * Start AJAX timer simulation using jQuery
     */
    function startAjaxTimer() {
        gameState.ajaxTimer = setInterval(function() {
            // Simulate AJAX call using jQuery (as per assignment requirements)
            simulateAjaxCall();
        }, 3000); // Check every 3 seconds
    }

    /**
     * Simulate AJAX call for timer updates
     */
    function simulateAjaxCall() {
        // Create mock JSON data
        const mockData = {
            timeRemaining: Math.max(0, gameState.gameTime - 1),
            status: gameState.gameActive ? 'active' : 'inactive',
            serverTime: new Date().toISOString()
        };
        
        // Simulate jQuery AJAX call with Promise
        $.when(
            new Promise(resolve => {
                setTimeout(() => resolve(mockData), 100 + Math.random() * 200);
            })
        ).then(function(data) {
            // Process "server" response
            console.log('AJAX Response:', data);
            
            // Visual indicator of AJAX activity
            $('.timer').effect('pulsate', { times: 1 }, 200);
        }).catch(function(error) {
            console.log('AJAX simulation error:', error);
        });
    }

    /**
     * End the game with jQuery effects
     */
    function endGame() {
        gameState.gameActive = false;
        
        // Clear all timers
        if (gameState.gameTimer) clearInterval(gameState.gameTimer);
        if (gameState.bugMoveTimer) clearInterval(gameState.bugMoveTimer);
        if (gameState.ajaxTimer) clearInterval(gameState.ajaxTimer);
        
        // Hide bug and green zone with dramatic effect
        $('#bug').effect('explode', { pieces: 25 }, 800);
        $('#greenZone').effect('clip', { mode: 'hide', direction: 'horizontal' }, 600);
        
        // Update final score and show game over with effect
        $('#finalScore').text(gameState.score);
        updatePerformanceMessage();
        
        // Show game over screen with clip effect
        $('#gameOver').effect('clip', { mode: 'show', direction: 'vertical' }, 600);
        
        // Reset start button with effect
        $('#startGame').text('Start New Game').prop('disabled', false)
                      .effect('bounce', { times: 2 }, 400);
        
        console.log(`Game ended! Final score: ${gameState.score}`);
    }

    /**
     * Update performance message based on score
     */
    function updatePerformanceMessage() {
        let message = '';
        if (gameState.score >= 30) {
            message = '🏆 Amazing! You\'re a Bug Smasher Master!';
        } else if (gameState.score >= 20) {
            message = '🥉 Great job! You\'re getting the hang of it!';
        } else if (gameState.score >= 10) {
            message = '👍 Not bad! Keep practicing!';
        } else {
            message = '🎯 Good try! The ladybugs are tricky to catch!';
        }
        $('#performanceMessage').text(message);
    }

    /**
     * Reset score with jQuery effect
     */
    function resetScore() {
        gameState.score = 0;
        $('#scoreValue').text(gameState.score);
        $('.score').effect('highlight', { color: '#ffc107' }, 500);
        console.log('Score reset');
    }

    /**
     * Reset speed with jQuery effect
     */
    function resetSpeed() {
        gameState.currentHopInterval = gameState.initialHopInterval;
        updateSpeedIndicator();
        
        if (gameState.gameActive) {
            startBugMovement();
        }
        
        $('.speed-indicator').effect('highlight', { color: '#28a745' }, 500);
        console.log('Speed reset to initial value');
    }

    /**
     * Update speed indicator
     */
    function updateSpeedIndicator() {
        let speedText = 'Normal';
        if (gameState.currentHopInterval < 600) {
            speedText = 'Very Fast';
        } else if (gameState.currentHopInterval < 900) {
            speedText = 'Fast';
        } else if (gameState.currentHopInterval < 1200) {
            speedText = 'Medium';
        }
        $('#speedValue').text(speedText);
    }

    /**
     * Update timer display
     */
    function updateTimerDisplay() {
        const minutes = Math.floor(gameState.gameTime / 60);
        const seconds = gameState.gameTime % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        $('#timerValue').text(timeString);
        
        // 15 seconds warning - change canvas to red and show warning
        if (gameState.gameTime === 15) {
            show15SecondWarning();
        }
        
        // Final 10 seconds warning effect
        if (gameState.gameTime <= 10) {
            $('.timer').effect('shake', { distance: 3, times: 1 }, 100);
        }
    }

    /**
     * Show 15 seconds warning with canvas color change
     */
    function show15SecondWarning() {
        // Change canvas background to red
        $('#gameCanvas').css({
            background: 'linear-gradient(45deg, #ffebee 0%, #ffcdd2 50%, #ef5350 100%)'
        });
        
        // Flash the canvas border
        $('#gameCanvas').effect('pulsate', { times: 3 }, 1000);
        
        // Show warning message on canvas
        const $warningMessage = $('<div>').addClass('warning-message').html(`
            <div class="warning-text">⚠️ 15 SECONDS LEFT! ⚠️</div>
            <div class="warning-subtext">Hurry up!</div>
        `);
        
        $warningMessage.css({
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 20,
            color: '#dc3545',
            fontSize: '24px',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
            pointerEvents: 'none'
        });
        
        $('.game-area').append($warningMessage);
        
        // Animate warning message
        $warningMessage.effect('bounce', { times: 3 }, 1200, function() {
            // Fade out after animation
            $(this).effect('fade', { mode: 'hide' }, 800, function() {
                $(this).remove();
            });
        });
        
        // Shake the entire game container
        $('.game-container').effect('shake', { 
            direction: 'left',
            distance: 15,
            times: 3 
        }, 800);
        
        console.log('15 seconds warning triggered!');
    }

    /**
     * Update all display elements
     */
    function updateDisplay() {
        $('#scoreValue').text(gameState.score);
        updateTimerDisplay();
        updateSpeedIndicator();
    }

    /**
     * Draw the canvas background
     */
    function drawCanvas() {
        const ctx = gameState.ctx;
        const canvas = gameState.canvas;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw subtle grid pattern
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x < canvas.width; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y < canvas.height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Draw center target (optional visual aid)
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, 50, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    /**
     * Handle window resize to maintain responsive design
     */
    $(window).on('resize', function() {
        // Reposition elements relative to canvas
        if (gameState.gameActive) {
            positionBug();
            positionGreenZone();
        }
    });

    // Initialize display on page load
    updateDisplay();
    
    console.log('Bug Smasher Game loaded successfully with jQuery and jQuery UI effects!');
});