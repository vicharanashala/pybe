"""Rebuild the local catalog from reviewed submissions; no network or dependencies."""
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SUB = ROOT / 'summership-26-prs'
OUT = ROOT / 'library'
BUCKETS = [
    ('foundations', 'First steps', 'Give information a name. Make your first Python program.', '01', 'sprout'),
    ('flow', 'Decisions & loops', 'Choose a path, repeat an action, and know when to stop.', '02', 'route'),
    ('collections', 'Strings & data structures', 'Find the right home for a word, a list, or a collection.', '03', 'boxes'),
    ('functions', 'Functions & scope', 'Build reusable pieces and understand where names belong.', '04', 'function'),
    ('objects', 'Object-oriented Python', 'Turn related information and behavior into useful objects.', '05', 'shapes'),
    ('reliability', 'Files & exceptions', 'Keep data around and handle the unexpected.', '06', 'shield'),
    ('special', 'Special topics', 'Explore algorithms, memory, visualization, and more.', '07', 'spark'),
]
# Reviewed concept names, descriptions, and the precise skills exposed in navigation.
DEFS = [
 ('variables','foundations','Variables & assignment','Give a value a name and update it over time.','Names; assignment; reassignment'),
 ('types','foundations','Data types','Choose numbers, text, and true-or-false values.','int; float; str; bool; type conversion'),
 ('keywords','foundations','Keywords & identifiers','Discover reserved words and the rules for naming things.','Reserved words; identifiers; case sensitivity'),
 ('output','foundations','Printing & built-in functions','Make information visible with a function call.','print(); parentheses; string literals'),
 ('arithmetic','foundations','Arithmetic operators','Calculate quantities, totals, and remainders.','Addition; subtraction; multiplication; division; modulo'),
 ('comparison','flow','Comparisons & Boolean logic','Ask questions that evaluate to True or False.','Comparison operators; and; or; not'),
 ('conditionals','flow','If, elif & else','Make a different choice when the situation changes.','Branching; nested decisions; elif chains'),
 ('for','flow','For loops & range','Repeat once for each item or a known number of times.','for; range(); iteration; counters'),
 ('while','flow','While loops','Keep going while a condition is true.','while; updates; stopping conditions; infinite loops'),
 ('control','flow','Break, continue & return','Learn when to stop, skip, or leave a function.','break; continue; return; post-check loop pattern'),
 ('nested','flow','Nested loops','Repeat an action inside another repeating action.','Nested iteration; grid patterns'),
 ('truthiness','flow','Truthiness & short-circuiting','Understand how Python evaluates values in conditions.','Truthy/falsy; short-circuit and/or'),
 ('strings','collections','Strings & text processing','Clean, split, join, and format everyday text.','strip; split; join; upper; replace; formatting; parsing'),
 ('indexing','collections','Indexing & slicing','Retrieve a single item or a slice of a sequence.','Zero-based indexing; negative indexes; slices; steps'),
 ('lists','collections','Lists','Keep an ordered collection that can change.','append; insert; remove; pop; sort; len; mutation'),
 ('tuples','collections','Tuples & immutability','Store ordered records whose references stay fixed.','Tuples; mixed types; unpacking; nested mutable values'),
 ('sets','collections','Sets','Keep unique items and compare groups.','Uniqueness; membership; union; intersection; difference'),
 ('dictionaries','collections','Dictionaries & hashing','Connect a unique key directly to a value.','Key-value pairs; get; items; hashing; collisions; lookup costs'),
 ('functions','functions','Defining & calling functions','Turn a repeated task into a reusable operation.','def; calls; parameters; arguments; return values'),
 ('scope','functions','Scope & name resolution','Understand which name Python finds and where.','Local; enclosing; global; built-in; LEGB; global; nonlocal'),
 ('closures','functions','Closures & nested functions','Let a function remember the context that created it.','Nested functions; captured variables; closures'),
 ('recursion','functions','Recursion & backtracking','Solve a smaller version of a problem until a base case.','Base case; recursive calls; call stack; unwinding; backtracking'),
 ('classes','objects','Classes & objects','Create many individual objects from one blueprint.','class; objects; __init__; self; attributes; methods'),
 ('encapsulation','objects','Encapsulation & data hiding','Group state with the methods that safely change it.','Public/internal members; name mangling; property; getters/setters'),
 ('inheritance','objects','Inheritance','Reuse, override, and extend behavior from a parent class.','Parent/child classes; overriding; super; multiple/hybrid inheritance'),
 ('polymorphism','objects','Polymorphism & duck typing','Send the same request to objects with different behavior.','Method dispatch; overriding; duck typing'),
 ('abstraction','objects','Abstraction','Expose a simple operation while hiding implementation details.','Interfaces; implementation hiding'),
 ('files','reliability','File handling & persistence','Read and save information beyond a running program.','RAM vs disk; open; read; readline; write; close; with; file modes'),
 ('exceptions','reliability','Exception handling','Recover from failures and clean up reliably.','try; except; else; finally; raise; exception hierarchy; custom exceptions'),
 ('errors','reliability','Understanding Python errors','Recognize what an error means and choose a recovery.','ValueError; KeyError; TypeError; IndexError; AttributeError; FileNotFoundError; ZeroDivisionError; RecursionError; ImportError'),
 ('validation','reliability','Input validation','Check information before letting it through.','Validation rules; retry patterns; defensive checks'),
 ('sorting','special','Sorting & searching','Arrange information and find what you need.','Linear search; binary search; sorted; reverse; key functions; complexity'),
 ('filtering','special','Filtering & counting','Keep matching items and summarize a collection.','Predicates; accumulation; counting'),
 ('modules','special','Modules & imports','Organize and reuse code from another module.','import; from; reusable modules'),
 ('decorators','special','Decorators','Wrap an operation with behavior before and after it.','Higher-order functions; wrappers; @ syntax'),
 ('generators','special','Iterators & generators','Produce values on demand instead of all at once.','Iterable; iter; next; StopIteration; yield; lazy evaluation'),
 ('memory','special','References, mutation & memory','Follow objects, references, and their lifetime.','References; copying; in-place mutation; stack vs heap; garbage collection'),
 ('threads','special','Multithreading','Coordinate several tasks that spend time waiting.','threading.Thread; start; join; I/O concurrency; GIL caveat'),
 ('plots','special','Data visualization with Matplotlib','Choose a chart that answers the question.','Line; bar; scatter; pie; boxplot; stacked area; chart selection'),
 ('translation','special','Compilers & interpreters','Explore how a computer translates and executes code.','Translators; compilation; interpretation'),
 ('datetime','special','Dates & times','Order events and reason about a timeline.','Datetime parsing; chronological sorting'),
]
concepts = [dict(id=i,bucket=b,title=t,description=d,skills=s.split('; ')) for i,b,t,d,s in DEFS]
stories = []
def stable_id(prefix,*parts):
    return prefix+'-'+hashlib.sha256('\0'.join(parts).encode('utf-8')).hexdigest()[:16]
def add(author, title, ids, entry=None, description=None, evidence=None):
    directory = SUB / author
    if entry:
        assert (directory / entry).is_file(), (author, entry)
    stories.append(dict(id=stable_id('story',author,title), title=title, author=author, concepts=ids.split(),
        mode='original' if entry else 'source',
        entry=f'/submissions/{author}/{entry}' if entry else None,
        description=description or f'Explore {title} through a story-first Python case study.',
        source=str((directory / (evidence or entry or 'README.md')).relative_to(ROOT)).replace('\\','/')))

add('Akshay Vishwakarma','Traffic System: Rules and Names','keywords','index.html','Traffic signals have fixed meanings. New roads need names that follow rules.')
add('Mehak Gupta','The Lost Library of Python','keywords','index.html')
add('Saniya kousar','The Royal Messengers of Oakhaven','output','messenger_in_the_sky/index.html')
add('Ayush_Anand',"The Royal Scribe’s Secret",'strings indexing','index.html')
add('A.S.R.S.S Snigdha','The Royal Supply Scroll','lists','index.html')
add('Bhoomi Gupta','The Sealed Record','tuples','sealed_recod/sealed_record.html')
add('Mannat Balyan','The Wind Crystal Chase','for while control','index.html')
add('Jandhyala Uma Sri Lekha','Birbal and the Royal Reward','conditionals','index.html')
add('Krishanu Das',"Akbar & Birbal’s Royal Tax Registry",'dictionaries','index.html')
add('Manan Jain','Khul Ja Sim Sim','encapsulation','index.html')
add('Mohammed Sameer Inamdar',"The Postman’s Route",'exceptions errors','postman-exceptions/index.html')
add('Kritika',"The High Pass: Swati’s Himalayan Ride",'exceptions errors','index.html')
add('Pradeep Mishra','The Gates of Rajgad','decorators','index.html')
add('Sahil','Humans, Aliens & Translation','translation','index.html')
add('Swastika Mitra',"Rahul’s Kitchen Lab",'files','index.html')
add('Vanshika17-05','The Sets Case Study','sets','sets_case_study/index.html')
add('Writwik Das','Flight 218','variables output lists dictionaries for conditionals functions','Flight 218_v6.html')
add('Yash Parmar','Maple Heights','lists indexing','client/index.html')
add('Ananya-Agarwall2','Flow Tales','control output','Flow Tales.html')
add('hosnnasruti','The Messy Attendance List','strings',evidence='string-manipulation-case-study/case-study.md')
# Runtime-based submissions are listed honestly as sources, not broken HTML links.
for author,title,ids,evidence in [
 ('Abhi Patel','The Monkey and the Crocodile','exceptions','client/src/lesson/lessonData.js'),
 ('Abhi_Mishra','NovaTech Investor Room','plots','README.md'),
 ('Akshra Gupta',"Doraemon’s Stamp Collection & Gadget Codes",'sets dictionaries','README.md'),
 ('Ankit Kumar Prajapati','Iteration Learning Journey','for while','pybe-iteration-feature/client/README.md'),
 ('Anshika Saraswat','Hawkins Division: Functions Field Manual','functions scope closures recursion','README.md'),
 ('Arka Kanji','The Magic of Logic','conditionals comparison','client/src/data.ts'),
 ('Aryan Vaghasiya','Everyday Python: UPI, Addresses & Checklists','tuples dictionaries lists','README.md'),
 ('Aryan Vishala','Recursive Explorer: Ant Colony Adventure','recursion','readme.md'),
 ('Astha','Oracle Journey','exceptions errors','percy-oracle/README.md'),
 ('Deepa Basnet','PyFarm: Maya’s First Harvest','variables conditionals','README.md'),
 ('Dishi Gupta','Rosewood Manor','strings datetime sorting sets recursion','server/src/data/db.json'),
 ('Ghanate Lakshmi','The Raidurg Adventure','for while','src/data/storyData.js'),
 ('Husanpreet Singh','The Hunt for Calico Jack','conditionals','client/src/data/story.js'),
 ('Jasdeep Kaur',"Poko’s Magical Memory",'variables types','README.md'),
 ('Jasdeep Kaur','PyBe Gurukul: Lotus, Well & Bell','for while control','gurukul/README.md'),
 ('Jasvinder Kaur','The Recursion Discovery Journey','recursion','README.md'),
 ('joseph-antony-benedict','The Dictionary Discovery Adventure','dictionaries errors','README.md'),
 ('Kalyanam Hasith','Find and Squash the Bug','variables lists for strings indexing arithmetic comparison conditionals control dictionaries functions','product_file.md'),
 ('Mahi Agarwal',"Robo’s Magic Loop & Doraemon’s Memory Pockets",'for while variables','README.md'),
 ('Manav Bhatt','The Lost Kingdom of Python','lists tuples sets dictionaries','client/index.html'),
 ('Mohammad Hamdan',"Dabbo’s Orchard",'variables types arithmetic','app.py'),
 ('NIKHIL KUMAR','The Memory Modules','memory','context.md'),
 ('Nikhil-Kumawat','Dashavatara: The Many Forms','polymorphism','dashavatara-polymorphism/README.md'),
 ('Nikhil-Kumawat','The Mela Gatekeeper','truthiness','village-mela-truthiness/README.md'),
 ('Pramod Sharma','One Restaurant, Many Orders','threads','src/main.jsx'),
 ('Pritam_Patra',"The Wildlife Observer’s Field Journal",'inheritance','README.md'),
 ('RAVADA LAKSHITHA','Adder','functions','Adder/client/src/lessons/content/adderContent.js'),
 ('Reddy-02','The Dasara Festival Discovery Lab','exceptions errors','README.md'),
 ('Rohith N R','The Tuple Analogy Playground','tuples','tuple-analogy/README.md'),
 ('Sanjana_Posannapeta','The Campus Fest','scope','README.md'),
 ('Sharanu','The Dharma Validator','exceptions errors','src/learning/lessons/registry.ts'),
 ('sheetal','Creation: The Art of the Eternal Mold','classes','README.md'),
 ('Simran','Sign the Squad','classes','README.md'),
 ('Simran','The Bird Family','inheritance','README.md'),
 ('Simranjit Kaur','The Palace of Whispers','scope','palace-storybook/README.md'),
 ('Somya  Kapoor','Tiffin Trail','functions scope closures','tiffin trail-case study/src/TiffinTrail.jsx'),
 ('Vanisha Tiwari',"Buddy’s Magic Pet Shop",'encapsulation classes','README.md'),
]:
    assert (SUB/author/evidence).is_file(), (author,evidence)
    add(author,title,ids,evidence=evidence)


from original_catalog import finalize
finalize(ROOT,SUB,OUT,concepts,stories,BUCKETS,stable_id,add)
