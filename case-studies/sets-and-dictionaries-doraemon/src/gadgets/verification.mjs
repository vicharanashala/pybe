// Run each program once, then check its authored assertions in the same namespace.
export function verificationProgram(code,tests){return `import contextlib as _contextlib, io as _io, json as _json
_pybe_scope = {}
_pybe_stdout = _io.StringIO()
_pybe_error = None
try:
    with _contextlib.redirect_stdout(_pybe_stdout):
        exec(${JSON.stringify(code)}, _pybe_scope)
except Exception as _exc:
    _pybe_error = type(_exc).__name__ + ': ' + str(_exc)
_pybe_tests = _json.loads(${JSON.stringify(JSON.stringify(tests))})
_pybe_results = []
for _test in _pybe_tests:
    _error = _pybe_error
    if not _error:
        try:
            if 'expectedStdout' in _test:
                assert _pybe_stdout.getvalue().strip() == _test['expectedStdout'].strip(), 'Output does not match the expected result.'
            elif _test.get('testCode'):
                with _contextlib.redirect_stdout(_io.StringIO()):
                    exec(_test['testCode'], _pybe_scope)
        except Exception as _exc:
            _error = type(_exc).__name__ + ': ' + str(_exc)
    _pybe_results.append({'description':_test['description'],'passed':not bool(_error),'error':_error})
print(_json.dumps({'stdout':_pybe_stdout.getvalue(),'error':_pybe_error,'success':not bool(_pybe_error) and all(t['passed'] for t in _pybe_results),'results':_pybe_results}))
`;}
