import re

def update_priya():
    with open('C:\\Users\\skaja\\PrototyBe\\panchayat-bubble-sort-v5\\index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Update JS Logic for 10 slides
    content = content.replace("const TOTAL=9;let cur=0;", "const TOTAL=10;let cur=0;")
    content = content.replace("d.className='progress-dot '+(i<6?'sd':'pd')", "d.className='progress-dot '+(i<7?'sd':'pd')")
    content = content.replace("const isP=cur>=6;", "const isP=cur>=7;")
    content = content.replace("xb.disabled=cur>=8;", "xb.disabled=cur>=9;")
    content = content.replace("if(cur===6&&!quizStarted)startQuiz(); if(cur===7&&!practiceStarted)startPractice(); if(cur===8&&!visualizerStarted)startVisualizer();", "if(cur===7&&!quizStarted)startQuiz(); if(cur===8&&!practiceStarted)startPractice(); if(cur===9&&!visualizerStarted)startVisualizer();")
    content = content.replace("if((cur===5&&n===6)||(cur===6&&n===5)){", "if((cur===6&&n===7)||(cur===7&&n===6)){")
    content = content.replace("if((cur<=5&&i>=6)||(cur>=6&&i<=5)){", "if((cur<=6&&i>=7)||(cur>=7&&i<=6)){")
    
    # 2. Add Priya's Thoughts to existing slides
    # Slide 0
    content = content.replace('<div class="dialogue" style="animation-delay:.5s"><div class="speaker">Raju</div><div class="line">"What a mess..."</div></div>',
                              '<div class="dialogue" style="animation-delay:.5s"><div class="speaker">Raju</div><div class="line">"What a mess..."</div></div>\n<div class="fox-thought" style="animation-delay:.7s">Priya watched from the doorway. <em>Interesting...</em></div>')
    
    # Slide 1
    content = content.replace('<div class="dialogue" style="animation-delay:.6s"><div class="speaker">Prahlad Kaka</div><div class="line">"Don\'t sort everything at once, Raju. Just compare two books next to each other."</div></div>',
                              '<div class="dialogue" style="animation-delay:.6s"><div class="speaker">Prahlad Kaka</div><div class="line">"Don\'t sort everything at once, Raju. Just compare two books next to each other."</div></div>\n<div class="fox-thought" style="animation-delay:.9s"><em>Ah, breaking down the problem,</em> Priya noted.</div>')

    # Slide 2
    content = content.replace('<div class="dialogue" style="animation-delay:.6s"><div class="speaker">Raju</div><div class="line">"Encyclopedia is taller! Swap, and step right."</div></div>',
                              '<div class="dialogue" style="animation-delay:.6s"><div class="speaker">Raju</div><div class="line">"Encyclopedia is taller! Swap, and step right."</div></div>\n<div class="fox-thought" style="animation-delay:.9s"><em>A very logical approach.</em></div>')

    # Slide 4
    content = content.replace('<div class="dialogue" style="animation-delay:.6s"><div class="speaker">Prahlad Kaka</div><div class="line">"Stop! Zero swaps means they are perfectly ordered!"</div></div>',
                              '<div class="dialogue" style="animation-delay:.6s"><div class="speaker">Prahlad Kaka</div><div class="line">"Stop! Zero swaps means they are perfectly ordered!"</div></div>\n<div class="fox-thought" style="animation-delay:.9s"><em>Efficiency at its finest,</em> Priya smiled.</div>')


    # 3. Insert new Scene 5 (Summary) and shift indices
    # First, let's find Scene 5 (The Perfect Library) and change its index to 6
    content = content.replace('<div class="slide story-slide" data-index="5">', '<div class="slide story-slide" data-index="6">')
    # Change Quiz to 7
    content = content.replace('<div class="slide pycrates-slide" data-index="6">', '<div class="slide pycrates-slide" data-index="7">')
    # Change Practice to 8
    content = content.replace('<div class="slide pycrates-slide" data-index="7">', '<div class="slide pycrates-slide" data-index="8">')
    # Change Visualizer to 9
    content = content.replace('<div class="slide pycrates-slide" data-index="8">', '<div class="slide pycrates-slide" data-index="9">')

    # Now define the new Scene 5
    new_scene = """
<div class="slide story-slide" data-index="5">
<div class="slide-image-wrap"><img src="assets/images/scene6.jpg" alt="Priya asks a question"></div>
<div class="slide-text"><div class="slide-subtitle">The Summary</div>
<div class="slide-title">Scene 6: Priya's Question</div>
<p class="narration">Priya steps forward from the doorway, amazed by the organized shelf.</p>
<div class="dialogue" style="animation-delay:.3s"><div class="speaker">Priya</div><div class="line">"Wait, how did you fix that huge mess so fast?"</div></div>
<div class="dialogue" style="animation-delay:.5s"><div class="speaker">Raju</div><div class="line">"It's easy! First, you only look at two books next to each other."</div></div>
<div class="dialogue" style="animation-delay:.7s"><div class="speaker">Prahlad Kaka</div><div class="line">"If the left one is taller, you swap them."</div></div>
<div class="dialogue" style="animation-delay:.9s"><div class="speaker">Raju</div><div class="line">"Then you just repeat that until you can sweep the whole shelf with zero swaps!"</div></div>
<div class="fox-thought" style="animation-delay:1.1s"><em>Compare, swap, repeat, stop. I've got it!</em></div></div></div>
"""
    # Insert new_scene right before the renamed data-index="6"
    content = content.replace('<div class="slide story-slide" data-index="6">', new_scene + '\n<div class="slide story-slide" data-index="6">')
    
    # 4. Update image names to scene7 for the final scene since we added one
    # In slide 6 (The Perfect Library)
    content = content.replace('<img src="assets/images/scene6.jpg" alt="The Perfect Library">', '<img src="assets/images/scene7.jpg" alt="The Perfect Library">')

    # Update Scene 6 title to Scene 7
    content = content.replace('<div class="slide-title">Scene 6: The Perfect Library</div>', '<div class="slide-title">Scene 7: The Perfect Library</div>')


    # 5. Change Prahlad to Priya in the Quiz/Practice mode
    content = content.replace('prahlad_neutral.png', 'priya_neutral.png')
    content = content.replace('prahlad_happy.png', 'priya_happy.png')
    content = content.replace('prahlad_sad.png', 'priya_sad.png')
    content = content.replace('Prahlad neutral', 'Priya neutral')
    content = content.replace('Prahlad happy', 'Priya happy')
    content = content.replace('Prahlad sad', 'Priya sad')

    with open('C:\\Users\\skaja\\PrototyBe\\panchayat-bubble-sort-v5\\index.html', 'w', encoding='utf-8') as f:
        f.write(content)

update_priya()
