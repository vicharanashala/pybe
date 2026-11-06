"""Original-only catalog: never extract or restyle the submitted lesson contents."""
import json
import re

PENDING = [
 ('comprehensions','collections','Comprehensions','A dedicated story for list, set, and dictionary comprehensions.'),
 ('regex','collections','Regular expressions','Find and validate text patterns with Python’s re module.'),
 ('serialization','reliability','JSON & CSV serialization','Move structured information between files and Python objects.'),
 ('testing','reliability','Testing Python code','Write assertions, test edge cases, and learn unit testing.'),
 ('type-hints','special','Type hints','Describe the inputs and outputs of Python code with annotations.'),
 ('dataclasses','objects','Dataclasses','Model records with generated initialization and comparison methods.'),
 ('asyncio','special','Async / await & asyncio','Coordinate waiting tasks using coroutines and an event loop.'),
 ('http','special','HTTP requests & APIs','Request data from a service and handle its responses.'),
 ('sqlite','reliability','SQLite & databases','Store, query, and update persistent records using SQL.'),
 ('environments','foundations','Packages, pip & virtual environments','Set up a reproducible Python environment and install packages.'),
 ('context-protocol','special','Custom context managers','Design resource cleanup with __enter__, __exit__, and contextlib.'),
]

def finalize(ROOT,SUB,OUT,concepts,stories,BUCKETS,stable_id,add):
    add('Samruddhi Chate','Mia’s Smart Parking Gate','functions',evidence='README.md')
    add('Neeraj Agrawal','The Cricket Chase','for while',evidence='pybe-iteration-feature/README.md')
    add('Neeraj Agrawal','Loop Control Discovery','control',evidence='pybe-loopcontrols-standalone/README.md')
    add('Hemanth_Kumar_Reddy','Treasure Kingdom','generators',evidence='README.md')
    add('Prasoon Lawania','Python Arcade: Pet, Pixels & Invaders','conditionals nested for while',evidence='README.md')
    add('Prasoon Lawania','Python Case Study Engine','types functions strings indexing exceptions errors lists dictionaries files',evidence='server/src/data/content.json')
    add('Saksham Sharma','Loops: Reason, Discover & Build','for while control',evidence='server/src/data/content.json')
    add('Ansh','Sorting & Searching Basics','sorting',evidence='server/src/data/content.json')
    add('Namrata Saha','Py-Betaal Tales','variables conditionals for while lists functions',evidence='README.md')
    add('Akash','Samsung OOP Stories','classes encapsulation inheritance polymorphism abstraction',evidence='CASE_STUDIES_README.md')
    add('Harshal Ganatra','The Thieves at the Well','functions scope while conditionals',evidence='server/src/data/db.json')
    add('Damanpreet Singh','The Royal Bakery & Thirsty Crow','for while',evidence='README.md')
    add('Putta_Sri_Tejaswi','Python Through Story Traditions','variables arithmetic comparison strings lists tuples sets dictionaries conditionals for while functions indexing sorting filtering modules validation memory',evidence='src/data/curriculum.ts')
    # Scope follows the actual Rosewood topics rather than a generated companion.
    for s in stories:
        if s['author']=='Jasdeep Kaur' and 'Gurukul' in s['title']:
            s['mode']='original';s['entry']='/submissions/Jasdeep Kaur/gurukul/index.html'
        if s['author']=='Simranjit Kaur':
            s['mode']='original';s['entry']='/submissions/Simranjit Kaur/palace-storybook/index.html'
    stories.append(dict(id=stable_id('story','Rekha Battu','Why Classes Exist'),title='Why Classes Exist',author='Rekha Battu',concepts=['classes'],mode='original',entry='/other-submissions/pybe-class/index.html',description='Discover the need for a reusable student format through twelve observations.',source='rekhabattu-pr/pybe-class/README.md'))

    def load(path):return json.loads(path.read_text(encoding='utf-8-sig'))
    def vite_package(directory):
        file=directory/'package.json'
        if not file.is_file():return False
        p=load(file)
        return 'vite' in (p.get('dependencies',{})|p.get('devDependencies',{}))
    def frontend_for(s):
        source=ROOT/s['source'];author_root=SUB/s['author']
        parent=source.parent
        while parent.is_relative_to(author_root):
            if vite_package(parent):return parent
            for child in ['client','frontend']:
                if vite_package(parent/child):return parent/child
            if parent==author_root:break
            parent=parent.parent
        return None

    applications={}
    for s in stories:
        s['presentation']='original'
        if s['mode']=='original':continue
        frontend=frontend_for(s)
        if frontend:
            p=load(frontend/'package.json')
            backend=None
            for candidate in [frontend.parent/'server',frontend.parent/'backend']:
                if (candidate/'package.json').is_file():
                    scripts=load(candidate/'package.json').get('scripts',{})
                    command=scripts.get('start','')
                    match=re.fullmatch(r'node\s+([\w./-]+\.js)',command.strip())
                    if match and (candidate/match[1]).is_file():
                        entry=candidate/match[1]
                        text=entry.read_text(encoding='utf-8-sig')
                        port=re.search(r'process\.env\.PORT\s*\|\|\s*[\'"]?(\d+)',text)
                        backend=dict(directory=candidate.relative_to(ROOT).as_posix(),entry=match[1],port=int(port[1]) if port else 5000)
                    break
            # These originals are entirely frontend lessons; their sibling server only tracks optional progress.
            if s['author'] in ['Simran','sheetal']:backend=None
            relative=frontend.relative_to(ROOT).as_posix()
            app_id=stable_id('app',relative)
            version=re.search(r'\d+',(p.get('dependencies',{})|p.get('devDependencies',{})).get('vite',''))
            applications[app_id]=dict(id=app_id,kind='vite',directory=relative,backend=backend,modernNode=not version or int(version[0])>=7)
            s['mode']='application';s['appId']=app_id
            s['launchPath']='/learn' if s['author'] in ['Saksham Sharma','Ansh'] or s['title']=='Python Case Study Engine' else '/pixel' if 'Arcade' in s['title'] else '/'
        elif s['author']=='Mohammad Hamdan':
            app_id=stable_id('app',s['source'])
            applications[app_id]=dict(id=app_id,kind='streamlit',directory=(ROOT/s['source']).parent.relative_to(ROOT).as_posix(),entry='app.py')
            s['mode']='application';s['appId']=app_id;s['launchPath']='/'
        else:
            s['mode']='source'
            s['setupNote']='This submission is a Python script / written case study. Open the original source and its README to run it as submitted.'

    for c in concepts:
        c['status']='covered'
        c['storyIds']=[s['id'] for s in stories if c['id'] in s['concepts']]
        c['playableCount']=sum(s['mode'] in ['original','application'] for s in stories if c['id'] in s['concepts'])
        assert c['storyIds'],c['id']
    for id,bucket,title,description in PENDING:
        concepts.append(dict(id=id,bucket=bucket,title=title,description=description,skills=[],storyIds=[],playableCount=0,status='pending',proposed=True))
    inventory=[]
    for directory in sorted(SUB.iterdir(),key=lambda p:p.name.lower()):
        if not directory.is_dir():continue
        matched=[s for s in stories if s['author']==directory.name]
        inventory.append(dict(author=directory.name,stories=[s['id'] for s in matched],status='Cataloged' if matched else 'Platform / generator / no distinct lesson cataloged'))
    catalog=dict(version=2,buckets=[dict(id=i,title=t,description=d,number=n,icon=icon) for i,t,d,n,icon in BUCKETS],concepts=concepts,stories=stories,applications=list(applications.values()),inventory=inventory,
        backlogNote='Proposed topics for dedicated case studies, not an approved syllabus. Some ideas may be mentioned within existing stories without having a dedicated case study.')
    OUT.mkdir(exist_ok=True)
    (OUT/'catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2),encoding='utf-8')
    lines=['# PyBe: submitted and pending concepts','',f'{sum(c["status"]=="covered" for c in concepts)} covered concept groups; {len(PENDING)} proposed pending topics; {len(stories)} original submission entries.','',
        'The library opens original HTML pages or launches original applications. Student styles, interactions, lesson order, and content are not adapted into a shared reader. Application dependencies are installed on first launch; some originals require external services or Python packages.','']
    for bid,title,*_ in BUCKETS:
        lines += ['## '+title,'']
        for c in [c for c in concepts if c['bucket']==bid]:
            lines += [f'### {c["title"]} — {"Submitted" if c["status"]=="covered" else "Pending · proposed"}','',c['description'],'']
            for s in stories:
                if c['id'] in s['concepts']:lines += [f'- {s["title"]} — {s["author"]}. Original {s["mode"]}. Source: `{s["source"]}`']
            lines += ['']
    lines += ['## Proposed backlog','',catalog['backlogNote'],'','## Submission audit','']
    lines += [f'- **{i["author"]}**: {i["status"]}.' for i in inventory]
    (ROOT/'CONCEPT_COVERAGE.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
    print(f'Original-only catalog: {len(stories)} entries; {len(applications)} app runtimes; {len(PENDING)} proposed pending topics.')
