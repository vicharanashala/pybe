"""Exercise authored reference code with the same wrapper used by the worker."""
import json
import os
from pathlib import Path
import re
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
scope = {}
exec((ROOT / 'library/learning/python-runtime.py').read_text(encoding='utf-8'), scope)
execute = scope['_pybe_execute']


def run(code, **kwargs):
    return json.loads(execute(json.dumps(dict(code=code, **kwargs))))


class PythonRuntimeTests(unittest.TestCase):
    def test_output_errors_and_namespace_isolation(self):
        self.assertEqual(run('hidden = 42\nprint(hidden)')['output'], '42\n')
        self.assertIn('NameError', run('print(hidden)')['error'])
        self.assertEqual(run('print("works after error")')['output'], 'works after error\n')

    def test_input_fictional_apis_and_inspection(self):
        self.assertEqual(run('print(input("Name: "))', input=['Ada'])['output'], 'Name: Ada\n')
        self.assertIn('EOFError', run('input()')['error'])
        result = run('total = 0\nfor _ in range(4):\n    total += get_coin_inserted()\nprint(total)', inspect=True)
        self.assertEqual(result['output'], '20\n')
        self.assertEqual(result['variables']['total'], '20')
        self.assertTrue(result['trace'])
        self.assertEqual(run('print(ask_for_pin(), correct_pin)')['output'], '9999 1234\n')

    def test_functions_and_comprehensions_share_a_namespace(self):
        result = run('values = [1, 2]\ndef twice():\n    return [x*2 for x in values]\nprint(twice())')
        self.assertIsNone(result['error'])
        self.assertEqual(result['output'], '[2, 4]\n')

    def test_story_fictional_operation_runs_the_authored_exception_code(self):
        registry = json.loads((ROOT / 'shared/lesson-registry.json').read_text())
        definition = registry['collections']['monkey-and-crocodile']
        steps = json.loads((ROOT / definition['output']).read_text(encoding='utf-8'))
        coding = next(step for step in steps if step['type'] == 'coding')
        result = run(coding['completeCode'], fixtures=definition['fixtures'])
        self.assertIsNone(result['error'], result['error'])
        self.assertEqual(result['output'].strip(), coding['expectedOutput'])

    def test_dictionary_editor_runs_the_story_task(self):
        steps = json.loads((ROOT / 'library/lessons/royal-tax-registry.json').read_text(encoding='utf-8'))
        coding = next(step for step in steps if step['type'] == 'coding')
        program = coding['starterCode'] + '\nregistry["Awadh"] = 600\nprint(registry["Bengal"])'
        result = run(program)
        self.assertIsNone(result['error'], result['error'])
        self.assertEqual(result['output'].strip(), coding['validation']['expectedOutput'])

    def test_all_authored_reference_programs(self):
        registry = json.loads((ROOT / 'shared/lesson-registry.json').read_text())
        previous = Path.cwd()
        with tempfile.TemporaryDirectory(prefix='pybe-reference-') as work:
            os.chdir(work)
            try:
                for source in registry['collections'].values():
                    if not isinstance(source, str):
                        continue
                    topics = json.loads((ROOT / source).read_text(encoding='utf-8'))
                    for topic in topics:
                        for level in topic['levels']:
                            for case in level['caseStudies']:
                                with self.subTest(topic=topic['topicId'], case=case['id']):
                                    stage = case['stage3']
                                    order = iter(stage.get('correctOrder', [token['value'] for token in stage['tokens'] if token.get('correct')]))
                                    code = re.sub(r'_{2,}', lambda _: next(order), stage['codeTemplate'])
                                    result = run(code)
                                    self.assertIsNone(result['error'], result['error'])
                                    if stage.get('validation', {}).get('type') == 'exact':
                                        self.assertEqual(result['output'].strip(), stage['validation']['expected'].strip())
            finally:
                os.chdir(previous)


if __name__ == '__main__':
    unittest.main()
