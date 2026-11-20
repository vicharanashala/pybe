"""Extract the eight inspected Streamlit story branches without importing Streamlit.
Only the original branch statements execute against a recording UI; no server or
learner session is read. Regenerate after an intentional edit to app.py.
"""
import ast
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'case-studies/variables-and-arithmetic-dabbos-orchard/app.py'
OUTPUT = SOURCE.with_name('lesson.json')

class Recorder:
    def __init__(self):
        self.nodes = []
        self.stack = [self.nodes]

    def container(self, **kwargs):
        node = {'kind': 'container', 'children': []}
        self.stack[-1].append(node)
        owner = self
        class Group:
            def __enter__(self): owner.stack.append(node['children'])
            def __exit__(self, *_args): owner.stack.pop()
        return Group()

    def empty(self):
        node = {'kind': 'animation', 'frames': []}
        self.stack[-1].append(node)
        class Frames:
            def __getattr__(self, kind):
                def record(text): node['frames'].append({'kind': kind, 'text': text})
                return record
        return Frames()

    def __getattr__(self, kind):
        def record(*args, **kwargs):
            if kind == 'balloons': return  # A decorative celebration, not story content.
            if kind == 'metric':
                self.stack[-1].append({'kind': kind, 'label': kwargs.get('label', args[0] if args else ''), 'value': kwargs.get('value', args[1] if len(args)>1 else '')})
            else:
                self.stack[-1].append({'kind': kind, 'text': args[0] if args else ''})
        return record


def extract():
    source = SOURCE.read_text(encoding='utf-8')
    tree = ast.parse(source)
    # Only the literal lesson constants and their two arithmetic expressions.
    constants = {}
    for node in tree.body:
        if isinstance(node, ast.Assign) and isinstance(node.targets[0], ast.Name) and node.targets[0].id in {'TOTAL_MANGOES','MANGO_TYPE','RIPENESS','QUANTITY','PRICE','remaining','total_money'}:
            exec(compile(ast.Module(body=[node], type_ignores=[]), str(SOURCE), 'exec'), constants)
    branch = next(node for node in tree.body if isinstance(node, ast.If) and ast.unparse(node.test) == 'st.session_state.step == 1')
    pages = []
    while branch:
        ui = Recorder()
        class Time:
            @staticmethod
            def sleep(_seconds): pass  # Timing is retained by the native animation player.
        exec(compile(ast.Module(body=branch.body, type_ignores=[]), str(SOURCE), 'exec'), {**constants, 'st': ui, 'time': Time})
        pages.append(ui.nodes)
        branch = branch.orelse[0] if branch.orelse else None
    assert len(pages) == 8
    return {'sourceSha256': hashlib.sha256(source.replace('\r\n','\n').encode()).hexdigest(), 'frameDelayMs': 600, 'footer': ast.literal_eval(tree.body[-1].value.args[0]), 'pages': pages}

if __name__ == '__main__':
    OUTPUT.write_text(json.dumps(extract(), ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    print('Extracted all eight authored Dabbo screens.')
