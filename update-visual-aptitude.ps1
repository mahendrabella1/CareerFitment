
# Script to add visual pattern questions to Class 6 and 7 aptitude sections

$visualQuestions = @{
    23 = @{
        text = "Which pattern completes the sequence?"
        options = @("►", "▼", "◄", "▲")
        media = @{
            type = "sequence"
            items = @("▲", "►", "▼", "◄", "▲", "?")
        }
        answerKey = "A"  # ▲
        code = "spatial_sequence"
    }
    25 = @{
        text = "Look at this 3×3 grid. Which shape should replace the question mark?"
        options = @("●", "■", "▲", "◆")
        media = @{
            type = "grid"
            cells = @("▲", "●", "■", "●", "■", "▲", "■", "▲", "?")
            cols = 3
        }
        answerKey = "A"  # ●
        code = "matrix_reasoning"
    }
    28 = @{
        text = "Which block should come next in this rotation pattern?"
        options = @("↻", "↺", "→", "↓")
        media = @{
            type = "sequence"
            items = @("◰", "◱", "◲", "◳", "?")
        }
        answerKey = "A"  # ◰
        code = "spatial_rotation"
    }
    30 = @{
        text = "Complete the pattern: Which shape goes in the empty space?"
        options = @("▨", "▦", "▥", "▣")
        media = @{
            type = "grid"
            cells = @("▨", "▦", "▥", "▦", "▥", "▨", "▥", "▨", "?")
            cols = 3
        }
        answerKey = "A"  # ▨
        code = "pattern_completion"
    }
}

# Load Class 6
$class6Path = "data/class6-assessment-questions.json"
$class6 = Get-Content $class6Path -Raw | ConvertFrom-Json

# Update Class 6 questions
foreach ($qNum in @(23, 25, 28, 30)) {
    $idx = $qNum - 1  # Array index
    $vq = $visualQuestions[$qNum]

    $class6.questions[$idx].text = $vq.text
    $class6.questions[$idx].options = $vq.options
    $class6.questions[$idx].media = $vq.media
    $class6.questions[$idx] | Add-Member -MemberType NoteProperty -Name "answerKey" -Value $vq.answerKey -Force
    $class6.questions[$idx] | Add-Member -MemberType NoteProperty -Name "code" -Value $vq.code -Force
}

# Save Class 6
$class6 | ConvertTo-Json -Depth 10 | Set-Content $class6Path

# Load Class 7
$class7Path = "data/class7-assessment-questions.json"
$class7 = Get-Content $class7Path -Raw | ConvertFrom-Json

# Update Class 7 questions (same visual questions, increased difficulty slightly in description)
$visualQuestionsC7 = @{
    23 = @{
        text = "Identify the pattern and select what comes next."
        options = @("●", "■", "▲", "◆")
        media = @{
            type = "sequence"
            items = @("▲", "▲●", "▲●■", "▲●■▲", "?")
        }
        answerKey = "B"  # ■
        code = "spatial_pattern"
    }
    25 = @{
        text = "Study this 3×3 matrix. What should replace the question mark?"
        options = @("▲", "●", "■", "◆")
        media = @{
            type = "grid"
            cells = @("▲", "●", "■", "●", "■", "●", "■", "▲", "?")
            cols = 3
        }
        answerKey = "B"  # ●
        code = "matrix_logic"
    }
    28 = @{
        text = "Which shape completes the rotation sequence?"
        options = @("◰", "◱", "◲", "◳")
        media = @{
            type = "sequence"
            items = @("◰", "◱", "◲", "◳", "?")
        }
        answerKey = "A"  # ◰
        code = "spatial_rotation"
    }
    30 = @{
        text = "Study the pattern across rows and columns. What belongs in the empty space?"
        options = @("▨", "▦", "▥", "▣")
        media = @{
            type = "grid"
            cells = @("▨", "▦", "▨", "▦", "▥", "▦", "▥", "▨", "?")
            cols = 3
        }
        answerKey = "C"  # ▥
        code = "grid_completion"
    }
}

foreach ($qNum in @(23, 25, 28, 30)) {
    $idx = $qNum - 1
    $vq = $visualQuestionsC7[$qNum]

    $class7.questions[$idx].text = $vq.text
    $class7.questions[$idx].options = $vq.options
    $class7.questions[$idx].media = $vq.media
    $class7.questions[$idx] | Add-Member -MemberType NoteProperty -Name "answerKey" -Value $vq.answerKey -Force
    $class7.questions[$idx] | Add-Member -MemberType NoteProperty -Name "code" -Value $vq.code -Force
}

# Save Class 7
$class7 | ConvertTo-Json -Depth 10 | Set-Content $class7Path

Write-Host "✓ Updated Class 6 aptitude questions with visual patterns" -ForegroundColor Green
Write-Host "✓ Updated Class 7 aptitude questions with visual patterns" -ForegroundColor Green
Write-Host "`nReplaced questions 23, 25, 28, 30 with:" -ForegroundColor Cyan
Write-Host "  - Q23: Pattern Sequence/Matrix Reasoning"
Write-Host "  - Q25: Matrix Logic"
Write-Host "  - Q28: Spatial Rotation"
Write-Host "  - Q30: Grid Pattern Completion"
